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
          :items="SalesRepOrders"
          items-per-page="100"
        >
          <!-- contents -->
          <template
            v-for="header in headers"
            :key="header.value"
            v-slot:[`item.${header.key}`]="props"
          >
            <div v-if="header.key === 'order_reference_id'">
              {{ props.item.order_reference_id }}
            </div>

            <div v-if="header.key === 'invoice_no'">
              <span> {{ props.item.invoice_no }}</span>
            </div>
            <div v-if="header.key === 'order_date'">
              <span> {{ props.item.order_date }}</span>
            </div>
            <div v-if="header.key === 'order_amount'">
              <span>
                {{ props.item.order_amount }}
              </span>
            </div>
            <div v-if="header.key === 'distribution'">
              <v-row>
                <v-col lg="2">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      this.$router.push({
                        name: 'sendshop',
                        params: {
                          main_order_id: props.item.main_order_id,
                          distributer_id: props.item.distributer_id,
                          distributer_order_id: props.item.disorder_id,
                          sales_rep_id: props.item.salesrep_id,
                          reporder_id: props.item.id,
                        },
                      })
                      // $router.push(
                      //   `/sendshop/${props.item.main_order_id}/${props.item.distributer_id}/${props.item.disorder_id}/${props.item.salesrep_id}/${props.item.id}`
                      // )
                    "
                  >
                    <img src="@/assets/images/plus.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>

            <div v-if="header.key === 'status'">
              <span>
                {{ props.item.status }}
              </span>
            </div>

            <div v-if="header.key === 'action'">
              <v-row>
                <v-col lg="2">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      $router.push(
                        `/ordersummary/salesreporder/${props.item.id}`
                      )
                    "
                  >
                    <img src="@/assets/images/eye.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>
            <div v-if="header.key === 'download_invoice'">
              <v-btn
                color="primary"
                @click="$router.push(`shoporderdeliverynote/${props.item.id}`)"
                ><span> View Invoice</span>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        { title: "Order ID", align: "start", key: "order_reference_id" },
        { title: "Invoice No", align: "start", key: "invoice_no" },
        { title: "Date", align: "start", key: "order_date" },
        { title: "Amount(Rs)", align: "start", key: "order_amount" },
        { title: "Distribute", align: "start", key: "distribution" },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
        { title: "Invoice", align: "start", key: "download_invoice" },
      ],
      SalesRepOrders: [],
    };
  },

  props: {
    SalesRepOrders: Array,
    loading: Boolean,
  },
};
</script>
