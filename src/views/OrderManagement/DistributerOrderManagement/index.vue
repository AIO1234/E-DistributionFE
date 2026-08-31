<template>
  <div class="order_management mt-9">
    <!-- headers -->
    <VRow>
      <VCol lg="6">
        <!-- select distributor id -->
        <div
          v-if="
            authRole === 'Super Admin' ||
            authRole === 'Admin' ||
            authRole === 'Staff'
          "
        >
          <label class="label">Select ShowRoom</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select ShowRoom /ID"
            class="user_select_button"
            v-model="distributer_id"
            :items="distributers"
            item-title="distributer_name"
            item-value="id"
            @update:model-value="onDistributerSelected()"
          ></v-autocomplete>
        </div>
      </VCol>

      <VCol lg="6">
        <div class="pt-6"></div>
        <!-- create button -->
        <div class="text-right">
          <v-btn
            class="order_create_button"
            variant="none"
            @click="$router.push(`/senddistributer/no`)"
          >
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Create Order</span>
          </v-btn>
        </div>
      </VCol>
    </VRow>
    <!-- search boxes -->
    <div
      class="pt-15"
      v-if="
        distributer_id !== 'Select ShowRoom /ID' &&
        (authRole === 'Area Manager' ||
          authRole === 'Distributer' ||
          authRole === 'Super Admin' ||
          authRole === 'Admin' ||
          authRole === 'Staff')
      "
    >
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

        <!-- end order date -->
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
              :data="exportOrders"
              :fields="headers"
              worksheet="All Distributers"
              :name="`as of ${todaydate} distributerorders.xls`"
              :before-generate="loadExportOrders"
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>

      <div class="pt-3"></div>
      <!-- remaining quantity in showroom -->
      <v-row v-if="distributer_id !== ''">
        <v-col lg="3" cols="12">
          <div class="shop_balance_amount">
            <span class="text">
              Remaining Full Quantity In
              <b>{{ selectedShowRoomName }}</b> :
              <b class="amount">{{ remainingShowRoomQuantity }}</b>
            </span>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- table -->
    <div class="pt-12">
      <v-card>
        <Table
          :DistributerOrders="distributerOrders"
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
import DistributerApi from "@/Api/Modules/distributer";
import { store } from "@/store";
import JsonExcel from "vue-json-excel3";
import mixin from "@/mixins/commonmixins";

export default {
  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD",
      ),
      searchdata: "",
      startdate: "",
      enddate: "",
      show: false,
      distributerOrders: [],
      exportOrders: [],
      distributers: [],
      distributer_id: "",
      loading: false,
      authRole: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
      headers: {
        "Order Id": "order_reference_id",
        "Invoice No": "invoice_no",
        Amount: "order_amount",
        Date: "order_date",
        Status: "status",
        "Last Updated By": "last_updated_by",
      },
    };
  },

  components: {
    Table,
    downloadExcel: JsonExcel,
  },

  computed: {
    // resolve the name that belongs to the currently selected showroom id
    selectedShowRoomName() {
      return (
        this.distributers.find(
          (distributer) =>
            String(distributer.id) === String(this.distributer_id),
        )?.distributer_name || "Selected ShowRoom"
      );
    },

    // sum the live remaining quantity for each product in the currently
    // loaded page of orders
    remainingShowRoomQuantity() {
      return this.distributerOrders.reduce(
        (total, order) =>
          total +
          (order.distributer_order_items || []).reduce(
            (itemTotal, product) =>
              itemTotal + Number(product.pivot?.uptodate_quantity || 0),
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
        this.debouncedSearch = mixin.methods.debounce(() => this.search(), 400);
      }

      this.debouncedSearch();
    },

    // date filters take effect immediately, same as before
    startdate() {
      this.search();
    },
    enddate() {
      this.search();
    },
  },

  async created() {
    // load the user's role, available showrooms, and the initial order data
    this.getAuthUser();

    await this.Distributers();
    this.initializeData();
    await this.getAllDistributerOrders();
  },

  methods: {
    // initialize data
    initializeData() {
      // restore a previously selected showroom for administrative users
      const { getSelectedDistributerId } = store.getters;

      // if user loged as administratave
      if (
        getSelectedDistributerId !== null &&
        (this.authRole === "Super Admin" ||
          this.authRole === "Admin" ||
          this.authRole === "Staff")
      ) {
        // set distributer id from the store(if available)
        this.distributer_id = getSelectedDistributerId;
      }
    },

    // persist the selected showroom and reload page 1 filtered server-side
    async onDistributerSelected() {
      store.commit("SET_SELECTED_DISTRIBUTER_ID", this.distributer_id);
      await this.search();
    },

    // get authenticated user role
    getAuthUser() {
      // read the authenticated user's role from the shared store
      const { getRole } = store.getters;

      this.authRole = getRole;
    },

    // get distributers
    async Distributers() {
      // load selectable showrooms for admins; other roles' orders are loaded once by created()
      if (
        this.authRole === "Super Admin" ||
        this.authRole === "Admin" ||
        this.authRole === "Staff"
      ) {
        this.loading = true;
        const res = await DistributerApi.allDistributers({ page: 1, per_page: 1000 });

        this.distributers = res.data.data.data;
        this.loading = false;
      }
    },

    // load the current page of orders the logged-in user is allowed to see - admins get every
    // showroom's orders (empty distributer_id) unless one is selected; area-manager/distributer
    // roles are scoped server-side to their own orders regardless of what's sent
    async getAllDistributerOrders() {
      this.loading = true;

      const payload = {
        distributer_id: this.distributer_id || "",
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        page: this.page,
        per_page: this.itemsPerPage,
      };

      const res = await DistributerApi.allDistributerOrders(payload);
      const pagination = res.data.data;

      this.distributerOrders = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;
      this.loading = false;
    },

    // load the complete filtered order list (not just the current page) right
    // before the export fires, so the exported file matches the active filters
    async loadExportOrders() {
      const payload = {
        distributer_id: this.distributer_id || "",
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        page: 1,
        per_page: 100000,
      };

      const res = await DistributerApi.allDistributerOrders(payload);

      this.exportOrders = res.data.data.data;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getAllDistributerOrders();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getAllDistributerOrders();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getAllDistributerOrders();
    },

    // reset every filter (ShowRoom, search text, dates) and reload page 1
    async clear() {
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";
      this.distributer_id = "";
      store.commit("SET_SELECTED_DISTRIBUTER_ID", this.distributer_id);
      await this.search();
    },

    // close order create
    async closeModal() {
      // close the dialog and refresh the selected showroom orders
      this.show = false;
      // call orders
      await this.getAllDistributerOrders();
    },
  },
};
</script>
