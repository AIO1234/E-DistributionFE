<template>
  <div class="order_management mt-5">
    <!-- select shop id -->
    <div>
      <label class="label">Select Shop</label>
      <div class="pt-2"></div>
      <v-autocomplete
        placeholder="Select Shop"
        class="user_select_button"
        v-model="shop_id"
        :items="shops"
        :loading="shopsLoading"
        no-filter
        item-title="shop_name"
        item-value="id"
        @update:model-value="onShopSelected"
        @update:search="onShopSearch"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="item.raw.shop_name"
            :subtitle="
              item.raw.area?.area_name ?? item.raw.area_name ?? ''
            "
          ></v-list-item>
        </template>
      </v-autocomplete>
    </div>

    <div class="pt-7"></div>
    <!-- shop due and stock balances -->
    <div v-if="shop_id !== ''">
        <div class="shop_balance_amount">
          <span class="text"
            >Remaining Due Amount
            <span
              >For <b>{{ shop_name ? shop_name : null }}</b></span
            >
            :

            <b class="amount">{{
              getPrice(shop_due_amount ? shop_due_amount : 0)
            }}</b>
          </span>
        </div>

        <!-- sent / returned stock totals come from the Super Admin-only
             sales report, so only show them for Super Admin -->
        <template v-if="authRole === 'Super Admin'">
          <div class="pt-3"></div>
          <!-- total quantity sent to the selected shop -->
          <div class="shop_balance_amount">
            <span class="text">
              Sent Stock For <b>{{ shop_name || "Selected Shop" }}</b> :
              <b class="amount">{{ sentShopStockQuantity }}</b>
            </span>
          </div>

          <div class="pt-3"></div>
          <!-- total quantity returned by the selected shop -->
          <div class="shop_balance_amount">
            <span class="text">
              Returned Stock For <b>{{ shop_name || "Selected Shop" }}</b> :
              <b class="amount">{{ returnedShopStockQuantity }}</b>
            </span>
          </div>
        </template>

        <div class="pt-3"></div>
        <!-- shop paid amount -->
        <div class="shop_balance_amount">
          <span class="text"
            >Full Paid Amount
            <span
              >From <b>{{ shop_name ? shop_name : null }}</b></span
            >
            :

            <b class="amount">{{
              getPrice(shop_paid_amount ? shop_paid_amount : 0)
            }}</b>
          </span>
        </div>
    </div>

    <!-- search boxes -->
    <div class="pt-15" v-if="shop_id !== 'Select Shop'">
      <v-row>
        <!-- search order number -->
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Order Or Invoice Number.."
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="tabler-search"></v-icon>
            </template>
          </v-text-field>
        </v-col>

        <!-- start order date -->
        <v-col lg="2" cols="12">
          <AppDateTimePicker
            v-model="startdate"
            placeholder="Start Order Date"
            class="search_date"
          >
          </AppDateTimePicker>
        </v-col>

        <!--  end order date-->
        <v-col lg="2" cols="12">
          <AppDateTimePicker
            v-model="enddate"
            placeholder="End Order Date"
            class="search_date"
          >
          </AppDateTimePicker>
        </v-col>

        <!-- search button: searching happens live in the browser as you type, no click needed -->
        <v-col lg="3" cols="12">
          <v-btn class="search_button" variant="none"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="clear()"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="exportShopOrders"
              :fields="headers"
              worksheet="All Shop Orders"
              :name="
                shop_id != ''
                  ? `as of ${todaydate} ${shop_name} orders.xls`
                  : `as of ${todaydate} allshoporders.xls`
              "
              :before-generate="loadExportShopOrders"
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>

    </div>

    <div class="pt-12">
      <!-- table -->
      <v-card>
        <Table
          :ShopOrders="shopOrders"
          :loading="loading"
          :totalItems="totalItems"
          :currentPage="page"
          :itemsPerPage="itemsPerPage"
          @pagechange="pageChange"
          @pagesizechange="pageSizeChange"
        />
      </v-card>
    </div>
  </div>
</template>
<script>
import Table from "./Components/OrderTable.vue";
import shopApi from "@/Api/Modules/shop";
import ReportApi from "@/Api/Modules/reports";
import JsonExcel from "vue-json-excel3";
import mixin from "@/mixins/commonmixins";

