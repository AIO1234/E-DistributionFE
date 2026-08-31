import { api } from "../index";

export default {
  // all expenses
  async allExpenses(payload) {
    return await api.post("/expenses/index", payload);
  },

  // store expense
  async storeExpense(payload) {
    return await api.post("/expenses/store", payload);
  },

  // update expense
  async updateExpense(payload) {
    return await api.post("/expenses/update", payload);
  },
};
