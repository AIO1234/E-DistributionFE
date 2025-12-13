<template>
  <div class="masterdata">
    <!-- select searches -->
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-row>
          <!-- select shop -->
          <v-col lg="4" cols="12">
            <label class="label">Select Shop</label>
            <div class="pt-2"></div>
            <v-autocomplete
              placeholder="Select Shop"
              v-model="shop"
              :items="shops"
              item-title="shop_name"
              item-value="id"
              return-object
              class="selection"
              @update:model-value="getProductBinCard()"
            ></v-autocomplete>
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
            <label class="label">Select Distributor</label>
            <div class="pt-2"></div>
            <v-autocomplete
              placeholder="Select Distributor"
              v-model="distributor"
              :items="distributors"
              item-title="distributer_name"
              item-value="id"
              return-object
              class="selection"
              @update:model-value="getProductBinCard()"
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
              class="selection"
              @update:model-value="getProductBinCard()"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- searches -->
        <v-row>
          <!-- start order date -->
          <v-col lg="4" cols="12">
            <AppDateTimePicker
              v-model="startdate"
              placeholder="Start Order Date"
              class="search_date"
            >
            </AppDateTimePicker>
          </v-col>

          <!--  end order date-->
          <v-col lg="4" cols="12">
            <AppDateTimePicker
              v-model="enddate"
              placeholder="End Order Date"
              class="search_date"
            >
            </AppDateTimePicker>
          </v-col>

          <!-- search button -->
          <v-col lg="2" cols="12">
            <v-btn
              class="search_button"
              variant="none"
              @click="getProductBinCard()"
              ><span class="text">Search</span></v-btn
            >
          </v-col>

          <!-- clear button -->
          <v-col lg="2" cols="12">
            <v-btn class="clear_button" variant="none" @click="clear()"
              ><span class="text">Clear</span></v-btn
            >
          </v-col>
        </v-row>
        <div class="pt-6"></div>
        <!-- distributors -->
        <span
          class="table_topic"
          v-if="
            authRole === 'Super Admin' ||
            authRole === 'Admin' ||
            authRole === 'Staff' ||
            authRole === 'Area Manager' ||
            authRole === 'Distributer'
          "
          >Distributors</span
        >
        <div class="pt-3"></div>
        <table
          v-if="
            authRole === 'Super Admin' ||
            authRole === 'Admin' ||
            authRole === 'Staff' ||
            authRole === 'Area Manager' ||
            authRole === 'Distributer'
          "
          class="table table-sm table_borders"
          sortable
          style="width: 100%"
        >
          <thead>
            <tr class="table_header table_borders">
              <th class="text table_borders">Distributor Name</th>
              <th class="text table_borders">Distributed Quantity</th>
              <th class="text table_borders">Distributed Amount(Rs)</th>
              <th class="text table_borders">Balance Stock</th>
              <th class="text table_borders">Sold Quantity</th>
              <th class="text table_borders">Sold Amount(Rs)</th>
              <th class="text table_borders">Returned Stock</th>
              <th class="text table_borders">Returned Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              style="page-break-inside: avoid"
              class="table-data table_borders"
              v-for="distributer in resultdistributors"
              :key="distributer"
            >
              <td v-if="distributer" class="text table_borders">
                {{ distributer.distributer_name }}
              </td>
              <td v-if="distributer" class="text table_borders">
                {{ distributer.sum_quantity }}
              </td>
              <td v-if="distributer" class="text table_borders">
                {{ distributer.recived_amount }}
              </td>
              <td v-if="distributer" class="text table_borders">
                {{ distributer.balance_quantity }}
              </td>
              <td v-if="distributer" class="text table_borders">
                {{ distributer.sold_quantity }}
              </td>
              <td v-if="distributer" class="text table_borders">
                {{ distributer.sold_amount }}
              </td>
              <th v-if="distributer" class="text table_borders">
                {{ distributer.returned_quantity }}
              </th>
              <th v-if="distributer" class="text table_borders">
                {{ distributer.returned_amount }}
              </th>
            </tr>
          </tbody>
        </table>

        <div class="pt-6"></div>
        <!-- Sales Reps -->
        <span class="table_topic">SalesReps</span>
        <div class="pt-3"></div>
        <table
          v-if="resultsalesreps.length !== 0"
          class="table table-sm table_borders"
          sortable
          style="width: 100%"
        >
          <thead>
            <tr class="table_header table_borders">
              <th class="text table_borders">SalesRep Name</th>
              <th class="text table_borders">Distributed Quantity</th>
              <th class="text table_borders">Distributed Amount(Rs)</th>
              <th class="text table_borders">Balance Stock</th>
              <th class="text table_borders">Sold Quantity</th>
              <th class="text table_borders">Sold Amount(Rs)</th>
              <th class="text table_borders">Returned Stock</th>
              <th class="text table_borders">Returned Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="rep in resultsalesreps"
              :key="rep"
              style="page-break-inside: avoid"
              class="table-data table_borders"
            >
              <td v-if="rep" class="text table_borders">
                {{ rep.rep_name }}
              </td>
              <td v-if="rep" class="text table_borders">
                {{ rep.sum_quantity }}
              </td>
              <td v-if="rep" class="text table_borders">
                {{ rep.recived_amount }}
              </td>
              <td v-if="rep" class="text table_borders">
                {{ rep.balance_quantity }}
              </td>
              <td v-if="rep" class="text table_borders">
                {{ rep.sold_quantity }}
              </td>
              <td v-if="rep" class="text table_borders">
                {{ rep.sold_amount }}
              </td>
              <td v-if="rep" class="text table_borders">
                {{ rep.returned_quantity }}
              </td>
              <td v-if="rep" class="text table_borders">
                {{ rep.returned_amount }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-6"></div>
        <!-- shops -->
        <span class="table_topic">Shops</span>
        <div class="pt-3"></div>
        <table
          v-if="resultshops.length != 0"
          class="table table-sm table_borders"
          sortable
          style="width: 100%"
        >
          <thead>
            <tr class="table_header table_borders">
              <th class="text table_borders">Shop Name</th>
              <th class="text table_borders">Recieved Quantity</th>
              <th class="text table_borders">Recieved Amount</th>
              <th class="text table_borders">Returned Quantity</th>
              <th class="text table_borders">Returned Amount</th>
              <th class="text table_borders">Balance Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="shop in resultshops"
              :key="shop"
              style="page-break-inside: avoid"
              class="table-data table_borders"
            >
              <td v-if="shop" class="text table_borders">
                {{ shop.shop_name }}
              </td>

              <td v-if="shop" class="text table_borders">
                {{ shop.sum_quantity }}
              </td>
              <td v-if="shop" class="text table_borders">
                {{ shop.sum_sales }}
              </td>
              <td v-if="shop" class="text table_borders">
                {{ shop.sum_return_quantity }}
              </td>
              <td v-if="shop" class="text table_borders">
                {{ shop.sum_return_amount }}
              </td>
            </tr>
          </tbody>
        </table>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>
<script>
import ProductApi from "@/Api/Modules/products";
import shopApi from "@/Api/Modules/shop";
import SalesRepApi from "@/Api/Modules/salesrep";
import DistributerApi from "@/Api/Modules/distributer";
import { store } from "@/store";
export default {
  props: {
    selectedItem: Object,
  },
  data() {
    return {
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
      show: false,
      searchdata: "",
      startdate: "",
      enddate: "",
      loading: false,
      authRole: null,
      resultdistributors: [],
      resultsalesreps: [],
      resultshops: [],
    };
  },

  async created() {
    this.getAuthUser();
    await this.getProductBinCard();
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

    // get bin card report
    async getProductBinCard() {
      this.resultshops = [];
      this.resultsalesreps = [];
      this.resultdistributors = [];
      this.loading = true;
      // get seached data
      const res = await ProductApi.productbincard(
        this.selectedItem.id,
        this.shop.id,
        this.distributor.id,
        this.salesrep.id,
        this.startdate,
        this.enddate
      );

      //   map distributers with unique ids
      res.data.data.distributers.forEach((value) => {
        if (
          (this.shop.id != "" &&
            value.distributer_salesrep_shop_order_items &&
            value.distributer_salesrep_shop_order_items.length != 0) ||
          (this.shop.id != "" &&
            this.salesrep.id != "" &&
            value.distributer_salesrep_shop_order_items &&
            value.distributer_salesrep_shop_order_items.length != 0) ||
          (this.shop.id != "" &&
            this.distributor.id != "" &&
            value.distributer_salesrep_shop_order_items &&
            value.distributer_salesrep_shop_order_items.length != 0) ||
          (this.shop.id != "" &&
            this.distributor.id != "" &&
            this.salesrep.id != "" &&
            value.distributer_salesrep_shop_order_items &&
            value.distributer_salesrep_shop_order_items.length != 0)
        ) {
          value.distributer_salesrep_shop_order_items.forEach((val) => {
            if (this.resultdistributors.length != 0) {
              // Check if this distributer already exists in the new array
              if (val.distributer) {
                const exists = this.resultdistributors.some(
                  (d) => d && d.id && d.id == val.distributer.id
                );

                if (!exists) {
                  // push the distributer object (or customize what you want to push)
                  this.resultdistributors.push(val.distributer);
                }
              }
            } else {
              this.resultdistributors.push(val.distributer);
            }
          });
        } else if (
          (this.salesrep.id != "" &&
            value.distributer_salesrep_order_items &&
            value.distributer_salesrep_order_items.length != 0) ||
          (this.distributor.id != "" &&
            this.salesrep.id != "" &&
            value.distributer_salesrep_order_items &&
            value.distributer_salesrep_order_items.length != 0)
        ) {
          value.distributer_salesrep_order_items.forEach((val) => {
            if (this.resultdistributors.length !== 0) {
              // Check if this distributer already exists in the new array
              if (value.distributer) {
                const exists = this.resultdistributors.some(
                  (d) => d && d.id && d.id == val.distributer.id
                );

                if (!exists) {
                  // push the distributer object (or customize what you want to push)
                  this.resultdistributors.push(val.distributer);
                }
              }
            } else {
              this.resultdistributors.push(val.distributer);
            }
          });
        } else {
          if (this.resultdistributors.length !== 0) {
            // Check if this distributer already exists in the new array

            if (value.distributer) {
              const exists = this.resultdistributors.some(
                (d) => d && d.id && d.id == value.distributer.id
              );

              if (!exists) {
                // push the distributer object (or customize what you want to push)

                this.resultdistributors.push(value.distributer);
              }
            }
          } else {
            this.resultdistributors.push(value.distributer);
          }
        }
      });

      //   map salesrep with unique ids to new array
      res.data.data.reps.forEach((value) => {
        if (
          (this.shop.id != "" &&
            value.distributer_salesrep_shop_order_items &&
            value.distributer_salesrep_shop_order_items.length != 0) ||
          (this.shop.id != "" &&
            this.salesrep.id != "" &&
            value.distributer_salesrep_shop_order_items &&
            value.distributer_salesrep_shop_order_items.length != 0) ||
          (this.shop.id != "" &&
            this.distributor.id != "" &&
            value.distributer_salesrep_shop_order_items &&
            value.distributer_salesrep_shop_order_items.length != 0)
        ) {
          value.distributer_salesrep_shop_order_items.forEach((val) => {
            if (this.resultsalesreps.length != 0) {
              // Check if this distributer already exists in the new array
              if (val.salesrep) {
                const exists = this.resultsalesreps.some(
                  (d) => d && d.id && d.id == val.salesrep.id
                );

                if (!exists) {
                  // push the distributer object (or customize what you want to push)
                  this.resultsalesreps.push(val.salesrep);
                }
              }
            } else {
              this.resultsalesreps.push(val.salesrep);
            }
          });
        } else {
          // Check if this salesreps already exists in the new array

          if (this.resultsalesreps.length !== 0) {
            if (value.salesrep) {
              const exists = this.resultsalesreps.some(
                (d) => d && d.id && d.id == value.salesrep.id
              );

              if (!exists) {
                // push the salesrep object (or customize what you want to push)
                this.resultsalesreps.push(value.salesrep);
              }
            }
          } else {
            this.resultsalesreps.push(value.salesrep);
          }
        }
      });

      //   map shop with unique ids to new array
      res.data.data.shops.forEach((value) => {
        // Check if this shops already exists in the new array
        if (this.resultshops.length != 0) {
          if (value.shop) {
            const exists = this.resultshops.some(
              (d) => d && d.id && d.id == value.shop.id
            );

            if (!exists) {
              // push the shop object (or customize what you want to push)
              this.resultshops.push(value.shop);
            }
          }
        } else {
          this.resultshops.push(value.shop);
        }
      });

      this.loading = false;
    },

    // // clear searches

    // clear button
    async clear() {
      // reset searches
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
      // get authenticated users if worker(area manager , distruibuter , salerep) is logged in
      this.getAuthUser();
      await this.getProductBinCard();
    },
  },
};
</script>
