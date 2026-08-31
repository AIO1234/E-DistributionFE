<template>
  <div class="order_management mt-9">
    <!-- select salesrep id -->
    <div
      v-if="
        authRole === 'Super Admin' ||
        authRole === 'Admin' ||
        authRole === 'Staff'
      "
    >
      <v-row class="select_row">
        <!-- select rep -->
        <v-col lg="3" cols="12">
          <label class="label">Select Rep</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select Sales Rep /ID"
            class="user_select_button"
            v-model="salesrep_id"
            :items="salesreps"
            item-title="rep_name"
            item-value="id"
            @update:model-value="onSalesRepSelected()"
          ></v-autocomplete>
        </v-col>

        <!-- select vehicle -->
        <v-col lg="3" cols="12">
          <label class="label">Select Vehicle</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select Vehicle"
            class="user_select_button"
            v-model="vehicle_id"
            :items="vehicles"
            item-title="vehicle_no"
            item-value="id"
            clearable
          ></v-autocomplete>
        </v-col>
      </v-row>
    </div>
    <!-- search boxes -->
    <div
      class="pt-15"
      v-if="
        salesrep_id !== 'Select Sales Rep /ID' &&
        (authRole === 'Area Manager' ||
          authRole === 'SalesRep' ||
          authRole === 'Super Admin' ||
          authRole === 'Admin' ||
          authRole === 'Staff')
      "
    >
      <v-row class="search_row">
        <!-- search order number -->
        <v-col lg="4" cols="12">
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
        <v-col lg="2" cols="12">
          <v-btn class="search_button" variant="none"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="clearFilters()"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>
      </v-row>
      <v-row class="search_row">
        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="exportOrders"
              :fields="headers"
              worksheet="All Sales Rep Orders"
              :name="`as of ${todaydate} salesreporders.xls`"
              :before-generate="loadExportOrders"
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>
      <!-- remaining stock for the selected rep -->
      <div class="pt-3"></div>
      <v-row v-if="salesrep_id !== ''">
        <v-col lg="3" cols="12">
          <div class="shop_balance_amount">
            <span class="text">
              Remaining Full Quantity For
              <b>{{ selectedSalesRepName }}</b> :
              <b class="amount">{{ remainingSalesRepQuantity }}</b>
            </span>
          </div>
        </v-col>
      </v-row>

      <!-- remaining stock for the selected vehicle -->
      <v-row v-if="vehicle_id">
        <v-col lg="3" cols="12">
          <div class="shop_balance_amount">
            <span class="text">
              Remaining Full Quantity For
              <b>{{ selectedVehicleNo }}</b> :
              <b class="amount">{{ remainingVehicleQuantity }}</b>
            </span>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="pt-12">
      <!-- table -->
      <v-card>
        <Table
          :SalesRepOrders="displayedSalesRepOrders"
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
import { store } from "@/store";
import Table from "./Components/OrderTable.vue";
import SalesRepApi from "@/Api/Modules/salesrep";
import VehiclesApi from "@/Api/Modules/vehicles";
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
      salesRepOrders: [],
      exportOrders: [],
      salesreps: [],
      salesrep_id: "",
      vehicles: [],
      vehicle_id: "",
      // the component has data to load as soon as it's created, so it
      // starts in the loading state rather than flashing "empty" first
      loading: true,
      authRole: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
      headers: {
        "Rep Name": "salesrep.rep_name",
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
    // name of the currently selected sales rep
    selectedSalesRepName() {
      return (
        this.salesreps.find(
          (salesRep) => String(salesRep.id) === String(this.salesrep_id),
        )?.rep_name || "Selected Rep"
      );
    },

    // number of the currently selected vehicle
    selectedVehicleNo() {
      return (
        this.vehicles.find(
          (vehicle) => String(vehicle.id) === String(this.vehicle_id),
        )?.vehicle_no || "Selected Vehicle"
      );
    },

    // rep/search/date filtering all happens server-side, vehicle isn't a
    // filter the backend supports so it's applied on top of whatever page is
    // currently loaded - remaining quantity below is therefore only a
    // current-page total when a vehicle is selected, not a total across
    // every matching order
    displayedSalesRepOrders() {
      return this.vehicle_id
        ? this.salesRepOrders.filter(
            (order) => String(order.vehicle_id) === String(this.vehicle_id),
          )
        : this.salesRepOrders;
    },

    // remaining quantity per product, summed across the current page of orders
    remainingSalesRepQuantity() {
      return this.salesRepOrders.reduce(
        (total, order) =>
          total +
          (order.distributer_salesrep_order_items || []).reduce(
            (itemTotal, product) =>
              itemTotal + Number(product.pivot?.uptodate_quantity || 0),
            0,
          ),
        0,
      );
    },

    // remaining quantity per product for the selected vehicle's orders on the current page
    remainingVehicleQuantity() {
      return this.displayedSalesRepOrders.reduce(
        (total, order) =>
          total +
          (order.distributer_salesrep_order_items || []).reduce(
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
    startdate() {
      this.search();
    },
    enddate() {
      this.search();
    },
  },

  async created() {
    // load the user's role, available reps, and the initial order data
    this.getAuthUser();

    await this.SalesReps();
    await this.getVehicles();
    this.initializeData();
    await this.getAllSalesRepOrders();
  },

  methods: {
    // initialize data
    initializeData() {
      // restore a previously selected rep for administrative users
      const { getSelectedSalesRepId } = store.getters;

      // if user loged as administratave
      if (
        getSelectedSalesRepId !== null &&
        (this.authRole === "Super Admin" ||
          this.authRole === "Admin" ||
          this.authRole === "Staff")
      ) {
        // set salesrep id from the store(if available)
        this.salesrep_id = getSelectedSalesRepId;
      }
    },

    // persist the selected rep and reload page 1 filtered server-side
    async onSalesRepSelected() {
      store.commit("SET_SELECTED_SALESREP_ID", this.salesrep_id);
      await this.search();
    },

    // get authenticated user role
    getAuthUser() {
      const { getRole } = store.getters;

      this.authRole = getRole;
    },

    // get vehicles for the vehicle select
    async getVehicles() {
      const res = await VehiclesApi.allVehicles({ page: 1, per_page: 1000 });

      this.vehicles = res.data.data.data;
    },

    // get salesreps
    async SalesReps() {
      // load selectable reps for admins; other roles' orders are loaded once by created()
      // does not toggle `loading` - that flag is reserved for the order table's own fetch
      if (
        this.authRole === "Super Admin" ||
        this.authRole === "Admin" ||
        this.authRole === "Staff"
      ) {
        const res = await SalesRepApi.allSalesReps({ page: 1, per_page: 1000 });

        this.salesreps = res.data.data.data;
      }
    },

    // load the current page of orders the logged-in user is allowed to see -
    // admins get every rep's orders (empty salesrep_id) unless one is
    // selected; rep/area-manager roles are scoped server-side to their own
    // orders regardless of what's sent
    async getAllSalesRepOrders() {
      this.loading = true;

      const payload = {
        salesrep_id: this.salesrep_id || "",
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        page: this.page,
        per_page: this.itemsPerPage,
      };

      const res = await SalesRepApi.allSalesRepOrders(payload);
      const pagination = res.data.data;

      this.salesRepOrders = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;
      this.loading = false;
    },

    // load the complete filtered order list (not just the current page) right
    // before the export fires, so the exported file matches the active filters
    // (vehicle isn't a server-side filter, so it's applied after loading)
    async loadExportOrders() {
      const payload = {
        salesrep_id: this.salesrep_id || "",
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        page: 1,
        per_page: 100000,
      };

      const res = await SalesRepApi.allSalesRepOrders(payload);
      const orders = res.data.data.data;

      this.exportOrders = this.vehicle_id
        ? orders.filter(
            (order) => String(order.vehicle_id) === String(this.vehicle_id),
          )
        : orders;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getAllSalesRepOrders();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getAllSalesRepOrders();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getAllSalesRepOrders();
    },

    // reset every filter (rep, vehicle, search text, dates) and reload page 1
    async clearFilters() {
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";
      this.salesrep_id = "";
      this.vehicle_id = "";
      store.commit("SET_SELECTED_SALESREP_ID", this.salesrep_id);
      await this.search();
    },
  },
};
</script>
