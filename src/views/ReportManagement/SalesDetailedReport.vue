<template>
  <div class="mt-3 report_managemnt">
    <!-- select searches -->
    <v-row>
      <!-- select shop -->
      <v-col lg="3" cols="12">
        <label class="label">Select Shop</label>
        <div class="pt-2"></div>
        <v-autocomplete
          placeholder="Select Shop"
          v-model="shop"
          :items="shops"
          item-title="shop_name"
          item-value="id"
          return-object
          @update:model-value="DetailedReport()"
          class="selection"
        ></v-autocomplete>
      </v-col>
      <!-- select distributer -->

      <v-col
        lg="3"
        cols="12"
        v-if="
          authRole === 'Super Admin' ||
          authRole === 'Admin' ||
          authRole === 'Staff' ||
          authRole === 'Area Manager' ||
          authRole === 'Distributer'
        "
      >
        <label class="label">Select Distributor</label>
        <div class="pt-2"></div>
        <v-autocomplete
          placeholder="Select Distributor"
          v-model="distributor"
          :items="distributors"
          item-title="distributer_name"
          item-value="id"
          return-object
          @update:model-value="DetailedReport()"
          class="selection"
        ></v-autocomplete>
      </v-col>

      <!-- select salesrep -->
      <v-col lg="3" cols="12">
        <label class="label">Select SalesRep</label>
        <div class="pt-2"></div>
        <v-autocomplete
          placeholder="Select SalesRep"
          v-model="salesrep"
          :items="salesreps"
          item-title="rep_name"
          item-value="id"
          @update:model-value="DetailedReport()"
          return-object
          class="selection"
        ></v-autocomplete>
      </v-col>

      <!-- select area -->
      <v-col lg="3" cols="12">
        <label class="label">Select Area</label>
        <div class="pt-2"></div>
        <v-autocomplete
          placeholder="Select Area"
          v-model="area"
          :items="areas"
          item-title="area_name"
          item-value="id"
          return-object
          @update:model-value="DetailedReport()"
          class="selection"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <!-- searches -->
    <v-row>
      <!-- search order number -->
      <v-col lg="3" cols="12">
        <v-text-field
          v-model="searchdata"
          placeholder="search invoice no or order ref.."
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
        <v-btn class="search_button" variant="none" @click="DetailedReport()"
          ><span class="text">Search</span></v-btn
        >
      </v-col>

      <!-- clear button -->
      <v-col lg="2" cols="12">
        <v-btn class="clear_button" variant="none" @click="clear()"
          ><span class="text">Clear</span></v-btn
        >
      </v-col>

      <!-- exfort button -->
      <v-col lg="3" cols="12">
        <div class="pt-1"></div>
        <v-btn class="exfort_button" variant="none">
          <download-excel
            :data="salesreport"
            :fields="collumns"
            worksheet="Sales Detailed Report"
            :name="`as of ${todaydate} salesdetails.xls`"
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
          <v-data-table
            :headers="headers"
            :items="salesreport"
            items-per-page="100"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title
                  ><center>
                    <span class="table_topic">Sales Detailed Report</span>
                  </center></v-toolbar-title
                >
              </v-toolbar>
            </template>
            <!-- contents -->
            <!-- contents -->
            <template
              v-for="header in headers"
              :key="header.value"
              v-slot:[`item.${header.key}`]="props"
            >
              <!-- invoice number -->
              <div v-if="header.key === 'invoice_no'">
                {{ props.item.invoice_no }}
              </div>

              <!-- shop-->
              <div v-if="header.key === 'shop'">
                <span> {{ props.item.shop.shop_name }}</span>
              </div>

              <!-- invoice date -->
              <div v-if="header.key === 'order_date'">
                {{ props.item.order_date }}
              </div>
              <!-- product summary -->
              <div v-if="header.key === 'product_summary'">
                <v-btn
                  color="transparent"
                  variant="none"
                  @click="
                    productDialog = true;
                    selectedItem = props.item;
                  "
                >
                  <img src="@/assets/images/eye.png" style="width: 70%" />
                </v-btn>
              </div>

              <!-- distributer -->
              <div v-if="header.key === 'distributer'">
                <span> {{ props.item.distributer.distributer_name }}</span>
              </div>

              <!-- salesrep-->
              <div v-if="header.key === 'salesrep'">
                <span> {{ props.item.salesrep.rep_name }}</span>
              </div>

              <!-- area -->
              <div v-if="header.key === 'area'">
                <span> {{ props.item.shop.area.area_name }}</span>
              </div>

              <!-- invoice amount -->
              <div v-if="header.key === 'order_amount'">
                <span> {{ getPrice(props.item.order_amount) }}</span>
              </div>

              <!-- paid amount -->
              <div v-if="header.key === 'total_paid_amount'">
                <span> {{ getPrice(props.item.total_paid_amount) }}</span>
              </div>

              <!-- total due amount -->
              <div v-if="header.key === 'total_due_amount'">
                <span> {{ getPrice(props.item.total_due_amount) }}</span>
              </div>
              <!-- return count summation-->
              <div v-if="header.key === 'return_count_summation'">
                <span> {{ props.item.return_count_summation }}</span>
              </div>
              <!-- return amount summation-->
              <div v-if="header.key === 'return_amount_summation'">
                <span> {{ getPrice(props.item.return_amount_summation) }}</span>
              </div>
            </template>
          </v-data-table>
        </v-responsive>
      </v-skeleton-loader>
    </v-card>

    <!-- product view dialog -->
    <v-dialog
      v-model="productDialog"
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
            @click="productDialog = false"
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

        <v-card-text>
          <!-- Products -->
          <span class="table_topic">Products</span>
          <div class="pt-3"></div>
          <table
            class="table table-sm table_borders"
            sortable
            style="width: 100%"
          >
            <thead>
              <tr class="table_header table_borders">
                <th class="text table_borders">Product Name</th>
                <th class="text table_borders">Quantity</th>
                <th class="text table_borders">Unit Price(Rs)</th>
                <th class="text table_borders">Discounted Price(Rs)</th>
                <th class="text table_borders">Returned Quantity</th>
                <th class="text table_borders">Returned Amount(Rs)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                style="page-break-inside: avoid"
                class="table-data table_borders"
                v-for="product in selectedItem.distributer_salesrep_shop_order_items"
                :key="product"
              >
                <td v-if="product" class="text table_borders">
                  {{ product.product_name }}
                </td>
                <td v-if="product" class="text table_borders">
                  {{ product.pivot.quantity }}
                </td>
                <td v-if="product" class="text table_borders">
                  {{ product.pivot.unit_price }}
                </td>
                <td v-if="product" class="text table_borders">
                  {{ product.pivot.discounted_price }}
                </td>
                <td v-if="product" class="text table_borders">
                  {{ product.pivot.return_quantity }}
                </td>
                <td v-if="product" class="text table_borders">
                  {{ product.pivot.return_value }}
                </td>
              </tr>
            </tbody>
          </table>
        </v-card-text></v-card
      >
    </v-dialog>
  </div>
