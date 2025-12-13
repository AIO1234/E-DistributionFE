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
      <label class="label">Select Rep</label>
      <div class="pt-2"></div>
      <v-autocomplete
        placeholder="Select Sales Rep /ID"
        class="user_select_button"
        v-model="salesrep_id"
        :items="salesreps"
        item-title="rep_name"
        item-value="id"
        @update:model-value="getAllSalesRepOrders()"
      ></v-autocomplete>
    </div>
    <!-- search boxes -->
    <div
      class="pt-15"
      v-if="
        salesrep_id !== 'Select Sales Rep /ID' ||
        authRole === 'Area Manager' ||
        authRole === 'SalesRep'
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

        <!--  end order date-->
        <v-col lg="2" cols="12">
          <AppDateTimePicker
            v-model="enddate"
            placeholder="End Order Date"
            class="search_date"
          >
          </AppDateTimePicker>
        </v-col>

        <!-- search button -->
        <v-col lg="3" cols="12">
          <v-btn
            class="search_button"
            variant="none"
            @click="getAllSalesRepOrders('search')"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn
            class="clear_button"
            variant="none"
            @click="getAllSalesRepOrders('normal')"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="salesRepOrders"
              :fields="headers"
              worksheet="All Sales Rep Orders"
              :name="`as of ${todaydate} salesreporders.xls`"
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
        <Table :SalesRepOrders="salesRepOrders" :loading="loading" />
      </v-card>
    </div>
  </div>
</template>
<script>
import { store } from "@/store";
import Table from "./Components/OrderTable.vue";
import SalesRepApi from "@/Api/Modules/salesrep";
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
      salesRepOrders: [],
      salesreps: [],
      salesrep_id: "",
      loading: false,
      authRole: "",
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

  async created() {
    this.getAuthUser();

    await this.SalesReps();
    await this.initializeData();
    await this.getAllSalesRepOrders();
  },

  methods: {
    // initialize data

    async initializeData() {
      //set distributer id to store
      const { getSelectedSalesRepId } = store.getters;

      // if user loged as administratave
      if (
        getSelectedSalesRepId !== null &&
        (this.authRole === "Super Admin" ||
          this.authRole === "Admin" ||
          this.authRole === "Staff")
      ) {
        console.log(getSelectedSalesRepId !== null);
        // set salesrep id from the store(if available)
        this.salesrep_id = getSelectedSalesRepId;

        await this.getAllSalesRepOrders();
      }
    },

    // get authenticated user role
    getAuthUser() {
      const { getRole } = store.getters;

      this.authRole = getRole;
    },
    // get salesreps
    async SalesReps() {
      this.loading = true;
      // if user loged as administrative
      if (
        this.authRole === "Super Admin" ||
        this.authRole === "Admin" ||
        this.authRole === "Staff"
      ) {
        const res = await SalesRepApi.allSalesReps();

        this.salesreps = res.data.data;
      }

      // if user logged as a area mnager or salesrep
      else if (
        this.authRole === "Area Manager" ||
        this.authRole === "SalesRep"
      ) {
        await this.getAllSalesRepOrders();
      }
      this.loading = false;
    },

    // get all salesrep orders
    async getAllSalesRepOrders(incomming = "normal") {
      //set salesrep id to store if administrative logged in

      store.commit("SET_SELECTED_SALESREP_ID", this.salesrep_id);
      this.loading = true;

      // initiaize payoad
      let payload = {};
      // if function execute as normal(without searches)
      if (incomming === "normal") {
        // reset searches
        this.searchdata = "";
        this.startdate = "";
        this.enddate = "";
        // process payload
        payload = {
          salesrep_id: this.salesrep_id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
        };
      }
      // if function execute as a search
      else {
        // process payload
        payload = {
          salesrep_id: this.salesrep_id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
        };
      }

      const res = await SalesRepApi.allSalesRepOrders(payload);
      this.salesRepOrders = res.data.data;
      this.loading = false;
    },
  },
};
</script>
