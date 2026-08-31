<template>
  <div class="mt-9 masterdata expense_management">
    <!-- seach boxes -->
    <div>
      <v-row>
        <v-col lg="6" class="text-right" cols="12"> </v-col>
        <!-- create Expense -->
        <v-col lg="6" class="text-right" cols="12">
          <v-btn class="create_btn" variant="none" @click="show = true">
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Create Expense</span>
          </v-btn>
        </v-col>
      </v-row>
      <div class="pt-15">
        <v-row>
          <!-- search expense id, type or reason -->
          <v-col lg="3" cols="12">
            <v-text-field
              v-model="searchdata"
              placeholder="Expense Id, Type Or Reason.."
              class="search_input"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="tabler-search"></v-icon>
              </template>
            </v-text-field>
          </v-col>

          <!-- start expense date -->
          <v-col lg="2" cols="12">
            <AppDateTimePicker
              v-model="filters.startDate"
              placeholder="Start Date"
              class="search_date"
            />
          </v-col>

          <!-- end expense date -->
          <v-col lg="2" cols="12">
            <AppDateTimePicker
              v-model="filters.endDate"
              placeholder="End Date"
              class="search_date"
            />
          </v-col>

          <!-- search button -->
          <v-col lg="3" cols="12">
            <v-btn class="search_button" variant="none" @click="getAllExpenses()">
              <span class="text">Search</span>
            </v-btn>
          </v-col>

          <!-- clear button -->
          <v-col lg="2" cols="12">
            <v-btn class="clear_button" variant="none" @click="clear()">
              <span class="text">Clear</span>
            </v-btn>
          </v-col>

          <!-- expense type -->
          <v-col lg="3" cols="12">
            <label class="label">Expense Type</label>
            <div class="pt-2" />
            <v-autocomplete
              v-model="filters.expenseType"
              :items="expenseTypes"
              placeholder="Expense Type"
              class="search_input"
              clearable
              @update:model-value="onExpenseTypeChange"
            />
          </v-col>

          <!-- sub category - only for the categories that have one -->
          <v-col v-if="subCategoriesByType[filters.expenseType]" lg="3" cols="12">
            <label class="label">Sub Category</label>
            <div class="pt-2" />
            <v-autocomplete
              v-model="filters.subCategory"
              :items="subCategoriesByType[filters.expenseType]"
              placeholder="Sub Category"
              class="search_input"
              clearable
              @update:model-value="onSubCategoryChange"
            />
          </v-col>

          <!-- select courier - only when filtering by the Courier sub category -->
          <v-col v-if="filters.subCategory === 'Courier'" lg="3" cols="12">
            <label class="label">Select Courier</label>
            <div class="pt-2" />
            <v-autocomplete
              v-model="selectedCourier"
              :items="couriers"
              item-title="company_name"
              item-value="id"
              placeholder="Select Courier"
              return-object
              class="search_input"
              clearable
            />
          </v-col>

          <!-- select sales rep - only when filtering by Sales Rep Commission expenses -->
          <v-col v-if="filters.expenseType === 'Sales Rep Commission'" lg="3" cols="12">
            <label class="label">Select Sales Rep</label>
            <div class="pt-2" />
            <v-autocomplete
              v-model="selectedSalesRep"
              :items="salesReps"
              item-title="rep_name"
              item-value="id"
              placeholder="Select Sales Rep"
              return-object
              class="search_input"
              clearable
            />
          </v-col>
        </v-row>
      </div>

      <!-- due / paid balance for the selected courier/sales rep - same
      layout as the shop due/paid balance boxes on the Incoming Payments
      screen -->
      <div v-if="selectedCourier || selectedSalesRep" class="pt-7">
        <div class="shop_balance_amount">
          <span class="text">
            Due Balance
            <span
              >For
              <b>{{ selectedCourier ? selectedCourier.company_name : selectedSalesRep.rep_name }}</b></span
            >
            :
            <b class="amount">{{
              getPrice(
                selectedCourier
                  ? selectedCourier.pending_from || 0
                  : selectedSalesRep.rep_due || 0
              )
            }}</b>
          </span>
        </div>

        <div class="pt-3"></div>

        <div class="shop_balance_amount">
          <span class="text">
            Paid Balance
            <span
              >From
              <b>{{ selectedCourier ? selectedCourier.company_name : selectedSalesRep.rep_name }}</b></span
            >
            :
            <b class="amount">{{
              getPrice(
                selectedCourier
                  ? selectedCourier.paid_from || 0
                  : selectedSalesRep.paidto_rep || 0
              )
            }}</b>
          </span>
        </div>
      </div>
    </div>
    <!-- content -->
    <div class="pt-7">
      <div class="pt-12"></div>
      <!-- table -->
      <v-card>
        <Table :Expenses="filteredExpenses" :loading="loading" @close="closeModal" />
      </v-card>
    </div>

    <!-- create dialog -->

    <v-dialog
      v-model="show"
      max-width="758.3px"
      min-height="216.97px"
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

        <v-card-text> <Create @close="closeModal" /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import Table from "./Components/Table.vue";
