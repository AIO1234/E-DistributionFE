<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table-server
          :headers="filteredHeaders"
          :items="ShopOrders"
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
              {{ props.item.shop?.shop_name }}
            </div>

            <!-- shop area -->
            <div v-if="header.key === 'shop_area'">
              {{ props.item.shop?.area?.area_name ?? "N/A" }}
            </div>

            <!-- rep name -->
            <div v-if="header.key === 'rep_name'">
              {{ props.item.salesrep?.rep_name ?? "N/A" }}
            </div>

            <!-- distributor name -->
            <div v-if="header.key === 'distributer_name'">
              {{ props.item.distributer?.distributer_name }}
            </div>

            <!-- order source: sales rep, showroom, or direct from factory,
            each optionally via courier -->
            <div v-if="header.key === 'order_source'">
              {{ getOrderSource(props.item) }}
            </div>

            <!-- invoice no -->
            <div v-if="header.key === 'invoice_no'">
              <span> {{ props.item.invoice_no }}</span>
            </div>

            <!-- delivery_note_no -->
            <div v-if="header.key === 'delivery_note_no'">
              <span> {{ props.item.delivery_note_no }}</span>
            </div>

            <!-- parent order no -->
            <div v-if="header.key === 'parent_order_no'">
              <span> {{ getParentOrder(props.item)?.order_reference_id }}</span>
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

            <!-- courier -->
            <div v-if="header.key === 'courier_name'">
              {{ props.item.courier?.company_name ?? "N/A" }}
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>

            <!-- edit order - Super Admin only -->
            <div v-if="header.key === 'action'">
              <v-btn
                color="primary"
                @click="$router.push(`/updateshop/${props.item.id}`)"
                ><span>Edit</span>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
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
        { title: "Shop Area", align: "start", key: "shop_area" },
        { title: "Order Source", align: "start", key: "order_source" },
        { title: "Shop_Invoice No", align: "start", key: "invoice_no" },
        { title: "Delivery Nmber", align: "start", key: "delivery_note_no" },
        {
          title: "Distributed Order Id",
          align: "start",
          key: "parent_order_no",
        },
        { title: "Date", align: "start", key: "order_date" },
        { title: "Amount(Rs)", align: "start", key: "order_amount" },
        { title: "Due Amount(Rs)", align: "start", key: "total_due_amount" },
        { title: "Paid Amount(Rs)", align: "start", key: "total_paid_amount" },
        { title: "Invoice", align: "start", key: "download_invoice" },
        { title: "Delivery Note", align: "start", key: "delivery_note" },
        { title: "Courier", align: "start", key: "courier_name" },

        { title: "Rep Name", align: "start", key: "rep_name" },
        {
          title: "Distributor Name",
          align: "start",
          key: "distributer_name",
        },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
        { title: "Action", align: "start", key: "action" },
      ],
      authRole: "",
    };
  },

  created() {
    this.getAuthUser();
  },

  props: {
    ShopOrders: Array,
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

  computed: {
    // hide the courier column when no order on the current page has a
    // courier assigned - table is server-paginated, so this only reflects
    // the loaded page, not every matching order
    filteredHeaders() {
      const hasCourier = this.ShopOrders?.some((order) => order.courier);

      return this.headers.filter((header) => {
        if (header.key === "courier_name" && !hasCourier) return false;
        if (header.key === "action" && this.authRole !== "Super Admin")
          return false;
        return true;
      });
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

    // get the parent order this shop order was distributed from
    getParentOrder(item) {
      if (item.reporder_id) return item.rep_order;
      if (item.disorder_id) return item.disorder;
      if (item.main_order_id) return item.main_order;
      return null;
    },

    // where this shop order actually came from: a sales rep, straight from
    // a showroom, or straight from the factory - each of the latter two can
    // also be sent through a courier
    getOrderSource(item) {
      if (item.reporder_id) {
        return item.salesrep?.rep_name
          ? `Sales Rep (${item.salesrep.rep_name})`
          : "Sales Rep";
      }
      if (item.disorder_id)
        return item.courier ? "ShowRoom (Courier)" : "ShowRoom";
      if (item.main_order_id)
        return item.courier ? "Direct Factory (Courier)" : "Direct Factory";
      return "N/A";
    },
  },
};
</script>
