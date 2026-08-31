import { api } from "../index";

export default {
  // all Couriers
  async allCouriers(payload) {
    return await api.get("/couriers/index", { params: payload });
  },

  // store Courier
  async storeCourier(payload) {
    return await api.post("/couriers/store", payload);
  },

  //   update Courier
  async updateCourier(payload) {
    return await api.post("/couriers/update", payload);
  },
};
