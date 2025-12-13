import { api } from "../index";
import { store } from "@/store";

export default {
  async allShopReturns(payload = {}) {
    return await api.post("/returns/shopreturns", payload);
  },
  async storeShopReturn(payload) {
    return await api.post("/returns/storereturn", payload);
  },

  async shopOrderProducts(payload) {
    return await api.post("/returns/shoporderproducts", payload);
  },

  async shopReturnInnerSummary(payload) {
    return await api.post("/returns/shopreturninnersummary", payload);
  },
};