import Create from "./Components/Create.vue";
import ExpensesApi from "@/Api/Modules/expenses";
import CouriersApi from "@/Api/Modules/couriers";
import SalesRepApi from "@/Api/Modules/salesrep";

export default {
  data() {
    return {
      show: false,
      Expenses: [],
      loading: false,
      searchdata: "",
      // same options as the "Expense Type" selection in the Create/Update
      // expense forms (Courier lives under "Transportation & Delivery" as a
      // sub category there, not as its own top-level option)
      expenseTypes: [
        "Additional Payment",
        "Transport",
        "Sales Rep Commission",
        "Cost of Goods Sold",
        "Operating Expenses",
        "Transportation & Delivery",
        "Staff Salaries",
        "Office & Admin",
        "Financial",
        "Miscellaneous",
      ],
      // sub category options per main category - same map as the
      // Create/Update expense forms
      subCategoriesByType: {
        "Cost of Goods Sold": ["Packaging", "Purchase of trp"],
        "Operating Expenses": [
          "Rent",
          "Utilities (electricity, water, internet)",
          "Office Supplies",
          "Equipment (racks,blub,fan,ac)",
          "supplier",
        ],
        "Transportation & Delivery": [
          "Vehicle Purchase/Lease",
          "Fuel",
          "Driver Salaries",
          "Vehicle Maintenance",
          "Delivery Packaging",
          "Auto fees",
          "Courier",
        ],
        "Staff Salaries": [
          "Sales team",
          "Warehouse staff",
          "Delivery staff",
          "Accountant",
          "Admin & support",
        ],
        "Office & Admin": [
          "Utilities (sim,phone)",
          "Stationery & Supplies",
          "Software (Accounting, inventory)",
        ],
        "Financial": ["Bank Charges", "Loan Interest"],
        "Miscellaneous": [
          "Insurance (stock, Vehicle)",
          "Licenses & renewal Fees",
          "Depreciation On assets",
        ],
      },
      filters: {
        startDate: "",
        endDate: "",
        expenseType: "",
        subCategory: "",
      },
      couriers: [],
      salesReps: [],
      selectedCourier: null,
      selectedSalesRep: null,
    };
  },

  computed: {
    filteredExpenses() {
      return this.Expenses.filter((item) => {
        const expenseDate = item.expense_date;

        const matchDate =
          (!this.filters.startDate || expenseDate >= this.filters.startDate) &&
          (!this.filters.endDate || expenseDate <= this.filters.endDate);

        // a specific sub category narrows to that exact stored value; a
        // category with sub categories but none chosen yet matches any of
        // its sub category values; anything else matches the type directly
        let matchType = true;

        if (this.filters.subCategory) {
          matchType = item.expense_type === this.filters.subCategory;
        } else if (this.filters.expenseType) {
          const subs = this.subCategoriesByType[this.filters.expenseType];
          matchType = subs
            ? subs.includes(item.expense_type)
            : item.expense_type === this.filters.expenseType;
        }

        return matchDate && matchType;
      });
    },
  },
  components: {
    Table,
    Create,
  },

  async created() {
    await this.getAllExpenses();
    await this.getCouriers();
    await this.getSalesReps();
  },

  methods: {
    // get all Expenses
    async getAllExpenses() {
      // initialize payload
      const payload = {
        searchdata: this.searchdata,
      };
      this.loading = true;
      try {
        const res = await ExpensesApi.allExpenses(payload);
        this.Expenses = res.data.data;
      } finally {
        this.loading = false;
      }
    },

    // get all couriers - used by the "Select Courier" due/paid balance lookup
    async getCouriers() {
      const res = await CouriersApi.allCouriers({ page: 1, per_page: 1000 });
      this.couriers = res.data.data.data;
    },

    // get all sales reps - used by the "Select Sales Rep" due/paid balance lookup
    async getSalesReps() {
      const res = await SalesRepApi.allSalesReps({ page: 1, per_page: 1000 });
      this.salesReps = res.data.data.data;
    },

    // reset the sub category/courier/sales rep selection whenever the
    // main expense type filter changes
    onExpenseTypeChange() {
      this.filters.subCategory = "";
      this.selectedCourier = null;
      this.selectedSalesRep = null;
    },

    // reset the courier selection whenever the sub category filter changes
    onSubCategoryChange() {
      this.selectedCourier = null;
    },

    // close
    async closeModal() {
      this.show = false;
      // call Expenses
      await this.getAllExpenses();
    },

    // clear search
    async clear() {
      this.searchdata = "";
      this.filters = {
        startDate: "",
        endDate: "",
        expenseType: "",
        subCategory: "",
      };
      this.selectedCourier = null;
      this.selectedSalesRep = null;
      await this.getAllExpenses();
    },
  },
};
</script>
