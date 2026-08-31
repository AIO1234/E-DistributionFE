import { api } from "../index";

export default {
  // dashboard total income/expenses/profit (lifetime)
  async totalProfit() {
    return await api.get(`/reports/dashboardsprofit`);
  },

  // dashboard monthly income/expense/profit/orders overview for a year
  async dashboardOverview(year) {
    return await api.get(`/reports/dashboardoverview?filter[year]=${year}`);
  },
};
