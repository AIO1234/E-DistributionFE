<template>
  <div class="report_managemnt mt-9">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search customer"
          placeholder="Customer name or code"
          class="search_input"
          clearable
        />
      </v-col>
    </v-row>

    <v-card class="mt-6">
      <v-data-table
        :headers="headers"
        :items="customers"
        item-value="id"
        :items-per-page="50"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>
              <span class="table_topic">Customer Outstanding</span>
            </v-toolbar-title>
          </v-toolbar>
        </template>

        <template #[`item.payment_term_days`]="{ item }">
          {{ item.payment_term_days }} Days
        </template>
        <template #[`item.total_outstanding`]="{ item }">
          {{ getPrice(item.total_outstanding) }}
        </template>
        <template #[`item.expected_payment_date`]="{ item }">
          {{ item.expected_payment_date }}
        </template>
        <template #[`item.orders`]="{ item }">
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            @click="openOrders(item)"
          >
            View {{ item.order_count }} Orders
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="showOrders" max-width="1100px" scrollable>
      <v-card v-if="selectedCustomer" class="order_management">
        <div class="order_summary pa-6">
          <v-row class="align-center">
            <v-col cols="10">
              <h2 class="order_id_title">
                {{ selectedCustomer.shop_name }} - Customer Outstanding Summary
              </h2>
            </v-col>
            <v-col cols="2" class="text-right">
              <v-btn icon="tabler-x" variant="text" @click="showOrders = false" />
            </v-col>
          </v-row>

          <div class="pt-8">
            <div
              v-for="order in selectedCustomer.orders"
              :key="order.id"
              class="mt-4"
            >
              <v-row>
                <v-col cols="12" md="4">
                  <span class="item_header">Order Created Date</span>
                  <div class="item_text">{{ order.order_date }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <span class="item_header">Number of products</span>
                  <div class="item_text">{{ order.products.length }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <span class="item_header">Full Order Value</span>
                  <div class="item_text">{{ getPrice(order.order_amount) }}</div>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import mixin from "@/mixins/commonmixins";
import { getDemoCustomerOutstandingRows } from "@/utils/supplierReturnDemoData";

export default {
  data() {
    return {
      search: "",
      showOrders: false,
      selectedCustomer: null,
      headers: [
        { title: "Customer Code", key: "shop_code" },
        { title: "Customer", key: "shop_name" },
        { title: "Payment Term", key: "payment_term_days" },
        { title: "Outstanding Orders", key: "order_count" },
        { title: "Total Outstanding (Rs.)", key: "total_outstanding", align: "end" },
        { title: "Next Expected Payment", key: "expected_payment_date" },
        { title: "Orders", key: "orders", sortable: false },
      ],
    };
  },
  computed: {
    customers() {
      return getDemoCustomerOutstandingRows(this.search);
    },
  },
  methods: {
    getPrice: mixin.methods.getPrice,
    openOrders(customer) {
      this.selectedCustomer = customer;
      this.showOrders = true;
    },
  },
};
</script>
