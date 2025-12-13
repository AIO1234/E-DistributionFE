import { api } from "../index";

export default {
  // all areas
  async allAreas(payload) {
    return await api.get("/areas/index", payload);
  },

  // store area
  async storeArea(payload) {
    return await api.post("/areas/store", payload);
  },

  //   update area
  async updateArea(payload) {
    return await api.post("/areas/update", payload);
  },
};
