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

      <!-- create return -->

      <v-col lg="6" cols="12" class="text-right">
        <div class="pt-5"></div>
        <v-btn
          class="return_create_button"
          variant="none"
          :disabled="!shop || !shop.id"
          @click="show = true"
        >
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
            @click="search()"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="clear()"
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
            @update:model-value="search()"
            class="search_input"
          ></v-autocomplete>
        </v-col>

        <!-- exfort button -->
        <v-col lg="3" cols="12">
          <div class="pt-8"></div>
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="exportReturns"
              :fields="headers"
              worksheet="Shop Returns"
              :name="
                shop.shop_name != ''
                  ? `as of ${todaydate} ${shop.shop_name} returns.xls`
                  : `as of ${todaydate} shopreturns.xls`
              "
              :before-generate="loadExportReturns"
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
          :totalItems="totalItems"
          :currentPage="page"
          :itemsPerPage="itemsPerPage"
          @close="closeModal"
          @pagechange="pageChange"
          @pagesizechange="pageSizeChange"
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
      exportReturns: [],
      loading: false,
      shopsLoading: false,
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
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
    await this.getShopReturns();
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
    // search term/date range picked while looking at the PREVIOUS shop
    // would otherwise silently carry over and filter out everything for
    // the newly selected shop
    async onShopSelected() {
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";
      this.return_reason = "";

      // refresh the dropdown back to the default (unsearched) batch, so
      // reopening it right after picking a shop doesn't leave you stuck
      // looking at only the narrow search results that shop matched -
      // other shops are immediately browsable/searchable again
      await this.getAllShops();

      await this.search();
    },

    // get the current page of returns for the selected shop (and filters)
    async getShopReturns() {
      this.loading = true;

      const payload = {
        shop_id: this.shop.id,
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        return_reason: this.return_reason,
        page: this.page,
        per_page: this.itemsPerPage,
      };

      const res = await ReturnApi.allShopReturns(payload);
      const pagination = res.data.data;

      this.returns = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;
      this.loading = false;
    },

    // load the complete filtered return list (not just the current page)
    // right before the export fires, so the exported file matches the active filters
    async loadExportReturns() {
      const payload = {
        shop_id: this.shop.id,
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        return_reason: this.return_reason,
        page: 1,
        per_page: 100000,
      };

      const res = await ReturnApi.allShopReturns(payload);

      this.exportReturns = res.data.data.data;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getShopReturns();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getShopReturns();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getShopReturns();
    },

    // reset every filter and reload page 1
    async clear() {
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";
      this.return_reason = "";
      await this.search();
    },

    // close modal
    async closeModal() {
      this.show = false;
      await this.getShopReturns();
    },
  },
};
</script>
