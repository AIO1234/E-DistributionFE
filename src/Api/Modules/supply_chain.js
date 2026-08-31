import { api } from "../index"
import { toast } from "@/ApiConstance/toast"

export default {
  // store suplier
  async storeSupplier(payload) {
    return await api.post("/supply_chain/storesuplier", payload)
  },

  // update suplier
  async updateSupplier(payload, id) {
    return await api.put(`/supply_chain/updatesuplier/${id}`, payload)
  },

  // all supplier details
  async AllSuppliers(payload) {
    return await api.post("/supply_chain/allsupliers", payload)
  },

  // all supplier order
  async addPurchaseOrder(payload) {
    return await api.post("/supply_chain/storepurchaseorder", payload)
  },

  // show suplier and summary

  async showsuppliersummary(payload) {
    return await api.post("/supply_chain/showsuppliersummary", payload)
  },

  // edit suplier orders

  async editaPurchaseOrder(payload) {
    return await api.post("/supply_chain/editsuplierorder", payload)
  },

  // edit supplier order
  async updatePurchaseOrder(payload) {
    return await api.post("/supply_chain/updatepurchaseorder", payload)
  },

  // edit supplier order
  async suplierInvoice(payload) {
    return await api.post("/supply_chain/showsuplierinvoice", payload)
  },
}
