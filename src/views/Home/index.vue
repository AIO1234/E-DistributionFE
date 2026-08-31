<template>
  <div class="dashboard mt-9">
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <VResponsive>
        <!-- summary cards -->
        <VRow>
          <!-- Total Income card -->
          <VCol lg="4" cols="12">
            <VCard class="card_view">
              <VRow>
                <VCol lg="4" cols="3" class="d-flex align-center justify-center">
                  <div class="icon_wrap">
                    <v-icon icon="tabler-cash" size="32" color="#4340DA" />
                  </div>
                </VCol>
                <VCol lg="8" cols="9">
                  <div class="pt-1"></div>
                  <span class="heading_text">Total Income</span>
                  <div class="pt-1"></div>
                  <span class="sub_text">{{ getPrice(totalIncome) }}</span>
                </VCol>
              </VRow>
            </VCard>
          </VCol>

          <!-- Total Expenses card -->
          <VCol lg="4" cols="12">
            <VCard class="card_view">
              <VRow>
                <VCol lg="4" cols="3" class="d-flex align-center justify-center">
                  <div class="icon_wrap">
                    <v-icon icon="tabler-receipt-2" size="32" color="#4340DA" />
                  </div>
                </VCol>
                <VCol lg="8" cols="9">
                  <div class="pt-1"></div>
                  <span class="heading_text">Total Expenses</span>
                  <div class="pt-1"></div>
                  <span class="sub_text">{{ getPrice(totalExpenses) }}</span>
                </VCol>
              </VRow>
            </VCard>
          </VCol>

          <!-- Total Profit card -->
          <VCol lg="4" cols="12">
            <VCard class="card_view">
              <VRow>
                <VCol lg="4" cols="3" class="d-flex align-center justify-center">
                  <div class="icon_wrap">
                    <v-icon icon="tabler-report-money" size="32" color="#4340DA" />
                  </div>
                </VCol>
                <VCol lg="8" cols="9">
                  <div class="pt-1"></div>
                  <span class="heading_text">Total Profit</span>
                  <div class="pt-1"></div>
                  <span
                    class="sub_text"
                    :class="totalProfit >= 0 ? 'profit_text' : 'loss_text'"
                    >{{ getPrice(totalProfit) }}</span
                  >
                </VCol>
              </VRow>
            </VCard>
          </VCol>
        </VRow>

        <div class="mt-7"></div>
        <!-- charts -->
        <div class="charts">
          <!-- year selection -->
          <div>
            <VAutocomplete
              variant="outlined"
              class="selection"
              :items="years"
              v-model="filter.year"
              placeholder="Year"
              @update:model-value="getDashboardOverview()"
            >
            </VAutocomplete>
          </div>
          <div class="pt-5"></div>
          <VRow>
            <!-- Profit, Income & Expenses chart -->
            <VCol lg="6" cols="12">
              <VCard class="chart1_background">
                <span class="heading">Profit, Income &amp; Expenses</span>
                <apexchart
                  class="apex_chart"
                  type="line"
                  :options="fullchartoptions"
                  :series="allseries"
                ></apexchart>
              </VCard>
            </VCol>

            <!-- shop order income overview chart -->
            <VCol lg="6" cols="12">
              <VCard class="chart1_background">
                <span class="heading">Shop Order Income Overview</span>
                <apexchart
                  class="apex_chart"
                  type="bar"
                  :options="orderschartoptions"
                  :series="orderamountseries"
                ></apexchart>
              </VCard>
            </VCol>
          </VRow>
        </div>
      </VResponsive>
    </v-skeleton-loader>
  </div>
</template>

<script>
import ReportApi from "@/Api/Modules/analyzing";
import VueApexCharts from "vue3-apexcharts";

const CURRENT_YEAR = new Date().getFullYear();

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default {
  components: {
    apexchart: VueApexCharts,
  },

  data() {
    return {
      loading: false,

      totalIncome: 0,
      totalExpenses: 0,
      totalProfit: 0,

      filter: {
        year: CURRENT_YEAR,
      },
      years: Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i),

      // income/expenses/profit chart
      fullchartoptions: {
        chart: {
          id: "vuechart-profit-income-expenses",
        },
        xaxis: {
          categories: MONTH_NAMES,
          title: { text: "Month" },
        },
        colors: ["#00D475", "#FF0808", "#008ED4"],
        yaxis: {
          title: { text: "Amount (Rs)" },
        },
      },
      allseries: [
        { name: "Income", data: Array(12).fill(0) },
        { name: "Expenses", data: Array(12).fill(0) },
        { name: "Profit", data: Array(12).fill(0) },
      ],

      // shop order income chart
      orderschartoptions: {
        chart: {
          id: "vuechart-shop-order-income",
        },
        xaxis: {
          categories: MONTH_NAMES,
          title: { text: "Month" },
        },
        colors: ["#487FFF"],
        yaxis: {
          title: { text: "Order Amount (Rs)" },
        },
      },
      orderamountseries: [{ name: "Shop Order Income", data: Array(12).fill(0) }],
    };
  },

  created() {
    this.initData();
  },

  methods: {
    async initData() {
      await Promise.all([this.getTotalProfit(), this.getDashboardOverview()]);
    },

    // lifetime total income/expenses/profit
    async getTotalProfit() {
      this.loading = true;

      const res = await ReportApi.totalProfit();

      this.totalIncome = res.data.data.total_income;
      this.totalExpenses = res.data.data.total_expenses;
      this.totalProfit = res.data.data.profit;

      this.loading = false;
    },

    // monthly income/expenses/profit/shop order income for the selected year
    async getDashboardOverview() {
      this.loading = true;

      const res = await ReportApi.dashboardOverview(this.filter.year);

      this.allseries[0].data = res.data.data.incomearray;
      this.allseries[1].data = res.data.data.expencearray;
      this.allseries[2].data = res.data.data.profitarray;
      this.orderamountseries[0].data = res.data.data.orderstarray;

      this.loading = false;
    },
  },
};
</script>

<style scoped>
.profit_text {
  color: #0d6938;
}

.loss_text {
  color: #b3261e;
}
</style>
