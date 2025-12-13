import { api } from "../index";
import { store } from "@/store";

export default {
  async allDistributers(payload) {
    return await api.post("/distributers/index", payload);
  },
  async storeDistributer(payload) {
    return await api.post("/distributers/store", payload);
  },

  async updateDistributer(payload) {
    return await api.post("/distributers/update", payload);
  },

  async storeDistributerOrder(payload) {
    return await api.post("/distributers/storedistributerorder", payload);
  },

  async allDistributerOrders(payload) {
    return await api.post("/distributers/showdistributerorders", payload);
  },

  async DistributerOrderSummary(payload) {
    return await api.post("/distributers/showdistributerordersummary", payload);
  },

  async SendProductsForDistributers(payload) {
    return await api.post("/distributers/sendproductsfordistributers", payload);
  },

  async EditDistributerOrder(payload) {
    return await api.post("/distributers/editdistributerorders", payload);
  },

  async UpdateDistributerOrders(payload) {
    return await api.post("/distributers/updatesenddistributerorder", payload);
  },

  async EditDistributerOrderCommision(payload) {
    return await api.post(
      "/distributers/editdistributerordercommision",
      payload
    );
  },
};
