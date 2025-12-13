import { api } from "../index";

export default {
  // all products
  async allUsers(payload) {
    return await api.get("/users/index", payload);
  },

  // store product
  async storeUser(payload) {
    return await api.post("/users/store", payload);
  },

  async updateUser(payload) {
    return await api.post("/users/update", payload);
  },

  async userRoles(payload) {
    return await api.post("/users/userroles", payload);
  },
};
