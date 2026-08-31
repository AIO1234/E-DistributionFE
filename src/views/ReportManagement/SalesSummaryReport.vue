<template>
  <div class="mt-9 report_managemnt">
    <div class="pt-3">
      <!-- select searches -->
      <v-row>
        <!-- select shop -->
        <v-col lg="4" cols="12">
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
            class="selection"
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
        </v-col>
        <!-- select distributer -->
        <v-col
          lg="4"
          cols="12"
          v-if="
            authRole === 'Super Admin' ||
            authRole === 'Admin' ||
            authRole === 'Staff' ||
            authRole === 'Area Manager' ||
            authRole === 'Distributer'
          "
        >
          <label class="label">Select ShowRoom</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select ShowRoom"
            v-model="distributor"
            :items="distributors"
            item-title="distributer_name"
            item-value="id"
            return-object
            class="selection"
            @update:model-value="search()"
          ></v-autocomplete>
        </v-col>

        <!-- select salesrep -->
        <v-col lg="4" cols="12">
          <label class="label">Select SalesRep</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select SalesRep"
            v-model="salesrep"
            :items="salesreps"
            item-title="rep_name"
            item-value="id"
            return-object
            @update:model-value="search()"
            class="selection"
          ></v-autocomplete>
        </v-col>

      </v-row>

      <!-- searches -->
      <v-row>
        <!-- search product number -->
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Product Code Or Name.."
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

        <!-- export button -->
        <v-col lg="3" cols="12">
          <div class="pt-1"></div>
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="exportSalesReport"
              :fields="collumns"
              worksheet="Sales Detailed Report"
              :name="`as of ${todaydate} salessummary.xls`"
              :before-generate="loadExportSalesReport"
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>
      <div class="pt-12"></div>
      <!-- table -->
      <v-card>
        <v-skeleton-loader
          :loading="loading"
          style="background-color: transparent"
          type="image, list-item-two-line"
        >
          <v-responsive>
            <v-data-table-server
              :headers="headers"
              :items="salesreport"
              :items-length="totalItems"
              :page="page"
              :items-per-page="itemsPerPage"
              @update:page="onPage"
              @update:items-per-page="onPerPage"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title
                    ><center>
                      <span class="table_topic">Sales Summary Report</span>
                    </center></v-toolbar-title
                  >
                </v-toolbar>
              </template>
              <!-- contents -->
              <template
                v-for="header in headers"
                :key="header.value"
                v-slot:[`item.${header.key}`]="props"
              >
                <!-- product code -->
                <div v-if="header.key === 'product_code'">
                  {{ props.item.product_code }}
                </div>

                <!-- product name -->
                <div v-if="header.key === 'product_name'">
                  <span> {{ props.item.product_name }}</span>
                </div>

                <!-- product type: not returned by the report query, see -->
                <!-- ReportImplementation::productWiseSales on the backend -->
                <div v-if="header.key === 'product_type'">
                  <span v-if="props.item.product_type === 'Liquid'">
                    {{ getVolume(props.item.product_volume) }}</span
                  >
                  <span v-else-if="props.item.product_type === 'Solid'">
                    {{ getWeight(props.item.product_weight) }}
                  </span>
                  <span v-else> N/A </span>
                </div>

                <!-- detailed view -->
                <div v-if="header.key === 'detailed_view'">
                  <v-btn
                    @click="
                      detailedDialog = true;
                      selectedItem = props.item;
                    "
                  >
                    Detailed View
                  </v-btn>
                </div>

                <!-- distributer distributed quantity -->
                <div v-if="header.key === 'distributer_distributed_products'">
                  <span
                    v-if="props.item.distributer_distributed_products !== null"
                  >
                    {{ props.item.distributer_distributed_products }}</span
                  >

                  <span v-else> N/A</span>
                </div>

                <!-- rep distributed quantity -->
                <div v-if="header.key === 'rep_distributed_products'">
                  <span v-if="props.item.rep_distributed_products !== null">
                    {{ props.item.rep_distributed_products }}
                  </span>

                  <span v-else> N/A</span>
                </div>
                <!-- quantity -->
                <div v-if="header.key === 'quantity'">
                  <span v-if="props.item.quantity !== null">
                    {{ props.item.quantity }}</span
                  >
                  <span v-else> N/A</span>
                </div>

                <!-- sales amount -->
                <div v-if="header.key === 'sales_amount'">
                  <span v-if="props.item.sales_amount !== null">
                    {{ getPrice(props.item.sales_amount) }}</span
                  >
                  <span v-else> N/A</span>
                </div>

                <!-- return quantity -->
                <div v-if="header.key === 'return_quantity'">
                  <span v-if="props.item.return_quantity !== null">
                    {{ props.item.return_quantity }}</span
                  >
                  <span v-else> N/A</span>
                </div>

                <!-- return value -->
                <div v-if="header.key === 'return_value'">
                  <span v-if="props.item.return_amount !== null">
                    {{ getPrice(props.item.return_amount) }}</span
                  >
                  <span v-else> N/A</span>
                </div>
                <!-- final quantity -->
                <div v-if="header.key === 'final_quantity'">
                  <span>
                    {{ props.item.quantity - props.item.return_quantity }}</span
                  >
                </div>

                <!-- final value -->
                <div v-if="header.key === 'final_value'">
                  <span>
                    {{
                      getPrice(
                        props.item.sales_amount - props.item.return_amount
                      )
                    }}</span
                  >
                </div>
              </template>
            </v-data-table-server>
          </v-responsive>
        </v-skeleton-loader>
      </v-card>
    </div>

    <!-- detiled view dialog -->
    <v-dialog
      v-model="detailedDialog"
      max-width="900.3px"
      min-height="216.97px"
      persistent
      scrollable=""
      class="masterdata"
    >
      <v-card>
        <div class="text-right">
          <v-btn
            color="transparent"
            variant="none"
            @click="detailedDialog = false"
          >
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

        <v-card-text> <DetailedView :selectedItem="selectedItem" /></v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import DetailedView from "@/views/StockManagement/Components/DetailedView.vue";
