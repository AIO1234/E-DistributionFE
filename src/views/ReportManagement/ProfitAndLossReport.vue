<template>
  <div class="report_managemnt mt-9">
    <div>
      <!-- search section - year only, month-wise detail is shown as table rows -->
      <div class="pt-15">
        <v-row>
          <!-- year -->
          <v-col lg="3" cols="12">
            <v-autocomplete
              v-model="selectedYear"
              :items="years"
              placeholder="Select Year"
              class="search_input"
              clearable
            ></v-autocomplete>
          </v-col>

          <!-- normal search -->
          <v-col lg="3" cols="12">
            <v-text-field
              v-model="searchdata"
              placeholder="Search.."
              class="search_input"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="tabler-search"></v-icon>
              </template>
            </v-text-field>
          </v-col>

          <!-- search button -->
          <v-col lg="3" cols="12">
            <v-btn class="search_button" variant="none" @click="search()"
              ><span class="text">Search</span></v-btn
            >
          </v-col>

          <!-- clear button -->
          <v-col lg="3" cols="12">
            <v-btn class="clear_button" variant="none" @click="clear()"
              ><span class="text">Clear</span></v-btn
            >
          </v-col>
        </v-row>

        <v-row>
          <!-- export button -->
          <v-col lg="3" cols="12">
            <v-btn class="exfort_button" variant="none">
              <download-excel
                :data="exportRows"
                :fields="collumns"
                worksheet="Profit And Loss Report"
                :name="`as of ${todaydate} profitandloss.xls`"
              >
                <span class="text">Export</span>
              </download-excel>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="pt-12">
      <!-- one row per month for the selected year -->
      <v-card class="pnl_table">
        <v-skeleton-loader
          :loading="loading"
          style="background-color: transparent"
          type="image, list-item-two-line"
        >
          <v-responsive>
            <v-data-table
              :headers="monthlyHeaders"
              :items="filteredMonthlyRows"
              items-per-page="50"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title
                    ><center>
                      <span class="table_topic">Profit And Loss Report - {{ selectedYear }}</span>
                    </center></v-toolbar-title
                  >
                </v-toolbar>
              </template>

              <!-- income -->
              <template v-slot:item.shop_order_income="props">
                {{ getPrice(props.item.shop_order_income) }}
              </template>
              <template v-slot:item.showroom_distributed_income="props">
                {{ getPrice(props.item.showroom_distributed_income) }}
              </template>
              <template v-slot:item.total_income="props">
                {{ getPrice(props.item.total_income) }}
              </template>

              <!-- expense category amounts -->
              <template v-slot:item.courier_expenses="props">
                {{ getPrice(props.item.courier_expenses) }}
              </template>
              <template v-slot:item.salesrep_expenses="props">
                {{ getPrice(props.item.salesrep_expenses) }}
              </template>
              <template v-slot:item.supplier_expenses="props">
                {{ getPrice(props.item.supplier_expenses) }}
              </template>
              <template v-slot:item.other_expenses="props">
                {{ getPrice(props.item.other_expenses) }}
              </template>
              <template v-slot:item.total_expenses="props">
                {{ getPrice(props.item.total_expenses) }}
              </template>

              <!-- status -->
              <template v-slot:item.status="props">
                <v-chip
                  :color="props.item.status === 'Profit' ? 'success' : 'error'"
                  size="small"
                  label
                >
                  {{ props.item.status }}
                </v-chip>
              </template>

              <!-- profit/loss amount -->
              <template v-slot:item.profit_loss_amount="props">
                <span :class="props.item.status === 'Profit' ? 'profit_text' : 'loss_text'">
                  {{ getPrice(props.item.profit_loss_amount) }}
                </span>
              </template>

              <!-- view every individual expense category for the month -->
              <template v-slot:item.view_expenses="props">
                <v-btn
                  color="transparent"
                  variant="none"
                  @click="openExpenseBreakdown(props.item)"
                >
                  <v-icon icon="tabler-eye" size="large" />
                </v-btn>
              </template>
            </v-data-table>
          </v-responsive>
        </v-skeleton-loader>
      </v-card>
    </div>

    <!-- expense breakdown popup - every individual expense category for the selected month -->
    <v-dialog
      v-model="breakdownDialog"
      max-width="600px"
      persistent
      scrollable
      class="masterdata"
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="breakdownDialog = false">
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

        <v-card-title>
          <center>Expense Breakdown - {{ selectedMonth.month_name }}</center>
        </v-card-title>

        <v-card-text>
          <v-table v-if="Object.keys(selectedMonth.expense_breakdown || {}).length">
            <thead>
              <tr>
                <th>Expense Type</th>
                <th class="text-right">Amount(Rs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(amount, type) in selectedMonth.expense_breakdown" :key="type">
                <td>{{ type }}</td>
                <td class="text-right">{{ getPrice(amount) }}</td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="expense_breakdown_empty">
            No other expenses recorded for {{ selectedMonth.month_name }}.
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ReportApi from "@/Api/Modules/reports";
import JsonExcel from "vue-json-excel3";
import mixin from "@/mixins/commonmixins";

const CURRENT_YEAR = new Date().getFullYear();

export default {
  components: {
    downloadExcel: JsonExcel,
  },

  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD",
      ),

      years: Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i),
      selectedYear: CURRENT_YEAR,

      searchdata: "",

      // month table stays a fixed set of columns; the individual expense
      // categories (Rent, Fuel, Packaging, etc.) are shown per-month in the
      // "view expenses" popup instead of one column each, since the
      // category list is data-driven and can grow past what a table can
      // show side by side
      fixedHeaders: [
        { title: "Month", align: "start", key: "month_name" },
        {
          title: "Shop Order Income(Rs)",
          align: "start",
          key: "shop_order_income",
          headerProps: { class: "income_column" },
          cellProps: { class: "income_column" },
        },
        {
          title: "Showroom Distributed Income(Rs)",
          align: "start",
          key: "showroom_distributed_income",
          headerProps: { class: "income_column" },
          cellProps: { class: "income_column" },
        },
        {
          title: "Total Income(Rs)",
          align: "start",
          key: "total_income",
          headerProps: { class: "income_column" },
          cellProps: { class: "income_column" },
        },
        {
          title: "Courier Expenses(Rs)",
          align: "start",
          key: "courier_expenses",
          headerProps: { class: "expense_column" },
          cellProps: { class: "expense_column" },
        },
        {
          title: "Sales Rep Expenses(Rs)",
          align: "start",
          key: "salesrep_expenses",
          headerProps: { class: "expense_column" },
          cellProps: { class: "expense_column" },
        },
        {
          title: "Supplier Expenses(Rs)",
          align: "start",
          key: "supplier_expenses",
          headerProps: { class: "expense_column" },
          cellProps: { class: "expense_column" },
        },
      ],
      trailingHeaders: [
        {
          title: "Other Expenses(Rs)",
          align: "start",
          key: "other_expenses",
          headerProps: { class: "expense_column" },
          cellProps: { class: "expense_column" },
        },
        {
          title: "Total Expenses(Rs)",
          align: "start",
          key: "total_expenses",
          headerProps: { class: "expense_column" },
          cellProps: { class: "expense_column" },
        },
        { title: "Status", align: "start", key: "status" },
        { title: "Profit/Loss Amount(Rs)", align: "start", key: "profit_loss_amount" },
        { title: "Other Expense Distribution", align: "center", key: "view_expenses", sortable: false },
      ],
      fixedColumns: {
        Month: "month_name",
        "Shop Order Income(Rs)": "shop_order_income",
        "Showroom Distributed Income(Rs)": "showroom_distributed_income",
        "Total Income(Rs)": "total_income",
        "Courier Expenses(Rs)": "courier_expenses",
        "Sales Rep Expenses(Rs)": "salesrep_expenses",
        "Supplier Expenses(Rs)": "supplier_expenses",
      },
      trailingColumns: {
        "Other Expenses(Rs)": "other_expenses",
        "Total Expenses(Rs)": "total_expenses",
        Status: "status",
        "Profit/Loss Amount(Rs)": "profit_loss_amount",
      },

      // one row per calendar month, computed entirely server-side (income
      // and expense aggregation lives in ReportImplementation::profitAndLossReport)
      monthlyRows: [],

      // expense breakdown popup - which month it's showing
      breakdownDialog: false,
      selectedMonth: {},

      loading: false,
    };
  },

  computed: {
    monthlyHeaders() {
      return [...this.fixedHeaders, ...this.trailingHeaders];
    },

    filteredMonthlyRows() {
      const search = this.searchdata.trim().toLowerCase();

      if (!search) return this.monthlyRows;

      return this.monthlyRows.filter(
        (row) =>
          row.month_name.toLowerCase().includes(search) ||
          row.status.toLowerCase().includes(search),
      );
    },

    // every expense type present in the year's data (server sends the same
    // zero-filled set of keys on every row's expense_breakdown) - only
    // needed to build the per-category export columns below
    expenseTypes() {
      const firstRow = this.monthlyRows[0];

      return firstRow ? Object.keys(firstRow.expense_breakdown || {}) : [];
    },

    collumns() {
      const typeColumns = {};

      this.expenseTypes.forEach((type) => {
        typeColumns[`${type}(Rs)`] = type;
      });

      return { ...this.fixedColumns, ...typeColumns, ...this.trailingColumns };
    },

    // export needs every expense category as its own flat, formatted field
    // (matching collumns above) - the on-screen table shows the same detail
    // via the "view expenses" popup instead of one column per category
    exportRows() {
      return this.filteredMonthlyRows.map((row) => {
        const breakdown = {};

        Object.entries(row.expense_breakdown || {}).forEach(([type, amount]) => {
          breakdown[type] = this.getPrice(amount);
        });

        return { ...row, ...breakdown };
      });
    },
  },

  async created() {
    await this.getProfitAndLossReport();
  },

  methods: {
    // income and expenses are fully aggregated server-side (see
    // ReportImplementation::profitAndLossReport) - one row per month back
    async getProfitAndLossReport() {
      this.loading = true;

      try {
        const res = await ReportApi.ProfitAndLossReport(this.selectedYear);

        this.monthlyRows = res.data.data || [];
      } finally {
        this.loading = false;
      }
    },

    // search button - refetch everything for the selected year
    async search() {
      await this.getProfitAndLossReport();
    },

    // clear filters back to defaults and refetch
    async clear() {
      this.selectedYear = CURRENT_YEAR;
      this.searchdata = "";

      await this.getProfitAndLossReport();
    },

    // open the expense breakdown popup for the clicked month's row
    openExpenseBreakdown(month) {
      this.selectedMonth = month;
      this.breakdownDialog = true;
    },
  },
};
</script>

<style scoped>
:deep(.income_column) {
  background-color: #e6ffe6;
}

:deep(.expense_column) {
  background-color: #ffe6e6;
}

.profit_text {
  color: #0d6938;
  font-weight: 600;
}

.loss_text {
  color: #b3261e;
  font-weight: 600;
}

.expense_breakdown_empty {
  color: #888;
  font-size: 0.875rem;
  font-style: italic;
}
</style>
