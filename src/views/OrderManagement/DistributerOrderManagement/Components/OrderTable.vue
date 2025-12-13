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
          :items="DistributerOrders"
          items-per-page="100"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                ><center>
                  <span class="table_topic">Distributer Orders</span>
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
                        `/ordersummary/distributerorder/${props.item.id}`
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
        </v-data-table>
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
                `/sendsalesrep/${selectedOrderid}/${selectedDistributerid}/${selectedDistributerOrderid}`
              )
            "
            ><span class="text">Sales Reps Orders</span></v-btn
          >
          <div class="pt-2"></div>
          <v-btn
            class="subdistributer_button"
            variant="none"
            @click="
              $router.push(
                `/sendsubdistributer/${selectedOrderid}/${selectedDistributerid}/${selectedDistributerOrderid}`
              )
            "
            ><span class="text">Sub-distributor Orders</span></v-btn
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
                `/updatesalesreps/${selectedOrderid}/${selectedDistributerid}/${selectedDistributerOrderid}`
              )
            "
            ><span class="text">Sales Reps Orders</span></v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedOrderid: "",
      selectedDistributerid: "",
      selectedDistributerOrderid: "",
      show: false,
      show1: false,
      headers: [
        {
          title: "Distributer Name",
          align: "start",
          key: "distributer_name",
        },
        { title: "Order ID", align: "start", key: "order_reference_id" },
        { title: "Invoice No", align: "start", key: "invoice_no" },
        { title: "Date", align: "start", key: "order_date" },
        { title: "Amount(Rs)", align: "start", key: "order_amount" },
        { title: "Distribute", align: "start", key: "distribution" },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
        { title: "Invoice", align: "start", key: "download_invoice" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
      DistributerOrders: [],
    };
  },

  props: {
    DistributerOrders: Array,
    loading: Boolean,
  },
};
</script>
