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
          :items="ShopOrders"
          items-per-page="100"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                ><center>
                  <span class="table_topic">Shop Orders</span>
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
            <!-- shop name -->
            <div v-if="header.key === 'shop_name'">
              {{ props.item.shop.shop_name }}
            </div>

            <!-- rep name -->
            <div v-if="header.key === 'rep_name'">
              {{ props.item.salesrep.rep_name }}
            </div>

            <!-- distributor name -->
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

            <!-- parent order no -->
            <div v-if="header.key === 'parent_order_no'">
              <span> {{ props.item.rep_order.order_reference_id }}</span>
            </div>

            <!-- parent invoice no -->
            <div v-if="header.key === 'parent_invoice _no'">
              <span> {{ props.item.rep_order.invoice_no }}</span>
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

            <!-- total due amount -->
            <div v-if="header.key === 'total_due_amount'">
              <span>
                {{ getPrice(props.item.total_due_amount) }}
              </span>
            </div>

            <!-- total paid amount -->
            <div v-if="header.key === 'total_paid_amount'">
              <span>
                {{ getPrice(props.item.total_paid_amount) }}
              </span>
            </div>

            <!-- download invoice -->
            <div v-if="header.key === 'download_invoice'">
              <v-btn
                color="primary"
                @click="$router.push(`shoporderinvoice/${props.item.id}`)"
                ><span> View Invoice</span>
              </v-btn>
            </div>

            <!-- delivery note -->
            <div v-if="header.key === 'delivery_note'">
              <v-btn
                color="primary"
                @click="$router.push(`shoporderdeliverynote/${props.item.id}`)"
                ><span> View delivery Note</span>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        { title: "Shop Name", align: "start", key: "shop_name" },
        { title: "Shop_Order ID", align: "start", key: "order_reference_id" },

        { title: "Shop_Invoice No", align: "start", key: "invoice_no" },
        {
          title: "Distributed Order Id",
          align: "start",
          key: "parent_order_no",
        },
        {
          title: "Distributed Invoice No",
          align: "start",
          key: "parent_invoice _no",
        },
        { title: "Date", align: "start", key: "order_date" },
        { title: "Amount(Rs)", align: "start", key: "order_amount" },
        { title: "Due Amount(Rs)", align: "start", key: "total_due_amount" },
        { title: "Paid Amount(Rs)", align: "start", key: "total_paid_amount" },
        { title: "Invoice", align: "start", key: "download_invoice" },
        { title: "Delivery Note", align: "start", key: "delivery_note" },

        { title: "Rep Name", align: "start", key: "rep_name" },
        {
          title: "Distributor Name",
          align: "start",
          key: "distributer_name",
        },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
      SalesRepOrders: [],
    };
  },

  props: {
    ShopOrders: Array,
    loading: Boolean,
  },
};
</script>
