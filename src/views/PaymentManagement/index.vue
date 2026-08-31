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
          :loading="shopsLoading"
          no-filter
          item-title="shop_name"
          item-value="id"
          return-object
          @update:model-value="onShopSelected"
          @update:search="onShopSearch"
          class="shop_select_button"
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
      </v-col>
      <!-- create payment -->
      <v-col lg="6" cols="12" class="text-right">
        <v-btn
          class="payment_create_button"
          variant="none"
          :disabled="!shop || !shop.id"
          @click="show = true"
        >
          <template v-slot:prepend>
            <img src="@/assets/images/IconsSolid.png" />
          </template>
          <span class="text">Create Payment</span>
        </v-btn>
      </v-col>
    </v-row>

    <div class="pt-7"></div>
    <!-- shop due and paid balances -->
    <div v-if="shop && shop.id">
      <div class="shop_balance_amount">
        <span class="text"
          >Due Balance
          <span
            >For <b>{{ shop.shop_name }}</b></span
          >
          :
          <b class="amount">{{
            getPrice(shop.Uptodate_due_amounts || 0)
          }}</b>
        </span>
      </div>

      <div class="pt-3"></div>

      <div class="shop_balance_amount">
        <span class="text"
          >Paid Balance
          <span
            >From <b>{{ shop.shop_name }}</b></span
          >
          :
          <b class="amount">{{
            getPrice(shop.uptodate_paid_amounts || 0)
          }}</b>
        </span>
      </div>
    </div>

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

        <!-- end order date -->
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
          <v-btn class="clear_button" variant="none" @click="clearFilters"
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
              :data="exportPayments"
              :fields="headers"
              worksheet="All payments"
              :name="
                shop != ''
                  ? `as of ${todaydate} ${shop.shop_name} payments.xls`
                  : `as of ${todaydate} allpayments.xls`
              "
              :before-generate="loadExportPayments"
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
          :shops="shops"
          :loading="loading"
          :totalItems="totalItems"
          :currentPage="page"
          :itemsPerPage="itemsPerPage"
          @close="closeModal"
          @pagechange="pageChange"
          @pagesizechange="pageSizeChange"
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
      shopsLoading: false,
      shop: "",
      shoppayments: [],
      exportPayments: [],
      loading: false,
      payment_status: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
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
    this.debouncedShopSearch = this.debounce(
      (searchdata) => this.getAllShops(searchdata),
      400,
    );

    await this.getAllShops();
    await this.shopPayment();
  },
  methods: {
    // get shops matching the search text, capped so the whole 187+ shop
    // list is never loaded up front - typing narrows the results
    // server-side instead
    async getAllShops(searchdata = "") {
      this.shopsLoading = true;
      const res = await ShopApi.allShops({ seacrh_data: searchdata, page: 1, per_page: 40 });

      this.shops = res.data.data.data;
      this.shopsLoading = false;
    },

    // debounced so we don't fire a request on every keystroke. Vuetify
    // echoes the currently selected shop's own name back through this
    // event when the dropdown is simply reopened (not a real search the
    // user typed) - treat that as no search, otherwise it silently
    // narrows the list down to just the one shop already selected
    onShopSearch(searchdata) {
      const isEchoOfSelection = this.shop && searchdata === this.shop.shop_name;
      this.debouncedShopSearch(isEchoOfSelection ? "" : searchdata);
    },

    // picking a different shop starts a fresh view of it - a leftover
    // search term/date range/status picked while looking at the PREVIOUS
    // shop would otherwise silently carry over and filter out everything
    // for the newly selected shop
    async onShopSelected() {
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";
      this.payment_status = "";

      // refresh the dropdown back to the default (unsearched) batch, so
      // reopening it right after picking a shop doesn't leave you stuck
      // looking at only the narrow search results that shop matched -
      // other shops are immediately browsable/searchable again
      await this.getAllShops();

      await this.shopPayment("search");
    },

    // get payments for selected shop - "normal" only clears the search
    // filters, it does NOT clear the selected shop (mirrors
    // SupplierPayments' supplierPayment(), where Clear keeps the
    // selected supplier)
    async shopPayment(incomming = "normal") {
      if (incomming === "normal") {
        this.searchdata = "";
        this.startdate = "";
        this.enddate = "";
        this.payment_status = "";
      }

      // any filter change invalidates the previous page
      this.page = 1;

      await this.getShopPayments();
    },

    // clear search filters but keep the selected shop
    async clearFilters() {
      await this.shopPayment("normal");
    },

    // fetch payments for the current page/filters
    async getShopPayments() {
      this.loading = true;

      const payload = {
        shop_id: this.shop.id,
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        payment_status: this.payment_status,
        page: this.page,
        per_page: this.itemsPerPage,
      };

      const res = await PaymentApi.allShopPayments(payload);
      const pagination = res.data.data;

      // the backend returns nothing for a role that isn't allowed to see
      // every shop's payments and hasn't picked a shop yet
      this.shoppayments = pagination?.data || [];
      this.totalItems = pagination?.total || 0;
      this.page = pagination?.current_page || 1;
      this.itemsPerPage = pagination?.per_page || this.itemsPerPage;

      this.loading = false;
    },

    // load the complete filtered payment list (not just the current page)
    // right before the export fires, so the exported file matches the
    // active filters
    async loadExportPayments() {
      const payload = {
        shop_id: this.shop.id,
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        payment_status: this.payment_status,
        page: 1,
        per_page: 100000,
      };

      const res = await PaymentApi.allShopPayments(payload);

      this.exportPayments = res.data.data?.data || [];
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getShopPayments();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getShopPayments();
    },

    // close modal
    async closeModal() {
      this.show = false;
      await this.getShopPayments();
    },
  },
};
</script>
