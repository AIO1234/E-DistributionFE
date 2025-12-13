import { api } from "../index";
import { store } from "@/store";

export default {
  async allShopPayments(payload = {}) {
    return await api.post("/payments/allshoppayments", payload);
  },
  async storeShopPayment(payload) {
    return await api.post("/payments/storepayment", payload);
  },

  async updateShopPayment(payload) {
    return await api.post("/payments/updatepayment", payload);
  },

  async dueShopInvoices(payload) {
    return await api.post("/payments/duesopinvoices", payload);
  },
};