export default {
  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD"
      ),
      searchdata: "",
      startdate: "",
      enddate: "",
      shopOrders: [],
      exportShopOrders: [],
      shops: [],
      shopsLoading: false,
      shop_id: "",
      loading: false,
      shop_paid_amount: "",
      shop_due_amount: "",
      shop_name: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
      // product items used to calculate sent and returned stock totals
      shopOrderStockDetails: [],
      authRole: "",

      headers: {
        "Shop Name": "shop.shop_name",
        "Shop Area": "shop.area.area_name",
        "Distributor Name": "distributer.distributer_name",
        "Rep Name": "salesrep.rep_name",
        "Invoice No": "invoice_no",
        "Distributed Order Id": "rep_order.parent_order_no",
        "Distributed Invoice No": "rep_order.parent_invoice _no",
        Amount: "order_amount",
        "Due Amount(Rs)": "total_due_amount",
        "Paid Amount(Rs)": "total_paid_amount",
        "Order Date": "order_date",
        Status: "rep_order.status",
        "Last Updated By": "last_updated_by",
      },
    };
  },

  components: {
    Table,
    downloadExcel: JsonExcel,
  },

  computed: {
    // loaded product items for only the selected shop's orders
    selectedShopStockDetails() {
      return this.shopOrderStockDetails.filter(
        (order) => String(order.shop_id) === String(this.shop_id),
      );
    },
    // total quantity sent to the selected shop
    sentShopStockQuantity() {
      // add each product quantity from all selected shop orders
      return this.selectedShopStockDetails.reduce(
        (total, order) =>
          total +
          order.items.reduce(
            (itemTotal, product) =>
              itemTotal + Number(product.pivot?.quantity || 0),
            0,
          ),
        0,
      );
    },
    // total quantity returned by the selected shop
    returnedShopStockQuantity() {
      // add each product return quantity from all selected shop orders
      return this.selectedShopStockDetails.reduce(
        (total, order) =>
          total +
          order.items.reduce(
            (itemTotal, product) =>
              itemTotal + Number(product.pivot?.return_quantity || 0),
            0,
          ),
        0,
      );
    },

  },

  watch: {
    // re-search server-side as the user types (debounced), same live-filter
    // feel as before but no longer limited to whatever page was loaded
    searchdata() {
      if (!this.debouncedSearch) {
        this.debouncedSearch = this.debounce(() => this.search(), 400);
      }

      this.debouncedSearch();
    },

    // date filters take effect immediately, no debounce needed
    startdate() {
      this.search();
    },
    enddate() {
      this.search();
    },
  },

  // load the selectable shops - with no shop selected, shop_id stays ""
  // and the backend returns every shop's orders instead of none
  async created() {
    this.getAuthUser();

    this.debouncedShopSearch = this.debounce(
      (searchdata) => this.getShops(searchdata),
      400,
    );

    await this.getShops();
    await this.getAllshopOrders();
  },

  methods: {
    // get shops matching the search text, capped so the whole 187+ shop
    // list is never loaded up front - typing narrows the results
    // server-side instead
    async getShops(searchdata = "") {
      this.shopsLoading = true;

      const payload = {
        seacrh_data: searchdata,
        page: 1,
        per_page: 40,
      };

      const res = await shopApi.allShops(payload);

      this.shops = res.data.data.data;

      this.shopsLoading = false;
    },

    // debounced so we don't fire a request on every keystroke. Vuetify
    // echoes the currently selected shop's own name back through this
    // event when the dropdown is simply reopened (not a real search the
    // user typed) - treat that as no search, otherwise it silently
    // narrows the list down to just the one shop already selected
    onShopSearch(searchdata) {
      const selectedShop = this.shops.find((val) => val.id === this.shop_id);
      const isEchoOfSelection = selectedShop && searchdata === selectedShop.shop_name;
      this.debouncedShopSearch(isEchoOfSelection ? "" : searchdata);
    },

    // picking a different shop starts a fresh view of it - a leftover
    // search term/date range picked while looking at the PREVIOUS shop
    // would otherwise silently carry over and filter out everything for
    // the newly selected shop
    async onShopSelected() {
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";

      // refresh the dropdown back to the default (unsearched) batch, so
      // reopening it right after picking a shop doesn't leave you stuck
      // looking at only the narrow search results that shop matched -
      // other shops are immediately browsable/searchable again
      await this.getShops();

      await this.search();
    },

    // load all selected-shop product rows with one aggregated report request.
    // the sales detailed report endpoint is Super Admin-only, so for every
    // other role (Staff, Admin, Distributer...) skip the call entirely - it
    // would just 403 - and let the sent/returned totals fall back to 0
    async loadShopOrderStockDetails() {
      if (this.authRole !== "Super Admin") {
        this.shopOrderStockDetails = [];
        return;
      }

      try {
        const res = await ReportApi.SalesWiseDetailedReport(
          "",
          this.shop_id,
          "",
          "",
          "",
          "",
          "",
        );

        this.shopOrderStockDetails = (res.data.data || []).map((order) => ({
          shop_id: order.shop_id,
          items: order.distributer_salesrep_shop_order_items || [],
        }));
      } catch {
        // show zero stock totals if the aggregated report cannot be loaded
        this.shopOrderStockDetails = [];
      }
    },

    // get the current page of shop orders
    async getAllshopOrders() {
      this.loading = true;

      const payload = {
        shop_id: this.shop_id,
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        page: this.page,
        per_page: this.itemsPerPage,
      };

      const res = await shopApi.allShopOrders(payload);

      if (res.data.data != null) {
        const pagination = res.data.data.shop_orders;

        this.shopOrders = pagination.data;
        this.totalItems = pagination.total;
        this.page = pagination.current_page;
        this.itemsPerPage = pagination.per_page;
        this.shop_paid_amount = res.data.data.paid_amount;
        this.shop_due_amount = res.data.data.due_amount;
        this.shop_name = res.data.data.shop_name;
        // load all item quantities through one aggregated report request
        await this.loadShopOrderStockDetails();
      } else {
        // clear old values when the selected shop has no orders
        this.shopOrders = [];
        this.totalItems = 0;
        this.shopOrderStockDetails = [];
      }
      this.loading = false;
    },

    // load the complete filtered order list (not just the current page) right
    // before the export fires, so the exported file matches the active filters
    async loadExportShopOrders() {
      const payload = {
        shop_id: this.shop_id,
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        page: 1,
        per_page: 100000,
      };

      const res = await shopApi.allShopOrders(payload);

      this.exportShopOrders =
        res.data.data != null ? res.data.data.shop_orders.data : [];
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getAllshopOrders();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getAllshopOrders();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getAllshopOrders();
    },

    // reset every filter and reload page 1
    async clear() {
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";
      await this.search();
    },
  },
};
</script>
