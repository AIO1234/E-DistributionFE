<template>
  <GrnForm
    title="Update Good Receive Notice"
    submit-label="Update GRN"
    :order-reference="record?.orderReference || 'N/A'"
    :customer-name="record?.customerName || 'N/A'"
    :order-date="record?.orderDate || 'N/A'"
    :products="products"
    @save="save"
  />
</template>

<script>
import GrnForm from "./GrnForm.vue";
import { getGrnRecord, saveGrnRecord } from "@/utils/grnUiState";

export default {
  components: { GrnForm },
  data() {
    return { record: null, products: [] };
  },
  created() {
    this.record = getGrnRecord(this.$route.params.order_id);
    if (!this.record) {
      this.$router.replace({
        name: "addgrn",
        params: { order_id: this.$route.params.order_id },
      });
      return;
    }
    this.products = this.record.products.map((product) => ({ ...product }));
  },
  methods: {
    save() {
      saveGrnRecord(this.$route.params.order_id, {
        ...this.record,
        products: this.products.map((product) => ({ ...product })),
      });
      this.$router.push({ name: "factoryorder" });
    },
  },
};
</script>
