import { api } from "../index";

export default {
  // all Vehicles
  async allVehicles(payload) {
    return await api.get("/vehicles/index", { params: payload });
  },

  // store Vehicle
  async storeVehicle(payload) {
    return await api.post("/vehicles/store", payload);
  },

  //   update Vehicle
  async updateVehicle(payload) {
    return await api.post("/vehicles/update", payload);
  },
};
