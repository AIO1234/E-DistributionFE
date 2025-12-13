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
        item-title="shop_name"
        item-value="id"
        @update:model-value="getAllshopOrders()"
      ></v-autocomplete>
    </div>

    <div class="pt-7"></div>
    <!-- shop due balances  -->

    <div class="shop_balance_amount" v-if="shop_id !== ''">
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

    <div class="pt-3"></div>
    <!-- shop paid amounts -->
    <div class="shop_balance_amount" v-if="shop_id !== ''">
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

        <!-- search button -->
        <v-col lg="3" cols="12">
          <v-btn
            class="search_button"
            variant="none"
            @click="getAllshopOrders('search')"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="getAllshopOrders()"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="shopOrders"
              :fields="headers"
              worksheet="All Shop Orders"
              :name="
                shop_id != ''
                  ? `as of ${todaydate} ${shop_name} orders.xls`
                  : `as of ${todaydate} allshoporders.xls`
              "
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
        <Table :ShopOrders="shopOrders" :loading="loading" />
      </v-card>
    </div>
  </div>
</template>
<script>
import Table from "./Components/OrderTable.vue";
import shopApi from "@/Api/Modules/shop";
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
      shopOrders: [],
      shops: [],
      shop_id: "",
      loading: false,
      shop_paid_amount: "",
      shop_due_amount: "",
      shop_name: "",

      headers: {
        "Shop Name": "shop.shop_name",
        "Distributor Name": "distributer.distributer_name",
        "Rep Name": "salesrep.rep_name",
        "Order Id": "order_reference_id",
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

  async created() {
    await this.getShops();
    await this.initializeData();
    await this.getAllshopOrders();
  },

  methods: {
    // initialize data

    async initializeData() {
      const { getSelectedShopId } = store.getters;

      // check weather store shop id is null
      if (getSelectedShopId !== null) {
        // set shop id from the store(if available)
        this.shop_id = getSelectedShopId;

        await this.getAllshopOrders();
      }
    },

    // get shops
    async getShops() {
      this.loading = true;
      const res = await shopApi.allShops();

      this.shops = res.data.data;

      this.loading = false;
    },

    // get all shop orders
    async getAllshopOrders(incomming = "normal") {
      //set shop id to store if administrative logged in

      store.commit("SET_SELECTED_SHOP_ID", this.shop_id);

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
          shop_id: this.shop_id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
        };
      }
      // if function execute as a search
      else {
        // process payload
        payload = {
          shop_id: this.shop_id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
        };
      }

      const res = await shopApi.allShopOrders(payload);

      if (res.data.data != null) {
        this.shopOrders = res.data.data.shop_orders;
        this.shop_paid_amount = res.data.data.paid_amount;
        this.shop_due_amount = res.data.data.due_amount;
        this.shop_name = res.data.data.shop_name;
      }
      this.loading = false;
    },
  },
};
</script>
