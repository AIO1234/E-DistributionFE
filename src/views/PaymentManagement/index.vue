<template>
  <div class="payment_management mt-9">
    <!-- show selection -->
    <v-row>
      <!-- select shop -->
      <v-col lg="6">
        <label class="label">Select Shop</label>
        <v-autocomplete
          placeholder="Select Shop"
          v-model="shop"
          :items="shops"
          item-title="shop_name"
          item-value="id"
          return-object
          @update:model-value="shopPayment('search')"
          class="shop_select_button"
        ></v-autocomplete>
      </v-col>
      <!-- create payment -->
      <v-col lg="6" cols="12" class="text-right">
        <v-btn
          class="payment_create_button"
          variant="none"
          @click="show = true"
        >
          <template v-slot:prepend>
            <img src="@/assets/images/IconsSolid.png" />
          </template>
          <span class="text">Create Payment</span>
        </v-btn>
      </v-col>
    </v-row>
    <!-- header searches -->
    <div class="pt-15" v-if="shop !== 'Select Shop'">
      <v-row>
        <!-- search order number -->
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Payment Number.."
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
            placeholder="Start Paid Date"
            class="search_date"
          >
          </AppDateTimePicker>
        </v-col>

        <!--  end order date-->
        <v-col lg="2" cols="12">
          <AppDateTimePicker
            v-model="enddate"
            placeholder="End Paid Date"
            class="search_date"
          >
          </AppDateTimePicker>
        </v-col>

        <!-- search button -->
        <v-col lg="3" cols="12">
          <v-btn
            class="search_button"
            variant="none"
            @click="shopPayment('search')"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="shopPayment()"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>

        <!-- select payment status -->
        <v-col lg="3">
          <label class="label">Select Payment Status</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select Payment Status.."
            v-model="payment_status"
            :items="['Pending', 'Recieved']"
            @update:model-value="shopPayment('search')"
            class="search_input"
          ></v-autocomplete>
        </v-col>

        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <div class="pt-8"></div>
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="shoppayments"
              :fields="headers"
              worksheet="All payments"
              :name="
                shop != ''
                  ? `as of ${todaydate} ${shop.shop_name} payments.xls`
                  : `as of ${todaydate} allpayments.xls`
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
        <Table
          :shoppayments="shoppayments"
          :shop="shop"
          :loading="loading"
          @close="closeModal"
        />
      </v-card>
    </div>

    <!-- create payment dialog -->

    <v-dialog
      v-model="show"
      max-width="814px"
      min-height="217px"
      persistent
      scrollable=""
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="show = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
              />
            </svg>
          </v-btn>
        </div>

        <v-card-text>
          <CreateForm :shop="shop" @close="closeModal" /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import Table from "./Components/PaymentTable.vue";
import ShopApi from "@/Api/Modules/shop";
import PaymentApi from "@/Api/Modules/payments";
import CreateForm from "./Components/CreatePayment.vue";
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
      shops: [],
      shop: "",
      shoppayments: [],
      loading: false,
      payment_status: "",
      headers: {
        "Order Id": "payment_invoices[0].order_reference_id",
        "Payment Code": "payment_code",
        "Payment Method": "payment_method",
        "Check No": "check_no",
        Amount: "payment_amount",
        Date: "payment_date",
        Status: "status",
        "Last Updated By": "last_updated_by",
      },
    };
  },
  components: {
    Table,
    CreateForm,
    downloadExcel: JsonExcel,
  },

  async created() {
    await this.getAllShops();
    await this.shopPayment();
    await this.initializeData();
  },
  methods: {
    // initialize data
    async initializeData() {
      const { getSelectedShopId } = store.getters;

      // check weather store shop id is null
      if (getSelectedShopId !== null) {
        // set shop id from the store(if available)
        this.shop.id = getSelectedShopId;
      }

      await this.shopPayment();
    },
    // get all shops
    async getAllShops() {
      this.loading = true;
      const res = await ShopApi.allShops();
      this.shops = res.data.data;
      this.loading = false;
    },

    // get payments  for selected shop

    async shopPayment(incomming = "normal") {
      //set shop id and  to store if administrative logged in

      store.commit("SET_SELECTED_SHOP_ID", this.shop.id);

      this.loading = true;
      // initiaize payoad
      let payload = {};
      // if function execute as normal(without searches)
      if (incomming === "normal") {
        // reset searches
        this.searchdata = "";
        this.startdate = "";
        this.enddate = "";
        this.shop = "";
        this.payment_status = "";
        // process payload
        payload = {
          shop_id: this.shop.id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
          payment_status: this.payment_status,
        };
      }
      // if function execute as a search
      else {
        // process payload
        payload = {
          shop_id: this.shop.id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
          payment_status: this.payment_status,
        };
      }

      const res = await PaymentApi.allShopPayments(payload);
      this.shoppayments = res.data.data;

      this.loading = false;
    },

    async closeModal() {
      this.show = false;
      await this.shopPayment();
    },
  },
};
</script>