import ReportApi from "@/Api/Modules/reports";
import shopApi from "@/Api/Modules/shop";
import SalesRepApi from "@/Api/Modules/salesrep";
import DistributerApi from "@/Api/Modules/distributer";
import { store } from "@/store";
import JsonExcel from "vue-json-excel3";
import mixin from "@/mixins/commonmixins";

export default {
  components: {
    downloadExcel: JsonExcel,
    DetailedView,
  },
  data() {
    return {
      detailedDialog: false,
      selectedItem: {},
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD"
      ),
      searchdata: "",
      distributor: {
        id: "",
        distributer_name: "",
      },
      shop: {
        id: "",
        shop_name: "",
      },
      salesrep: {
        id: "",
        rep_name: "",
      },
      shops: [],
      shopsLoading: false,
      salesreps: [],
      distributors: [],
      show: false,
      searchdata: "",
      startdate: "",
      enddate: "",
      headers: [
        { title: "Product Code", align: "start", key: "product_code" },
        { title: "Product Name", align: "start", key: "product_name" },
        { title: "Product Type", align: "start", key: "product_type" },
        { title: "Detailed View", align: "start", key: "detailed_view" },
        {
          title: "Distributed Quantity(Distributer)",
          align: "start",
          key: "distributer_distributed_products",
        },
        {
          title: "Distributed Quantity(Rep)",
          align: "start",
          key: "rep_distributed_products",
        },
        { title: "Sales Quantity", align: "start", key: "quantity" },
        { title: "Sales Amount", align: "start", key: "sales_amount" },
        { title: "Return Quantity", align: "start", key: "return_quantity" },
        { title: "Return Amount", align: "start", key: "return_value" },
        { title: "Final Quantity", align: "start", key: "final_quantity" },
        { title: "Final Amount", align: "start", key: "final_value" },
      ],
      collumns: {
        "Product Code": "product_code",
        "Product Name": "product_name",
        "Product Type": "product_type",
        "Distributed Quantity(Distributer)": "distributer_distributed_products",
        "Distributed Quantity(Rep)": "rep_distributed_productse",
        "Sales Quantity": "quantity",
        "Sales Amount(Rs)": "sales_amount",
        "Return Quantity": "return_quantity",
        "Return Quantity": "return_value",
        "Final Quantity": "final_quantity",
        "Final Amount(Rs)": "final_value",
      },
      salesreport: [],
      // full result set matching the current filters (not just the current
      // page), lazily loaded right before Export fires
      exportSalesReport: [],
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
      loading: false,
      authRole: null,
    };
  },

  async created() {
    this.debouncedShopSearch = this.debounce(
      (searchdata) => this.getShops(searchdata),
      400,
    );

    this.getAuthUser();
    await this.getProductWiseReport();
    await this.getShops();
    await this.SalesReps();

    // if salesrep logged in distrinuter not loading
    if (
      this.authRole === "Super Admin" ||
      this.authRole === "Admin" ||
      this.authRole === "Staff" ||
      this.authRole === "Area Manager" ||
      this.authRole === "Distributer"
    ) {
      await this.Distributers();
    }
  },

  methods: {
    // get authenticated user ids
    getAuthUser() {
      const { getLoggedDistributer, getLoggedSaleRep, getRole, getUserName } =
        store.getters;

      this.authRole = getRole;

      // if user is area manager o r distributer set  the distrbter id
      if (getRole === "Area Manager" || getRole === "Distributer") {
        this.distributor.id = getLoggedDistributer;
        this.distributor.distributer_name = getUserName;
      }
      // if user is salesrep set  the salesrep id
      else if (getRole === "SalesRep") {
        this.salesrep.id = getLoggedSaleRep;
        this.salesrep.rep_name = getUserName;
      }
    },

    // get salesreps
    async SalesReps() {
      const res = await SalesRepApi.allSalesReps({ page: 1, per_page: 1000 });
      this.salesreps = res.data.data.data;
    },

    // get distributers
    async Distributers() {
      const res = await DistributerApi.allDistributers({ page: 1, per_page: 1000 });
      this.distributors = res.data.data.data;
    },

    // get shops matching the search text, capped so the whole 187+ shop
    // list is never loaded up front - typing narrows the results
    // server-side instead
    async getShops(searchdata = "") {
      this.shopsLoading = true;
      const res = await shopApi.allShops({ seacrh_data: searchdata, page: 1, per_page: 40 });

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
      this.page = 1;

      // refresh the dropdown back to the default (unsearched) batch, so
      // reopening it right after picking a shop doesn't leave you stuck
      // looking at only the narrow search results that shop matched -
      // other shops are immediately browsable/searchable again
      await this.getShops();

      await this.getProductWiseReport();
    },

    // get summary report for the current page/filters
    async getProductWiseReport() {
      this.loading = true;

      const res = await ReportApi.SalesWiseReport(
        this.searchdata,
        this.shop.id,
        this.distributor.id,
        this.salesrep.id,
        this.startdate,
        this.enddate,
        this.page,
        this.itemsPerPage,
      );
      const pagination = res.data.data;

      this.salesreport = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;

      this.loading = false;
    },

    // load the complete filtered report (not just the current page) right
    // before the export fires, so the exported file matches the active filters
    async loadExportSalesReport() {
      const res = await ReportApi.SalesWiseReport(
        this.searchdata,
        this.shop.id,
        this.distributor.id,
        this.salesrep.id,
        this.startdate,
        this.enddate,
        1,
        100000,
      );

      this.exportSalesReport = res.data.data.data;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text/dates
    async search() {
      this.page = 1;
      await this.getProductWiseReport();
    },

    // page change
    async onPage(page) {
      this.page = page;
      await this.getProductWiseReport();
    },

    // items-per-page change
    async onPerPage(perPage) {
      this.page = 1;
      this.itemsPerPage = perPage == -1 ? 10000 : perPage;
      await this.getProductWiseReport();
    },

    // clear button
    async clear() {
      // reset searches
      (this.searchdata = ""),
        (this.shop = ""),
        (this.distributor = {
          id: "",
          distributer_name: "",
        }),
        (this.salesrep = {
          id: "",
          rep_name: "",
        }),
        (this.startdate = ""),
        (this.enddate = "");
      this.page = 1;
      // get authenticated users if worker(area manager , distruibuter , salerep) is logged in
      this.getAuthUser();
      await this.getProductWiseReport();
    },
  },
};
</script>
