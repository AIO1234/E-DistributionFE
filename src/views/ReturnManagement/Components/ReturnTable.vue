<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      height="240"
      type="image, list-item-two-line"
      style="background-color: transparent"
    >
      <v-responsive v-if="Returns !== null && Returns.length !== 0">
        <v-data-table :headers="headers" :items="Returns" items-per-page="100">
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
              {{ props.item.invoice_no }}
            </div>

            <!-- return date -->
            <div v-if="header.key === 'return_date'">
              <span> {{ props.item.return_date }}</span>
            </div>

            <!-- order amount -->
            <div v-if="header.key === 'order_amount'">
              <span>
                {{ getPrice(props.item.order_amount) }}
              </span>
            </div>

              <!-- order amount -->
              <div v-if="header.key === 'return_amount'">
              <span>
                {{ getPrice(props.item.return_amount) }}
              </span>
            </div>

            <!-- action -->
            <div v-if="header.key === 'action'">
              <v-row>
                <v-col lg="2">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      $router.push(
                        `/returnsummary/${props.item.id}`
                      )
                    "
                  >
                    <img src="@/assets/images/eye.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
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
        { title: "Invoice No/S", align: "start", key: "invoice_no" },
        { title: "Returned Date", align: "start", key: "return_date" },
        { title: "Order Amount(Rs)", align: "start", key: "order_amount" },
        { title: "Return Amount(Rs)", align: "start", key: "return_amount" },
        { title: "Action", align: "start", key: "action" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
      Returns: [],
    };
  },

  props: {
    Returns: Array,
    shop: Object,
    loading: Boolean,
  },
};
</script>
