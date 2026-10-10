<template>
  <div class="order_management mt-9">
    <div class="text-right">
      <v-btn
        class="order_create_button order_collection_create_button"
        variant="none"
        @click="$router.push({
          name: 'sendshop',
          params: {
            main_order_id: 'no',
            distributer_id: 'no',
            distributer_order_id: 'no',
            sales_rep_id: 'no',
            reporder_id: 'no',
            position: 'directfromfactory',
          },
        })"
      >
        <template #prepend>
          <img src="@/assets/images/IconsSolid.png" alt="" />
        </template>
        <span class="text">Create Order Collection</span>
      </v-btn>
    </div>

    <div class="pt-15">
      <v-row>
        <v-col lg="4" cols="12">
          <v-text-field
            placeholder="Search order collections..."
            class="search_input"
            clearable
          >
            <template #prepend-inner>
              <v-icon icon="tabler-search" />
            </template>
          </v-text-field>
        </v-col>
        <v-col lg="4" cols="12">
          <AppDateTimePicker
            placeholder="Start Collection Date"
            class="search_date"
          />
        </v-col>
        <v-col lg="4" cols="12">
          <AppDateTimePicker
            placeholder="End Collection Date"
            class="search_date"
          />
        </v-col>
      </v-row>

      <div class="pt-3"></div>

      <v-card>
        <v-data-table :headers="headers" :items="collectionRows" item-value="id">
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>
                <span class="table_topic">Order Collections</span>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template #item.amount="{ item }">
            {{ formatAmount(item.amount) }}
          </template>

          <template #item.status="{ item }">
            <v-chip
              size="small"
              variant="tonal"
              :color="statusColor(item.status)"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.action="{ item }">
            <div class="d-flex align-center justify-center">
              <v-btn
                icon
                size="small"
                variant="text"
                aria-label="View order summary"
                @click="viewOrderSummary(item)"
              >
                <v-icon icon="tabler-eye" color="primary" />
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                aria-label="Edit customer order"
                @click="editShopOrder(item)"
              >
                <v-icon icon="tabler-edit" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
import {
  approvedOrderCollectionIds,
  createdOrderCollectionRows,
  sampleOrderCollectionRows,
} from "@/utils/orderCollectionUiState";

export default {
  data() {
    return {
      headers: [
        { title: "Date", key: "date", align: "start" },
        { title: "Customer", key: "customer", align: "start" },
        { title: "Amount (Rs.)", key: "amount", align: "start" },
        { title: "Invoice Number", key: "invoiceNumber", align: "start" },
        { title: "Order ID", key: "orderId", align: "start" },
        { title: "Status", key: "status", align: "start" },
        { title: "Action", key: "action", align: "center", sortable: false },
        { title: "Last Updated By", key: "lastUpdatedBy", align: "start" },
      ],
    };
  },

  computed: {
    collectionRows() {
      return [...sampleOrderCollectionRows, ...createdOrderCollectionRows].map(
        (order) => {
          const orderId = order.order_reference_id || order.orderId;

          return {
            ...order,
            shopOrderId: order.shopOrderId || order.shop_order_id,
            invoiceNumber: order.invoice_no || order.invoiceNumber,
            orderId,
            lastUpdatedBy: order.last_updated_by || order.lastUpdatedBy,
            status: approvedOrderCollectionIds.has(String(orderId))
              ? "Approved"
              : order.status,
          };
        },
      );
    },
  },

  methods: {
    statusColor(status) {
      const value = String(status || "").toLowerCase();

      if (/approved|complete|paid|delivered|success/.test(value)) {
        return "success";
      }
      if (/rejected|cancelled|canceled|failed|overdue/.test(value)) {
        return "error";
      }
      if (/pending|awaiting|review|processing/.test(value)) {
        return "warning";
      }

      return "info";
    },

    getShopOrderId(item) {
      const row = item?.raw ?? item;

      return row?.shopOrderId ?? row?.shop_order_id ?? row?.id;
    },

    editShopOrder(item) {
      const row = item?.raw ?? item;
      const shopOrderId = this.getShopOrderId(row);
      if (shopOrderId == null || shopOrderId === "") return;

      this.$router.push({
        name: "updateshop",
        params: { shop_order_id: shopOrderId },
        query: {
          uiOnly: "true",
          customer: row.customer,
          date: row.date,
          invoiceNumber: row.invoiceNumber,
          orderId: row.orderId,
          amount: row.amount,
        },
      });
    },

    viewOrderSummary(item) {
      const row = item?.raw ?? item;
      const shopOrderId = this.getShopOrderId(row);
      if (shopOrderId == null || shopOrderId === "") return;

      this.$router.push({
        name: "ordersummary",
        params: {
          summary_type: "factoryorder",
          order_id: shopOrderId,
        },
        query: {
          uiOnly: "true",
          orderId: row.orderId,
          customer: row.customer,
          date: row.date,
          amount: row.amount,
        },
      });
    },

    formatAmount(amount) {
      return new Intl.NumberFormat("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(amount) || 0);
    },
  },
};
</script>

<style scoped>
.order_collection_create_button {
  width: auto;
  min-width: 250px;
  padding-inline: 16px;
  white-space: nowrap;
}
</style>
