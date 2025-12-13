import { api } from "../index";
import { store } from "@/store";

export default {
  async allSalesReps(payload = {}) {
    return await api.post("/reps/index", payload);
  },

  async storeSalesRep(payload) {
    return await api.post("/reps/store", payload);
  },

  async updateSalesRep(payload) {
    return await api.post("/reps/update", payload);
  },

  async storeSalesRepOrder(payload) {
    return await api.post("/reps/storesalesreporder", payload);
  },

  async allSalesRepOrders(payload) {
    return await api.post("/reps/showsalesreporders", payload);
  },

  async SaleRepOrderSummary(payload) {
    return await api.post("/reps/showsalesrepordersummary", payload);
  },

  async SendProductsForsalesreps(payload) {
    return await api.post("/reps/sendproductsforrep", payload);
  },

  async EditSalesRepOrder(payload) {
    return await api.post("/reps/editreporders", payload);
  },

  async UpdateSalesRepOrder(payload) {
    return await api.post("/reps/updatesalesreporders", payload);
  },

  async EditSalesRepOrderCommision(payload) {
    return await api.post("/reps/editsalesrepordercommision", payload);
  },
};
