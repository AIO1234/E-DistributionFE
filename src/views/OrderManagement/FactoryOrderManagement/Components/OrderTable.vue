<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table
          :headers="headers"
          :items="FactryOrders"
          items-per-page="100"
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
            <!-- order reference id -->
            <div v-if="header.key === 'order_reference_id'">
              {{ props.item.order_reference_id }}
            </div>

            <!-- invoice no -->
            <div v-if="header.key === 'invoice_no'">
              <span> {{ props.item.invoice_no }}</span>
            </div>

            <!-- date -->
            <div v-if="header.key === 'date'">
              <span> {{ props.item.date }}</span>
            </div>

            <!-- amount -->
            <div v-if="header.key === 'amount'">
              <span>
                {{ getPrice(props.item.amount) }}
              </span>
            </div>

            <!-- distribution -->
            <div v-if="header.key === 'distribution'">
              <v-row>
                <v-col lg="4">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="$router.push(`/senddistributer/${props.item.id}`)"
                  >
                    <img src="@/assets/images/plus.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="4">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      $router.push(`/updatedistributerorders/${props.item.id}`)
                    "
                  >
                    <img src="@/assets/images/edit.png" style="width: 70%" />
                  </v-btn>
                </v-col>
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
                <v-col lg="3">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      $router.push(
                        `/ordersummary/factoryorder/${props.item.id}`
                      )
                    "
                  >
                    <img src="@/assets/images/eye.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="4" v-if="props.item.status === 'Pending'">
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
                color="primary"
                @click="$router.push(`factoryorderinvoice/${props.item.id}`)"
                ><span> View Invoice</span>
              </v-btn>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>
          </template>
        </v-data-table></v-responsive
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
export default {
  data() {
    return {
      selectedOrderId: {},
      show: false,
      headers: [
        { title: "Order ID", align: "start", key: "order_reference_id" },
        { title: "Invoice No", align: "start", key: "invoice_no" },
        { title: "Date", align: "start", key: "date" },
        { title: "Amount(Rs)", align: "start", key: "amount" },
        { title: "Distribute", align: "start", key: "distribution" },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
        { title: "Invoice", align: "start", key: "download_invoice" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
      FactryOrders: [],
    };
  },
  components: {
    UpdateOrder,
  },
  props: {
    FactryOrders: Array,
    loading: Boolean,
  },

  methods: {
    closeModal() {
      this.show = false;
      this.$emit("close");
    },
  },
};
</script>
