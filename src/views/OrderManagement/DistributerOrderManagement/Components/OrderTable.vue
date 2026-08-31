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
          :items="DistributerOrders"
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
                  <span class="table_topic">ShowRoom Orders</span>
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
            <!-- distributer name -->
            <div v-if="header.key === 'distributer_name'">
              {{ props.item.distributer.distributer_name }}
            </div>

            <!-- order reference id -->
            <div v-if="header.key === 'order_reference_id'">
              {{ props.item.order_reference_id }}
            </div>

            <!-- invoice no -->
            <div v-if="header.key === 'invoice_no'">
              <span> {{ props.item.invoice_no }}</span>
            </div>

            <!-- order date -->
            <div v-if="header.key === 'order_date'">
              <span> {{ props.item.order_date }}</span>
            </div>

            <!-- order amount -->
            <div v-if="header.key === 'order_amount'">
              <span>
                {{ getPrice(props.item.order_amount) }}
              </span>
            </div>

            <!-- remaining quantity per product -->
            <div v-if="header.key === 'remaining_quantity'">
              <v-list density="compact" class="remaining_quantity_list">
                <v-list-item
                  v-for="product in props.item.distributer_order_items"
                  :key="product"
                  class="px-0"
                  min-height="auto"
                >
                  {{ makeUpperCase(product.product_code) }} -
                  {{ makeUpperCase(product.product_name) }}:
                  <span class="remaining_quantity_value">{{
                    product.pivot.uptodate_quantity
                  }}</span>
                  / {{ product.pivot.quantity }}
                </v-list-item>
              </v-list>
            </div>

            <!-- distribution -->
            <div v-if="header.key === 'distribution'">
              <v-row>
                <v-col lg="4">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      show = true;
                      selectedOrderid = props.item.order_id;
                      selectedDistributerid = props.item.distributer_id;
                      selectedDistributerOrderid = props.item.id;
                    "
                  >
                    <img src="@/assets/images/plus.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="4"> </v-col>
              </v-row>
            </div>

            <!-- edit sales rep distribution -->
            <div v-if="header.key === 'rep_distribution'">
              <v-row>
                <v-col lg="4">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      show1 = true;
                      selectedOrderid = props.item.order_id;
                      selectedDistributerid = props.item.distributer_id;
                      selectedDistributerOrderid = props.item.id;
                    "
                  >
                    <img src="@/assets/images/edit.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="4"> </v-col>
              </v-row>
            </div>

            <!-- status -->
            <div v-if="header.key === 'status'">
              <span>
                {{ props.item.status }}
              </span>
            </div>

            <!-- action -->
            <div v-if="header.key === 'action'">
              <v-row>
                <v-col lg="4">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      $router.push(
                        `/ordersummary/distributerorder/${props.item.id}`,
                      )
                    "
                  >
                    <img src="@/assets/images/eye.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>

            <!-- download invoice -->
            <div v-if="header.key === 'download_invoice'">
              <v-btn
                color="primary"
                @click="$router.push(`distributeorderinvoice/${props.item.id}`)"
                ><span> View Invoice</span>
              </v-btn>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>
          </template>
        </v-data-table-server>
      </v-responsive>
    </v-skeleton-loader>

    <!-- open send forms dialog -->

    <v-dialog v-model="show" max-width="327px" min-height="180px" persistent>
      <v-card class="order_management">
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
        <v-card-text class="distributer_selection_model">
          <v-btn
            class="salesrep_button"
            variant="none"
            @click="
              $router.push(
                `/sendsalesrep/${selectedOrderid}/${selectedDistributerid}/${selectedDistributerOrderid}`,
              )
            "
            ><span class="text">Send To SalesReps</span></v-btn
          >
          <div class="pt-2"></div>
          <v-btn
            class="subdistributer_button"
            variant="none"
            @click="
              $router.push(
                `/sendshop/${selectedOrderid}/${selectedDistributerid}/${selectedDistributerOrderid}/no/no/courier`,
              )
            "
            ><span class="text">Send To Couriers</span></v-btn
          >
          <div class="pt-2"></div>
          <v-btn
            class="salesrep_button"
            variant="none"
            @click="openSupplierPicker()"
            ><span class="text">Supplier Orders</span></v-btn
          >
          <div class="pt-2"></div>
          <v-btn
            class="shop_button"
            variant="none"
            @click="
              $router.push(
                `/sendshop/${selectedOrderid}/${selectedDistributerid}/${selectedDistributerOrderid}/no/no/directfromshowroom`,
              )
            "
            ><span class="text">Direct Shops</span></v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- open update send forms dialog -->

    <v-dialog v-model="show1" max-width="327px" min-height="180px" persistent>
      <v-card class="order_management">
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="show1 = false">
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
        <v-card-text class="distributer_selection_model">
          <v-btn
            class="salesrep_button"
            variant="none"
            @click="
              $router.push(
                `/updatesalesreps/${selectedOrderid}/${selectedDistributerid}/${selectedDistributerOrderid}`,
              )
            "
            ><span class="text">Sales Reps Orders</span></v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- pick supplier to distribute showroom stock to -->

    <v-dialog
      v-model="showSupplierPicker"
      max-width="400px"
      min-height="180px"
      persistent
    >
      <v-card class="order_management">
        <div class="text-right">
          <v-btn
            color="transparent"
            variant="none"
            @click="showSupplierPicker = false"
          >
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
        <v-card-text class="distributer_selection_model">
          <!-- select supplier -->
          <label class="label">Select Supplier</label>
          <div class="pt-2"></div>
          <v-autocomplete
            v-model="selectedSupplier"
            placeholder="Select Supplier"
            class="select_supplier"
            :items="suppliers"
            item-title="suplier_name"
            item-value="id"
            return-object
          ></v-autocomplete>
          <div class="pt-4"></div>
          <v-btn
            class="salesrep_button"
            variant="none"
            :disabled="!selectedSupplier"
            @click="goToAddPurchaseOrder()"
            ><span class="text">Continue</span></v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SupplierApi from "@/Api/Modules/supply_chain";

