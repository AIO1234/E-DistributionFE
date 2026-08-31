import { api } from "../index";
import { store } from "@/store";

export default {
  async allShops(payload = {}) {
    return await api.post("/shops/index", payload);
  },

  async storeShop(payload) {
    return await api.post("/shops/store", payload);
  },

  // suggested next shop code, shown as an editable default on the add-shop form
  async nextShopCode() {
    return await api.get("/shops/nextcode");
  },

  async updateShop(payload) {
    return await api.post("/shops/update", payload);
  },

  async storeShopOrder(payload) {
    return await api.post("/shops/storeshoporder", payload);
  },

  // suggested next shop order invoice number, shown as an editable default on the send-shop form
  async nextShopOrderInvoiceNumber() {
    return await api.get("/shops/nextinvoicenumber");
  },

  // suggested next shop order delivery note number, shown as an editable default on the send-shop form
  async nextShopOrderDeliveryNoteNumber() {
    return await api.get("/shops/nextdeliverynotenumber");
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

  async GetShopOrderForUpdate(payload) {
    return await api.post("/shops/getshoporderforupdate", payload);
  },

  async UpdateShopOrder(payload) {
    return await api.post("/shops/updateshoporder", payload);
  },
};
