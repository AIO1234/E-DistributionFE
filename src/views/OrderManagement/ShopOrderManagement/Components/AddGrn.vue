<template>
  <GrnForm
    title="Add Good Receive Notice"
    submit-label="Save GRN"
    :order-reference="orderReference"
    :customer-name="customerName"
    :order-date="orderDate"
    :products="products"
    @save="save"
  />
</template>

<script>
import GrnForm from "./GrnForm.vue";
import { grnUiState, saveGrnRecord } from "@/utils/grnUiState";

export default {
  components: { GrnForm },
  data() {
    return {
      order: null,
      products: [],
    };
  },
  computed: {
    orderReference() {
      return this.order?.order_reference_id || this.order?.invoice_no || "N/A";
    },
    customerName() {
      return this.order?.customer || this.order?.shop?.shop_name || "N/A";
    },
    orderDate() {
      return this.order?.date || this.order?.order_date || "N/A";
    },
  },
  created() {
    const routeOrderId = String(this.$route.params.order_id);
    const selectedOrder = grnUiState.selectedOrder;
    this.order =
      selectedOrder && String(selectedOrder.id) === routeOrderId
        ? selectedOrder
        : {
            id: routeOrderId,
            order_reference_id: this.$route.query.orderId || routeOrderId,
            customer: this.$route.query.customer || "N/A",
            date: this.$route.query.date || "N/A",
            order_products: [],
          };
    this.products = this.makeProducts(this.order.order_products || []);
  },
  methods: {
    makeProducts(orderProducts) {
      return orderProducts.map((item, index) => ({
        key: `${item.id || item.product_code || "product"}-${index}`,
        productCode: item.product_code || item.product?.product_code || "N/A",
        productName: item.product_name || item.product?.product_name || "Product",
        orderedQuantity: Number(
          item.pivot?.quantity ?? item.quantity ?? item.ordered_quantity ?? 0,
        ),
        receivedQuantity: Number(item.pivot?.received_quantity || 0),
        returnedDamaged: Number(item.pivot?.returned_damaged || 0),
        returnedOther: Number(item.pivot?.returned_other || 0),
      }));
    },
    save() {
      saveGrnRecord(this.$route.params.order_id, {
        orderReference: this.orderReference,
        customerName: this.customerName,
        orderDate: this.orderDate,
        products: this.products.map((product) => ({ ...product })),
      });
      this.$router.push({ name: "factoryorder" });
    },
  },
};
</script>
