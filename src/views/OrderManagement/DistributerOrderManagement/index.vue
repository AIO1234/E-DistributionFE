<template>
  <div class="order_management mt-9">
    <!-- select distributor id -->
    <div
      v-if="
        authRole === 'Super Admin' ||
        authRole === 'Admin' ||
        authRole === 'Staff'
      "
    >
      <label class="label">Select Distrbiutor</label>
      <div class="pt-2"></div>
      <v-autocomplete
        placeholder="Select Distributor /ID"
        class="user_select_button"
        v-model="distributer_id"
        :items="distributers"
        item-title="distributer_name"
        item-value="id"
        @update:model-value="getAllDistributerOrders()"
      ></v-autocomplete>
    </div>
    <!-- search boxes -->
    <div
      class="pt-15"
      v-if="
        distributer_id !== 'Select Distributor /ID' ||
        authRole === 'Area Manager' ||
        authRole === 'Distributer'
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
            @click="getAllDistributerOrders('search')"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn
            class="clear_button"
            variant="none"
            @click="getAllDistributerOrders('normal')"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="distributerOrders"
              :fields="headers"
              worksheet="All Distributers"
              :name="`as of ${todaydate} distributerorders.xls`"
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- table -->
    <div class="pt-12">
      <!-- table -->
      <v-card>
        <Table :DistributerOrders="distributerOrders" :loading="loading" />
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
        "YYYY-MM-DD"
      ),
      searchdata: "",
      startdate: "",
      enddate: "",
      show: false,
      distributerOrders: [],
      distributers: [],
      distributer_id: "",
      loading: false,
      authRole: "",
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

  async created() {
    this.getAuthUser();

    await this.Distributers();
    await this.initializeData();
    await this.getAllDistributerOrders();
  },

  methods: {
    // initialize data

    async initializeData() {
      //set distributer id to store
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

        await this.getAllDistributerOrders();
      }
    },

    // get authenticated user role
    getAuthUser() {
      const { getRole } = store.getters;

      this.authRole = getRole;
    },

    // get distributers
    async Distributers() {
      this.loading = true;
      // if user loged as administratave
      if (
        this.authRole === "Super Admin" ||
        this.authRole === "Admin" ||
        this.authRole === "Staff"
      ) {
        const res = await DistributerApi.allDistributers();

        this.distributers = res.data.data;
      }

      // if user logged as a area mnager or distributer
      else if (
        this.authRole === "Area Manager" ||
        this.authRole === "Distributer"
      ) {
        await this.getAllDistributerOrders();
      }
      this.loading = false;
    },

    // get all distributer orders
    async getAllDistributerOrders(incomming = "normal") {
      //set distributer id to store if administrative logged in

      store.commit("SET_SELECTED_DISTRIBUTER_ID", this.distributer_id);

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
          distributer_id: this.distributer_id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
        };
      }
      // if function execute as a search
      else {
        // process payload
        payload = {
          distributer_id: this.distributer_id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
        };
      }

      const res = await DistributerApi.allDistributerOrders(payload);
      this.distributerOrders = res.data.data;
      this.loading = false;
    },
  },
};
</script>