</template>
<script>
import ReportApi from "@/Api/Modules/reports";
import shopApi from "@/Api/Modules/shop";
import SalesRepApi from "@/Api/Modules/salesrep";
import DistributerApi from "@/Api/Modules/distributer";
import commonmixins from "@/mixins/commonmixins";
import { store } from "@/store";
import JsonExcel from "vue-json-excel3";
import mixin from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],
  components: {
    downloadExcel: JsonExcel,
  },
  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD"
      ),
      productDialog: false,
      selectedItem: {},
      searchdata: "",
      area: {
        id: "",
        area_name: "",
      },
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
      salesreps: [],
      distributors: [],
      areas: [],
      loading: false,
      headers: [
        { title: "Invoice No", align: "start", key: "invoice_no" },
        { title: "Shop Name", align: "start", key: "shop" },
        { title: "Invoice Date", align: "start", key: "order_date" },
        { title: "Product Summary", align: "start", key: "product_summary" },
        { title: "Distributer Name", align: "start", key: "distributer" },
        { title: "Rep Name", align: "start", key: "salesrep" },
        { title: "Area Name", align: "start", key: "area" },
        { title: "Invoice Amount(Rs)", align: "start", key: "order_amount" },
        { title: "Paid Amount(Rs)", align: "start", key: "total_paid_amount" },
        { title: "Due Amount(Rs)", align: "start", key: "total_due_amount" },
        {
          title: "Return Count",
          align: "start",
          key: "return_count_summation",
        },
        {
          title: "Return Amount(Rs)",
          align: "start",
          key: "return_amount_summation",
        },
      ],
      collumns: {
        "Invoice No": "invoice_no",
        "Shop Name": "shop.shop_name",
        "Invoice Date": "order_date",
        "Distributer Name": "distributer.distributer_name",
        "Rep Name": "salesrep.rep_name",
        "Area Name": "area.name",
        "Invoice Amount(Rs)": "order_amount",
        "Paid Amount(Rs)": "total_paid_amount",
        "Due Amount(Rs)": "total_due_amount",
      },
      salesreport: [],
      authRole: null,
    };
  },

  async created() {
    this.getAuthUser();
    await this.DetailedReport();
    await this.getAreas();
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

      // if user is area manager or distributer set  the distrbter id
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
    // get areas from the globals
    async getAreas() {
      this.areas = await commonmixins.methods.getAreas();
    },

    // get salesreps
    async SalesReps() {
      const res = await SalesRepApi.allSalesReps();
      this.salesreps = res.data.data;
    },

    // get distributers
    async Distributers() {
      const res = await DistributerApi.allDistributers();
      this.distributors = res.data.data;
    },

    // get all shops
    async getShops() {
      const res = await shopApi.allShops();
      this.shops = res.data.data;
    },

    // get sales detailed report
    async DetailedReport() {
      this.loading = true;
      // get seached data

      const res = await ReportApi.SalesWiseDetailedReport(
        this.searchdata,
        this.shop.id,
        this.distributor.id,
        this.salesrep.id,
        this.area.id,
        this.startdate,
        this.enddate
      );

      this.salesreport = res.data.data;

      this.loading = false;
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
        (this.area = ""),
        (this.startdate = ""),
        (this.enddate = "");
      // get authenticated users if worker(area manager , distruibuter , salerep) is logged in
      this.getAuthUser();
      await this.DetailedReport();
    },
  },
};
</script>
