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

  // distinct products available across a shop's orders
  async shopProductsForShop(payload) {
    return await api.post("/returns/shopproductsforshop", payload);
  },

  // shop orders that contain the selected product
  async shopOrdersForProduct(payload) {
    return await api.post("/returns/shopordersforproduct", payload);
  },

  async shopReturnInnerSummary(payload) {
    return await api.post("/returns/shopreturninnersummary", payload);
  },
};
