<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table-server
          :headers="headers"
          :items="FactryOrders"
          :items-length="totalItems"
          :page="currentPage"
          :items-per-page="itemsPerPage"
          @update:page="onPage"
          @update:items-per-page="onPerPage"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                ><center>
                  <span class="table_topic">All Orders</span>
                </center></v-toolbar-title
              >
            </v-toolbar>
          </template>
          <!-- contents -->
          <template
            v-for="header in headers"
            :key="header.value"
            v-slot:[`item.${header.key}`]="props"
          >
            <!-- date -->
            <div v-if="header.key === 'date'">
              <span> {{ props.item.date }}</span>
            </div>

            <div v-if="header.key === 'customer'">
              {{ props.item.customer || "-" }}
            </div>

            <!-- amount -->
            <div v-if="header.key === 'amount'">
              <span>
                {{ getPrice(props.item.amount) }}
              </span>
            </div>


            <!-- order collection fields -->
            <div v-if="header.key === 'invoice_no'">
              {{ props.item.invoice_no || "—" }}
            </div>

            <div v-if="header.key === 'order_reference_id'">
              {{ props.item.order_reference_id || "—" }}
            </div>

            <div v-if="header.key === 'good_receive_notice'">
              <span v-if="isPendingApproval(props.item)">N/A</span>
              <template v-else-if="getGrn(props.item)">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="primary"
                  aria-label="View GRN"
                  @click="openGrnView(props.item)"
                >
                  <v-icon icon="tabler-eye" color="primary" />
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="primary"
                  aria-label="Update GRN"
                  @click="openGrnForm(props.item)"
                >
                  <v-icon icon="tabler-edit" />
                </v-btn>
              </template>
              <span v-else>N/A</span>
            </div>

            <div v-if="header.key === 'delivery_note'">
              <v-btn
                v-if="props.item.isCollectionItem"
                color="primary"
                size="small"
                @click="openDeliveryNote(props.item)"
              >
                View Delivery Note
              </v-btn>
              <span v-else>N/A</span>
            </div>

            <div v-if="header.key === 'add_grn'">
              <span v-if="isPendingApproval(props.item)">N/A</span>
              <v-btn
                v-else-if="isConfirmed(props.item)"
                icon
                size="small"
                color="primary"
                variant="text"
                aria-label="Add GRN"
                @click="openGrnForm(props.item)"
              >
                <v-icon icon="tabler-plus" />
              </v-btn>
              <span v-else>N/A</span>
            </div>

            <!-- supplier payment is available once the order is approved -->
            <div v-if="header.key === 'make_payment'">
              <v-btn
                v-if="isApproved(props.item)"
                color="primary"
                size="small"
                @click="openSupplierPayments(props.item)"
              >
                Make Payment
              </v-btn>
              <span v-else>N/A</span>
            </div>

            <!-- status -->
            <div v-if="header.key === 'status'">
              <v-chip
                v-if="props.item.isCollectionItem"
                size="small"
                :color="props.item.status === 'Approved' ? 'success' : 'warning'"
                variant="tonal"
              >
                {{ props.item.status }}
              </v-chip>
              <span v-else>{{ props.item.status }}</span>
            </div>

            <!-- action -->
            <div v-if="header.key === 'action'">
              <v-row>
                <v-col lg="6">
                  <v-btn
                    v-if="!props.item.isCollectionItem"
                    color="transparent"
                    variant="none"
                    @click="
                      $router.push({
                        name: 'ordersummary',
                        params: {
                          summary_type: 'factoryorder',
                          order_id: props.item.id,
                        },
                        query: {
                          uiOnly: 'true',
                          orderId: props.item.order_reference_id,
                          customer: props.item.customer,
                          date: props.item.date,
                          amount: props.item.amount,
                          orderProducts: JSON.stringify(
                            props.item.order_products || [],
                          ),
                        },
                      })
                    "
                  >
                    <v-icon icon="tabler-eye" color="primary" />
                  </v-btn>
                  <v-btn
                    v-else
                    color="transparent"
                    variant="none"
                    aria-label="View order collection"
                    @click="
                      $router.push({
                        name: 'ordersummary',
                        params: {
                          summary_type: 'factoryorder',
                          order_id: props.item.shopOrderId,
                        },
                        query: {
                          uiOnly: 'true',
                          orderId: props.item.order_reference_id,
                          customer: props.item.customer,
                          date: props.item.date,
                          amount: props.item.amount,
                          orderProducts: JSON.stringify(
                            props.item.order_products || [],
                          ),
                        },
                      })
                    "
                  >
                    <v-icon icon="tabler-eye" color="primary" />
                  </v-btn>
                </v-col>
                <v-col lg="6" v-if="props.item.status === 'Pending'">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      show = true;
                      selectedOrderId = props.item.id;
                    "
                  >
                    <img src="@/assets/images/edit.png" style="width: 70%" />
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- download invoice -->
            <div v-if="header.key === 'download_invoice'">
              <v-btn
                v-if="!props.item.isCollectionItem"
                color="primary"
                @click="printOrder(props.item)"
                ><span> Print</span>
              </v-btn>
              <v-btn
                v-else
                color="primary"
                variant="outlined"
                @click="printOrder(props.item)"
              >
                <span>Print</span>
              </v-btn>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>
          </template>
        </v-data-table-server></v-responsive
      >
    </v-skeleton-loader>

    <!-- update order diaalog -->

    <v-dialog
      v-model="show"
      max-width="830.3px"
      min-height="216.97px"
      persistent
      scrollable=""
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="show = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
              />
            </svg>
          </v-btn>
        </div>

        <v-card-text>
          <UpdateOrder
            :order_id="selectedOrderId"
            @close="closeModal"
          /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import UpdateOrder from "./UpdateOrder.vue";
