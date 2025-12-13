import { api } from "../index";
import { store } from "@/store";

export default {
  async storeFactoryOrder(payload) {
    return await api.post("/masterorders/storemasterorder", payload);
  },

  async allFactoryOrders(payload) {
    return await api.post("/masterorders/allmasterorders", payload);
  },

  async FactoryOrderSummary(payload) {
    return await api.post("/masterorders/showmasterordersummary", payload);
  },

  async EditFactoryOrder(payload) {
    return await api.post("/masterorders/editmasterorder", payload);
  },

  async UpdateFactoryOrder(payload) {
    return await api.post("/masterorders/updatemasterorder", payload);
  },
};
