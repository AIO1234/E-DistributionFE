import { api } from "../index";
import { store } from "@/store";

export default {
  async allShops(payload = {}) {
    return await api.post("/shops/index", payload);
  },

  async storeShop(payload) {
    return await api.post("/shops/store", payload);
  },

  async updateShop(payload) {
    return await api.post("/shops/update", payload);
  },

  async storeShopOrder(payload) {
    return await api.post("/shops/storeshoporder", payload);
  },

  async allShopOrders(payload) {
    return await api.post("/shops/showshoporders", payload);
  },

  async SendProductsForShops(payload) {
    return await api.post("/shops/sendproductsforshops", payload);
  },

  async ShopOrderInvoice(payload) {
    return await api.post("/shops/shoporderinvoice", payload);
  },
};