export default {
  data() {
    return {
      selectedOrderid: "",
      selectedDistributerid: "",
      selectedDistributerOrderid: "",
      show: false,
      show1: false,
      showSupplierPicker: false,
      suppliers: [],
      selectedSupplier: null,
      headers: [
        {
          title: "ShowRoom Name",
          align: "start",
          key: "distributer_name",
        },
        { title: "Distributed Order ID", align: "start", key: "order_reference_id" },
        { title: "Distributed Invoice No", align: "start", key: "invoice_no" },
        { title: "Date", align: "start", key: "order_date" },
        { title: "Amount(Rs)", align: "start", key: "order_amount" },
        {
          title: "Remaining Qty",
          align: "start",
          key: "remaining_quantity",
        },
        { title: "Distribute", align: "start", key: "distribution" },
        { title: "Edit Rep Orders", align: "start", key: "rep_distribution" },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
        { title: "Invoice", align: "start", key: "download_invoice" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
    };
  },

  props: {
    DistributerOrders: Array,
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

    // open the supplier picker for distributing this showroom order's
    // remaining stock to a supplier (goods settlement)
    async openSupplierPicker() {
      this.selectedSupplier = null;
      this.show = false;

      if (!this.suppliers.length) {
        const res = await SupplierApi.AllSuppliers({ searchdata: "", page: 1, per_page: 1000 });
        this.suppliers = res.data.data.data || [];
      }

      this.showSupplierPicker = true;
    },

    // go to the Add Purchase Order form for the chosen supplier, carrying
    // this showroom order's context so it distributes from its remaining
    // stock instead of behaving like a normal purchase
    goToAddPurchaseOrder() {
      this.showSupplierPicker = false;

      this.$router.push({
        name: "add_purchase_order",
        params: {
          id: this.selectedSupplier.id,
          name: this.selectedSupplier.suplier_name,
        },
        query: {
          disorder_id: this.selectedDistributerOrderid,
          distributer_id: this.selectedDistributerid,
        },
      });
    },
  },
};
</script>
