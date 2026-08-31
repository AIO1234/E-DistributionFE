<template>
  <div class="supplier_payments_management">
    <VSkeletonLoader :loading="loading" type="table-thead, table-tbody">
      <VDataTableServer
        :headers="headers"
        :items="paymentsData"
        :items-length="totalItems"
        :page="currentPage"
        :items-per-page="itemsPerPage"
        class="elevation-1"
        @update:page="onPage"
        @update:items-per-page="onPerPage"
      >
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <center>
                <span class="table_topic">All Supplier Payments</span>
              </center>
            </VToolbarTitle>
          </VToolbar>
        </template>

        <!-- supplier name -->
        <template #[`item.suplier_name`]="{ item }">
          <span class="text-uppercase font-weight-bold">{{
            item.suplier?.suplier_name || "N/A"
          }}</span>
        </template>

        <!-- payment value -->
        <template #[`item.payment_value`]="{ item }">
          Rs. {{ getPrice(item.total_amount) }}
        </template>

        <!-- purchase orders -->
        <template #[`item.purchase_order`]="{ item }">
          <div
            v-for="payment in item.supplier_order_payments"
            :key="payment.id"
            class="d-flex align-center ga-2"
          >
            <span>{{ payment.supplier_order.purchased_reference_id }}</span>
            <VChip
              :color="
                payment.supplier_order.due_amount > 0 ? 'warning' : 'success'
              "
              size="x-small"
              label
            >
              {{ payment.supplier_order.due_amount > 0 ? "Continue" : "Done" }}
            </VChip>
          </div>
        </template>

        <!-- order count chip -->
        <template #[`item.orders_count`]="{ item }">
          {{ item.orders_count || 0 }}
        </template>

        <!-- check no / date -->
        <template #[`item.check_details`]="{ item }">
          <div v-if="item.payment_method === 'Check'">
            <div>{{ item.check_no || "N/A" }}</div>
            <div class="text-caption text-grey">{{ item.check_date }}</div>
          </div>
          <span v-else class="text-caption text-grey">N/A</span>
        </template>

        <!-- payment status -->
        <template #[`item.payment_status`]="{ item }">
          <VChip
            :color="item.payment_status === 'Confirmed' ? 'success' : 'warning'"
            size="small"
            label
          >
            {{ item.payment_status === "Confirmed" ? "Paid" : "Pending" }}
          </VChip>
        </template>

        <!-- actions -->
        <template #[`item.action`]="{ item }">
          <div class="d-flex gap-2">
            <!-- edit -->
            <VBtn
              icon
              variant="text"
              size="small"
              @click="openUpdateModal(item)"
            >
              <VIcon icon="tabler-edit" color="secondary" />
            </VBtn>
          </div>
        </template>
      </VDataTableServer>
    </VSkeletonLoader>

    <!-- update supplier payment dialog -->
    <VDialog v-model="show" width="1000px" persistent scrollable>
      <VCard v-if="show && selectedItem">
        <VCardText>
          <UpdateForm
            v-if="show"
            :payment-data="selectedItem"
            :supplier="selectedItem.suplier"
            @close-modal="closeModal"
          />
        </VCardText>
      </VCard>
    </VDialog>

  </div>
</template>

<script>
import UpdateForm from "./UpdateSupplierPayments.vue";

export default {
  components: {
    UpdateForm,
  },
  props: {
    paymentsData: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    totalItems: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 },
    itemsPerPage: { type: Number, default: 50 },
  },
  data() {
    return {
      show: false,
      selectedItem: null,
      headers: [
        { title: "SUPPLIER NAME", key: "suplier_name" },
        { title: "REF ID", key: "payment_reference_id" },
        { title: "DATE", key: "payment_date" },
        { title: "PAYMENT VALUE (RS)", key: "payment_value" },
        { title: "PURCHASE ORDER", key: "purchase_order", width: "260px" },
        { title: "ORDER COUNT", key: "orders_count" },
        { title: "METHOD", key: "payment_method" },
        { title: "CHECK NO / DATE", key: "check_details" },
        { title: "STATUS", key: "payment_status" },
        { title: "ACTION", key: "action", sortable: false },
      ],
    };
  },
  methods: {
    // format a payment amount for display
    getPrice(amount) {
      return amount ? Number(amount).toLocaleString() : "0";
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

    // open update modal directly off the already-loaded row - no separate
    // edit-fetch, since the list already carries supplierOrderPayments.supplier_order
    openUpdateModal(item) {
      this.selectedItem = item;
      this.show = true;
    },

    // close the update modal, refreshing the list if a payment was updated
    closeModal(data) {
      this.show = false;
      this.selectedItem = null;
      if (data === "load") {
        this.$emit("refresh");
      }
    },
  },
};
</script>
