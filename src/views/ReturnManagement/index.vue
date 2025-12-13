<template>
  <div class="return_management mt-5">
    <!-- show selection -->
    <v-row>
      <!-- select shop -->
      <v-col lg="6" cols="12">
        <label class="label">Select Shop</label>
        <div class="pt-2"></div>
        <v-autocomplete
          placeholder="Select Shop"
          v-model="shop"
          :items="shops"
          item-title="shop_name"
          item-value="id"
          return-object
          @update:model-value="shopReturns('search')"
          class="shop_select_button"
        ></v-autocomplete>
      </v-col>

      <!-- create return -->

      <v-col lg="6" cols="12" class="text-right">
        <div class="pt-5"></div>
        <v-btn class="return_create_button" variant="none" @click="show = true">
          <template v-slot:prepend>
            <img src="@/assets/images/IconsSolid.png" />
          </template>
          <span class="text">Add Return</span>
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
            placeholder="Order Number Or Invoice.."
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
            placeholder="Start Retunred Date"
            class="search_date"
          >
          </AppDateTimePicker>
        </v-col>

        <!--  end order date-->
        <v-col lg="2" cols="12">
          <AppDateTimePicker
            v-model="enddate"
            placeholder="End Retunred Date"
            class="search_date"
          >
          </AppDateTimePicker>
        </v-col>

        <!-- search button -->
        <v-col lg="3" cols="12">
          <v-btn
            class="search_button"
            variant="none"
            @click="shopReturns('search')"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="shopReturns()"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>

        <!-- select return reason -->
        <v-col lg="3">
          <label class="label">Select Return Reason</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select Return Reason.."
            v-model="return_reason"
            :items="['Damage or Expire', 'Other']"
            @update:model-value="shopReturns('search')"
            class="search_input"
          ></v-autocomplete>
        </v-col>

        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <div class="pt-8"></div>
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="returns"
              :fields="headers"
              worksheet="Shop Returns"
              :name="
                shop.shop_name != ''
                  ? `as of ${todaydate} ${shop.shop_name} returns.xls`
                  : `as of ${todaydate} shopreturns.xls`
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
          :Returns="returns"
          :shop="shop"
          :loading="loading"
          @close="closeModal"
        />
      </v-card>
    </div>

    <!-- create return dialog -->

    <v-dialog
      v-model="show"
      max-width="1200px"
      min-height="317px"
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
import JsonExcel from "vue-json-excel3";
import ReturnApi from "@/Api/Modules/returns";
import ShopApi from "@/Api/Modules/shop";
import Table from "./Components/ReturnTable.vue";
import CreateForm from "./Components/CreateReturn.vue";
import { store } from "@/store";
import mixin from "@/mixins/commonmixins";

export default {
  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD"
      ),
      return_reason: "",
      searchdata: "",
      startdate: "",
      enddate: "",
      show: false,
      shops: [],
      shop: {
        shop_name: "",
      },

      headers: {
        "Order Id": "order_reference_id",
        "Invoice No/S": "invoice_no",

        "Returned Date": "return_date",
        "Order Amount(Rs)": "order_amount",
        "Return Amount(Rs)": "return_amount",
        "Last Updated By": "last_updated_by",
      },
      returns: [],
      loading: false,
    };
  },
  components: {
    Table,
    CreateForm,
    downloadExcel: JsonExcel,
  },
  async created() {
    await this.getAllShops();
    await this.initializeData();
  },
  methods: {
    // initialize data
    async initializeData() {
      const { getSelectedReturnShopId } = store.getters;
      const { getSelectedReturnShopName } = store.getters;

      // check weather store shop id and name is null
      if (
        getSelectedReturnShopId !== null &&
        getSelectedReturnShopName !== null
      ) {
        // set shop id from the store(if available)
        this.shop.id = getSelectedReturnShopId;
        this.shop.shop_name = getSelectedReturnShopName;
      }

      await this.shopReturns();
    },

    // get all shops
    async getAllShops() {
      this.loading = true;
      const res = await ShopApi.allShops();
      this.shops = res.data.data;
      this.loading = false;
    },

    // get returns  for selected shop
    async shopReturns(incomming = "normal") {
      //set return shop id and name to store if administrative logged in

      store.commit("SET_SELECTED_RETURN_SHOP_ID", this.shop.id);
      store.commit("SET_SELECTED_RETURN_SHOP_NAME", this.shop.shop_name);

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
        this.return_reason = "";
        // process payload
        payload = {
          shop_id: this.shop.id,
          searchdata: this.searchdata,
          startdate: this.startdate,
          enddate: this.enddate,
          return_reason: this.return_reason,
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
          return_reason: this.return_reason,
        };
      }

      const res = await ReturnApi.allShopReturns(payload);
      this.returns = res.data.data;

      this.loading = false;
    },

    // close modal
    async closeModal() {
      this.show = false;
      await this.shopReturns();
    },
  },
};
</script>