import { grnUiState, selectOrderForGrn } from "@/utils/grnUiState";
export default {
  data() {
    return {
      selectedOrderId: {},
      show: false,
      headers: [
        { title: "Date", align: "start", key: "date" },
        { title: "Customer", align: "start", key: "customer" },
        { title: "Amount(Rs)", align: "start", key: "amount" },
        { title: "Invoice Number", align: "start", key: "invoice_no" },
        { title: "Order ID", align: "start", key: "order_reference_id" },
        { title: "Good Receive Notice", align: "start", key: "good_receive_notice" },
        { title: "Delivery Note", align: "start", key: "delivery_note", sortable: false },
        { title: "Add GRN", align: "center", key: "add_grn", sortable: false },
        { title: "Make Payment", align: "center", key: "make_payment", sortable: false },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
        { title: "Print", align: "start", key: "download_invoice" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
    };
  },
  components: {
    UpdateOrder,
  },
  props: {
    FactryOrders: Array,
    loading: Boolean,
    totalItems: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 50,
    },
  },

  methods: {
    getRowKey(item) {
      return String(item?.id ?? item?.order_reference_id ?? "unknown");
    },

    getGrn(item) {
      return grnUiState.records[this.getRowKey(item)] || null;
    },

    isPendingApproval(item) {
      return String(item?.status || "").toLowerCase() === "pending approval";
    },

    isConfirmed(item) {
      return ["confirmed", "approved"].includes(
        String(item?.status || "").toLowerCase(),
      );
    },

    isApproved(item) {
      return String(item?.status || "").toLowerCase() === "approved";
    },

    openSupplierPayments(item) {
      this.$router.push({
        name: "payments",
        query: {
          create: "true",
          demoPayment: "true",
          orderId: item.order_reference_id || "",
          invoiceNumber: item.invoice_no || "",
          orderAmount: item.amount || item.order_amount || 0,
          shopId: item.shop_id || item.shop?.id || "",
          customer: item.customer || item.shop?.shop_name || "",
        },
      });
    },

    openGrnForm(item) {
      selectOrderForGrn(item);
      this.$router.push({
        name: this.getGrn(item) ? "updategrn" : "addgrn",
        params: { order_id: this.getRowKey(item) },
        query: {
          orderId: item.order_reference_id || "",
          customer: item.customer || item.shop?.shop_name || "",
          date: item.date || item.order_date || "",
        },
      });
    },

    openGrnView(item) {
      this.$router.push({
        name: "viewgrn",
        params: { order_id: this.getRowKey(item) },
      });
    },

    openDeliveryNote(item) {
      this.$router.push({
        name: "shoporderdeliverynote",
        params: { order_id: item.shopOrderId },
        query: {
          uiOnly: "true",
          collectionId: item.id,
          orderId: item.order_reference_id,
          customer: item.customer,
          date: item.date,
          invoiceNumber: item.invoice_no,
          deliveryNoteNumber: item.delivery_note_no,
          amount: item.amount,
        },
      });
    },

    printOrder(item) {
      if (!item.isCollectionItem) {
        this.$router.push({
          path: `/factoryorderinvoice/${item.id}`,
          query: { confirmPrint: "true" },
        });
        return;
      }

      this.$router.push({
        name: "shoporderinvoice",
        params: { order_id: item.shopOrderId },
        query: {
          uiOnly: "true",
          customer: item.customer,
          date: item.date,
          invoiceNumber: item.invoice_no,
          amount: item.amount,
          collectionId: item.id,
          orderId: item.order_reference_id,
          confirmPrint: "true",
        },
      });
    },

    // page change
    onPage(page) {
      this.$emit("pagechange", { page });
    },

    // items-per-page change
    onPerPage(perPage) {
      this.$emit("pagesizechange", {
        page: 1,
        per_page: perPage == -1 ? 10000 : perPage,
      });
    },

    // close the update-order dialog
    closeModal() {
      this.show = false;
      this.$emit("close");
    },
  },
};
</script>
