<template>
  <div class="masterdata">
    <!-- select searches -->
    <VSkeletonLoader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <VResponsive>
        <VRow>
          <!-- select shop -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Select Shop</label>
            <div class="pt-2" />
            <VAutocomplete
              v-model="shop"
              placeholder="Select Shop"
              :items="shops"
              :loading="shopsLoading"
              no-filter
              item-title="shop_name"
              item-value="id"
              return-object
              class="selection"
              @update:model-value="getProductBinCard"
              @update:search="onShopSearch"
            >
              <template v-slot:item="{ props, item }">
                <VListItem
                  v-bind="props"
                  :title="item.raw.shop_name"
                  :subtitle="
                    item.raw.area?.area_name ?? item.raw.area_name ?? ''
                  "
                />
              </template>
            </VAutocomplete>
          </VCol>
          <!-- select distributer -->
          <VCol
            v-if="
              authRole === 'Super Admin' ||
                authRole === 'Admin' ||
                authRole === 'Staff' ||
                authRole === 'Area Manager' ||
                authRole === 'Distributer'
            "
            lg="6"
            cols="12"
          >
            <label class="label">Select ShowRoom</label>
            <div class="pt-2" />
            <VAutocomplete
              v-model="distributor"
              placeholder="Select ShowRoom"
              :items="distributors"
              item-title="distributer_name"
              item-value="id"
              return-object
              class="selection"
              @update:model-value="getProductBinCard"
            />
          </VCol>

          <!-- select salesrep -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Select SalesRep</label>
            <div class="pt-2" />
            <VAutocomplete
              v-model="salesrep"
              placeholder="Select SalesRep"
              :items="salesreps"
              item-title="rep_name"
              item-value="id"
              return-object
              class="selection"
              @update:model-value="getProductBinCard"
            />
          </VCol>

          <!-- select vehicle -->
          <VCol
            lg=""
            cols="12"
          >
            <label class="label">Select Vehicle</label>
            <div class="pt-2" />
            <VAutocomplete
              v-model="vehicle"
              placeholder="Select Vehicle"
              :items="vehicles"
              item-title="vehicle_no"
              item-value="id"
              return-object
              class="selection"
              @update:model-value="getProductBinCard"
            />
          </VCol>
        </VRow>
        <!-- searches -->
        <VRow>
          <!-- start order date -->
          <VCol
            lg="4"
            cols="12"
          >
            <AppDateTimePicker
              v-model="startdate"
              placeholder="Start Order Date"
              class="search_date"
            />
          </VCol>

          <!--  end order date -->
          <VCol
            lg="4"
            cols="12"
          >
            <AppDateTimePicker
              v-model="enddate"
              placeholder="End Order Date"
              class="search_date"
            />
          </VCol>

          <!-- search button -->
          <VCol
            lg="2"
            cols="12"
          >
            <VBtn
              class="search_button"
              variant="none"
              @click="getProductBinCard"
            >
              <span class="text">Search</span>
            </VBtn>
          </VCol>

          <!-- clear button -->
          <VCol
            lg="2"
            cols="12"
          >
            <VBtn
              class="clear_button"
              variant="none"
              @click="clear"
            >
              <span class="text">Clear</span>
            </VBtn>
          </VCol>
        </VRow>
        <div class="pt-6" />
        <!-- distributors -->
        <span
          v-if="
            authRole === 'Super Admin' ||
              authRole === 'Admin' ||
              authRole === 'Staff' ||
              authRole === 'Area Manager' ||
              authRole === 'Distributer'
          "
          class="table_topic"
        >Distributors</span>
        <div class="pt-3" />
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
              <th class="text table_borders">
                Distributor Name
              </th>
              <th class="text table_borders">
                Distributed Quantity
              </th>
              <th class="text table_borders">
                Distributed Amount(Rs)
              </th>
              <th class="text table_borders">
                Balance Stock
              </th>
              <th class="text table_borders">
                Sold Quantity
              </th>
              <th class="text table_borders">
                Sold Amount(Rs)
              </th>
              <th class="text table_borders">
                Returned Stock
              </th>
              <th class="text table_borders">
                Returned Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="distributer in resultdistributors"
              :key="distributer"
              style="page-break-inside: avoid"
              class="table-data table_borders"
            >
              <td
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.distributer_name }}
              </td>
              <td
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.sum_quantity }}
              </td>
              <td
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.recived_amount }}
              </td>
              <td
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.balance_quantity }}
              </td>
              <td
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.sold_quantity }}
              </td>
              <td
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.sold_amount }}
              </td>
              <th
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.returned_quantity }}
              </th>
              <th
                v-if="distributer"
                class="text table_borders"
              >
                {{ distributer.returned_amount }}
              </th>
            </tr>
          </tbody>
        </table>

        <div class="pt-6" />
        <!-- Sales Reps -->
        <span class="table_topic">SalesReps</span>
        <div class="pt-3" />
        <table
          v-if="resultsalesreps.length !== 0"
          class="table table-sm table_borders"
          sortable
          style="width: 100%"
        >
          <thead>
            <tr class="table_header table_borders">
              <th class="text table_borders">
                SalesRep Name
              </th>
              <th class="text table_borders">
                Distributed Quantity
              </th>
              <th class="text table_borders">
                Distributed Amount(Rs)
              </th>
              <th class="text table_borders">
                Balance Stock
              </th>
              <th class="text table_borders">
                Sold Quantity
              </th>
              <th class="text table_borders">
                Sold Amount(Rs)
              </th>
              <th class="text table_borders">
                Returned Stock
              </th>
              <th class="text table_borders">
                Returned Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="rep in resultsalesreps"
              :key="rep"
              style="page-break-inside: avoid"
              class="table-data table_borders"
            >
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.rep_name }}
              </td>
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.sum_quantity }}
              </td>
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.recived_amount }}
              </td>
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.balance_quantity }}
              </td>
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.sold_quantity }}
              </td>
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.sold_amount }}
              </td>
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.returned_quantity }}
              </td>
              <td
                v-if="rep"
                class="text table_borders"
              >
                {{ rep.returned_amount }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-6" />
        <!-- Vehicles -->
        <span class="table_topic">Vehicles</span>
        <div class="pt-3" />
        <table
          v-if="resultvehicles.length !== 0"
          class="table table-sm table_borders"
          sortable
          style="width: 100%"
        >
          <thead>
            <tr class="table_header table_borders">
              <th class="text table_borders">
                Vehicle Name
              </th>
              <th class="text table_borders">
                Distributed Quantity
              </th>
              <th class="text table_borders">
                Distributed Amount(Rs)
              </th>
              <th class="text table_borders">
                Balance Stock
              </th>
              <th class="text table_borders">
                Sold Quantity
              </th>
              <th class="text table_borders">
                Sold Amount(Rs)
              </th>
              <th class="text table_borders">
                Returned Stock
              </th>
              <th class="text table_borders">
                Returned Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="vehicleRow in resultvehicles"
              :key="vehicleRow"
              style="page-break-inside: avoid"
              class="table-data table_borders"
            >
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.vehicle_no }}
              </td>
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.sum_quantity }}
              </td>
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.recived_amount }}
              </td>
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.balance_quantity }}
              </td>
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.sold_quantity }}
              </td>
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.sold_amount }}
              </td>
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.returned_quantity }}
              </td>
              <td
                v-if="vehicleRow"
                class="text table_borders"
              >
                {{ vehicleRow.returned_amount }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pt-6" />
        <!-- shops -->
        <span class="table_topic">Shops</span>
        <div class="pt-3" />
        <table
          v-if="resultshops.length != 0"
          class="table table-sm table_borders"
          sortable
          style="width: 100%"
        >
          <thead>
            <tr class="table_header table_borders">
              <th class="text table_borders">
                Shop Name
              </th>
              <th class="text table_borders">
                Recieved Quantity
              </th>
              <th class="text table_borders">
                Recieved Amount
              </th>
              <th class="text table_borders">
                Returned Quantity
              </th>
              <th class="text table_borders">
                Returned Amount
              </th>
              <th class="text table_borders">
                Balance Stock
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="shop in resultshops"
              :key="shop"
              style="page-break-inside: avoid"
              class="table-data table_borders"
            >
              <td
                v-if="shop"
                class="text table_borders"
              >
                {{ shop.shop_name }}
              </td>

              <td
                v-if="shop"
                class="text table_borders"
              >
                {{ shop.sum_quantity }}
              </td>
              <td
                v-if="shop"
                class="text table_borders"
              >
                {{ shop.sum_sales }}
              </td>
              <td
                v-if="shop"
                class="text table_borders"
              >
                {{ shop.sum_return_quantity }}
              </td>
              <td
                v-if="shop"
                class="text table_borders"
              >
                {{ shop.sum_return_amount }}
              </td>
            </tr>
          </tbody>
        </table>
      </VResponsive>
    </VSkeletonLoader>
  </div>
</template>

<script>
import ProductApi from "@/Api/Modules/products"
import shopApi from "@/Api/Modules/shop"
import SalesRepApi from "@/Api/Modules/salesrep"
import DistributerApi from "@/Api/Modules/distributer"
import { store } from "@/store"
import commonmixins from "@/mixins/commonmixins"

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
      vehicle: {
        id: "",
        vehicle_no: "",
      },
      shops: [],
      shopsLoading: false,
      salesreps: [],
      distributors: [],
      vehicles: [],
      show: false,
      searchdata: "",
      startdate: "",
      enddate: "",
      loading: false,
      authRole: null,
      resultdistributors: [],
      resultsalesreps: [],
      resultvehicles: [],
      resultshops: [],
    }
  },

  async created() {
    this.debouncedShopSearch = this.debounce(
      (searchdata) => this.getShops(searchdata),
      400,
    )

    this.getAuthUser()
    await this.getProductBinCard()
    await this.getShops()
    await this.SalesReps()
    await this.getVehicles()

    // if salesrep logged in distrinuter not loading
    if (
      this.authRole === "Super Admin" ||
      this.authRole === "Admin" ||
      this.authRole === "Staff" ||
      this.authRole === "Area Manager" ||
      this.authRole === "Distributer"
    ) {
      await this.Distributers()
    }
  },

  methods: {
    // get authenticated user ids
    getAuthUser() {
      const { getLoggedDistributer, getLoggedSaleRep, getRole, getUserName } =
        store.getters

      this.authRole = getRole

      // if user is area manager o r distributer set  the distrbter id
      if (getRole === "Area Manager" || getRole === "Distributer") {
        this.distributor.id = getLoggedDistributer
        this.distributor.distributer_name = getUserName
      }

      // if user is salesrep set  the salesrep id
      else if (getRole === "SalesRep") {
        this.salesrep.id = getLoggedSaleRep
        this.salesrep.rep_name = getUserName
      }
    },

    // get salesreps
    async SalesReps() {
      const res = await SalesRepApi.allSalesReps({ page: 1, per_page: 1000 })

      this.salesreps = res.data.data.data
    },

    // get vehicles from the globals
    async getVehicles() {
      this.vehicles = await commonmixins.methods.getVehicles()
    },

    // get distributers
    async Distributers() {
      const res = await DistributerApi.allDistributers({ page: 1, per_page: 1000 })

      this.distributors = res.data.data.data
    },

    // get shops matching the search text, capped so the whole 187+ shop
    // list is never loaded up front - typing narrows the results
    // server-side instead
    async getShops(searchdata = "") {
      this.shopsLoading = true

      const res = await shopApi.allShops({ seacrh_data: searchdata, page: 1, per_page: 40 })

      this.shops = res.data.data.data

      this.shopsLoading = false
    },

    // debounced so we don't fire a request on every keystroke
    onShopSearch(searchdata) {
      this.debouncedShopSearch(searchdata)
    },

    // get vehicle-wise bin card report
    async getVehicleBinCard() {
      const res = await ProductApi.productVehicleBinCard(
        this.selectedItem.id,
        this.startdate,
        this.enddate,
      )

      // narrow down to the selected vehicle, when one is picked
      this.resultvehicles =
        this.vehicle.id !== ""
          ? res.data.data.filter(vehicle => vehicle.id === this.vehicle.id)
          : res.data.data
    },

    // get bin card report
    async getProductBinCard() {
      this.resultshops = []
      this.resultsalesreps = []
      this.resultdistributors = []
      this.loading = true


      // get seached data
      const res = await ProductApi.productbincard(
        this.selectedItem.id,
        this.shop.id,
        this.distributor.id,
        this.salesrep.id,
        this.startdate,
        this.enddate,
      )

      await this.getVehicleBinCard()

      //   map distributers with unique ids
      res.data.data.distributers.forEach(value => {
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
          value.distributer_salesrep_shop_order_items.forEach(val => {
            if (this.resultdistributors.length != 0) {
              // Check if this distributer already exists in the new array
              if (val.distributer) {
                const exists = this.resultdistributors.some(
                  d => d && d.id && d.id == val.distributer.id,
                )

                if (!exists) {
                  // push the distributer object (or customize what you want to push)
                  this.resultdistributors.push(val.distributer)
                }
              }
            } else {
              this.resultdistributors.push(val.distributer)
            }
          })
        } else if (
          (this.salesrep.id != "" &&
            value.distributer_salesrep_order_items &&
            value.distributer_salesrep_order_items.length != 0) ||
          (this.distributor.id != "" &&
            this.salesrep.id != "" &&
            value.distributer_salesrep_order_items &&
            value.distributer_salesrep_order_items.length != 0)
        ) {
          value.distributer_salesrep_order_items.forEach(val => {
            if (this.resultdistributors.length !== 0) {
              // Check if this distributer already exists in the new array
              if (value.distributer) {
                const exists = this.resultdistributors.some(
                  d => d && d.id && d.id == val.distributer.id,
                )

                if (!exists) {
                  // push the distributer object (or customize what you want to push)
                  this.resultdistributors.push(val.distributer)
                }
              }
            } else {
              this.resultdistributors.push(val.distributer)
            }
          })
        } else {
          if (this.resultdistributors.length !== 0) {
            // Check if this distributer already exists in the new array

            if (value.distributer) {
              const exists = this.resultdistributors.some(
                d => d && d.id && d.id == value.distributer.id,
              )

              if (!exists) {
                // push the distributer object (or customize what you want to push)

                this.resultdistributors.push(value.distributer)
              }
            }
          } else {
            this.resultdistributors.push(value.distributer)
          }
        }
      })

      //   map salesrep with unique ids to new array
      res.data.data.reps.forEach(value => {
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
          value.distributer_salesrep_shop_order_items.forEach(val => {
            if (this.resultsalesreps.length != 0) {
              // Check if this distributer already exists in the new array
              if (val.salesrep) {
                const exists = this.resultsalesreps.some(
                  d => d && d.id && d.id == val.salesrep.id,
                )

                if (!exists) {
                  // push the distributer object (or customize what you want to push)
                  this.resultsalesreps.push(val.salesrep)
                }
              }
            } else {
              this.resultsalesreps.push(val.salesrep)
            }
          })
        } else {
          // Check if this salesreps already exists in the new array

          if (this.resultsalesreps.length !== 0) {
            if (value.salesrep) {
              const exists = this.resultsalesreps.some(
                d => d && d.id && d.id == value.salesrep.id,
              )

              if (!exists) {
                // push the salesrep object (or customize what you want to push)
                this.resultsalesreps.push(value.salesrep)
              }
            }
          } else {
            this.resultsalesreps.push(value.salesrep)
          }
        }
      })

      //   map shop with unique ids to new array
      res.data.data.shops.forEach(value => {
        // Check if this shops already exists in the new array
        if (this.resultshops.length != 0) {
          if (value.shop) {
            const exists = this.resultshops.some(
              d => d && d.id && d.id == value.shop.id,
            )

            if (!exists) {
              // push the shop object (or customize what you want to push)
              this.resultshops.push(value.shop)
            }
          }
        } else {
          this.resultshops.push(value.shop)
        }
      })

      this.loading = false
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
      (this.vehicle = {
        id: "",
        vehicle_no: "",
      }),
      (this.startdate = ""),
      (this.enddate = "")

      // get authenticated users if worker(area manager , distruibuter , salerep) is logged in
      this.getAuthUser()
      await this.getProductBinCard()
    },
  },
}
</script>
