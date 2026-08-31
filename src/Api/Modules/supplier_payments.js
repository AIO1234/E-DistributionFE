import { api } from "../index"
import { toast } from "@/ApiConstance/toast"

export default {
  // Store Supplier Payment
  async SupplierPaymentStore(payload) {
    return await api.post(
      "/supplier-payments/store-supplier-payment",
      payload,
    )
  },

  // Get All Supplier Payments (optionally filtered by suplier_id, searchdata,
  // startdate, enddate, payment_status)
  async getAllSupplierPayments(payload = {}) {
    return await api.post(
      "/supplier-payments/get-all-supplier-payments",
      payload,
    )
  },

  // Upload Payment Receipt
  async uploadReceipt(payload) {
    return await api.post(
      "/supplier-payments/upload-payment-receipt",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )
  },

  // Edit Supplier Payment
  async SupplierPaymentEdit(payload) {
    return await api.post(
      "/supplier-payments/edit-supplier-payment",
      payload,
    )
  },

  // Update Supplier Payment
  async SupplierPaymentUpdate(payload) {
    return await api.post(
      "/supplier-payments/update-supplier-payment",
      payload,
    )
  },

  // Due Supplier Orders
  async SupplierDueOrders(payload) {
    return await api.post(
      "/supplier-payments/due-supplier-orders",
      payload,
    )
  },
}
