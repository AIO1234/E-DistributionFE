import { api } from "../index";

export default {
  async allSubDistributers() {
    return await api.post("/subdistributers/index");
  },

  async storeSubDistributer(payload) {
    return await api.post("/subdistributers/store", payload);
  },

  async updateSubDistributer(payload) {
    return await api.post("/subdistributers/update", payload);
  },

  async StoreSubDistributerOrder(payload) {
    return await api.post("/subdistributers/storesubdistributerorder", payload);
  },

  // get same sendproductsforrep api from the salesrep becasue both salesrep and subdistributer getting products from the distributer
  async SendProductsForSubDistributers(payload) {
    return await api.post("/reps/sendproductsforrep", payload);
  },

  // async showsubdistributerOrders() {
  //   return await api.post("/subdistributers/showsubdistributerorders", payload);
  // },

  async SubDistributerInvoice(payload) {
    return await api.post(
      "/subdistributers/subdistributerorderinvoice",
      payload
    );
  },
};
