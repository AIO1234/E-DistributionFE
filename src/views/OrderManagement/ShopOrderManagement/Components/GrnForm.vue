<template>
  <div class="order_management">
    <div class="send_shops pt-3">
      <v-row>
        <v-col lg="4" cols="12">
          <v-btn
            class="back_button"
            variant="none"
            @click="$router.back()"
            elevation="6"
          >
            <v-icon icon="tabler-chevron-left" class="text"></v-icon>
            <span class="text pl-2">Back</span>
          </v-btn>
        </v-col>
        <v-col lg="8" cols="12" class="pt-5">
          <h2 class="title">{{ title }}</h2>
        </v-col>
      </v-row>

      <v-card class="grn_form_card mt-10">
        <v-card-text>
          <v-row>
            <v-col lg="4" cols="12">
              <label class="label">Order ID</label>
              <div class="pt-2"></div>
              <v-text-field
                :model-value="orderReference"
                readonly
                class="product_input"
              />
            </v-col>
            <v-col lg="4" cols="12">
              <label class="label">Customer</label>
              <div class="pt-2"></div>
              <v-text-field
                :model-value="customerName"
                readonly
                class="product_input"
              />
            </v-col>
            <v-col lg="4" cols="12">
              <label class="label">Order Date</label>
              <div class="pt-2"></div>
              <v-text-field
                :model-value="orderDate"
                readonly
                class="product_input"
              />
            </v-col>
          </v-row>

          <div class="pt-4"></div>
          <div class="grn_products_table_wrapper">
            <v-table class="grn_products_table">
              <thead>
                <tr>
                  <th class="thclass">Product Code</th>
                  <th class="thclass">Product Name</th>
                  <th class="thclass">Ordered Qty</th>
                  <th class="thclass">Received Qty</th>
                  <th class="thclass">Returned - Damaged</th>
                  <th class="thclass">Returned - Other</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.key">
                  <td class="tdclass">{{ product.productCode }}</td>
                  <td class="tdclass">{{ product.productName }}</td>
                  <td class="tdclass">{{ product.orderedQuantity }}</td>
                  <td class="tdclass">
                    <v-text-field
                      v-model.number="product.receivedQuantity"
                      type="number"
                      min="0"
                      class="product_input"
                      density="compact"
                      hide-details
                      :readonly="readonly"
                      aria-label="Received quantity"
                    />
                  </td>
                  <td class="tdclass">
                    <v-text-field
                      v-model.number="product.returnedDamaged"
                      type="number"
                      min="0"
                      class="product_input"
                      density="compact"
                      hide-details
                      :readonly="readonly"
                      aria-label="Damaged returned quantity"
                    />
                  </td>
                  <td class="tdclass">
                    <v-text-field
                      v-model.number="product.returnedOther"
                      type="number"
                      min="0"
                      class="product_input"
                      density="compact"
                      hide-details
                      :readonly="readonly"
                      aria-label="Other returned quantity"
                    />
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="6" class="tdclass text-center py-6">
                    No products are available for this order.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div v-if="!readonly" class="text-center pt-8">
            <v-btn
              class="button"
              color="#4340DA"
              :disabled="products.length === 0"
              @click="save"
            >
              <span class="btn_text">{{ submitLabel }}</span>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <OrderSummaryConfirmDialog
        v-model="showGrnConfirmation"
        summary-type="grn"
        entity-label="Customer"
        :shop-summaries="grnSummaries"
        @confirm="confirmSave"
      />
    </div>
  </div>
</template>

<script>
import OrderSummaryConfirmDialog from "@/components/OrderSummaryConfirmDialog.vue";

export default {
  components: { OrderSummaryConfirmDialog },
  props: {
    title: { type: String, required: true },
    submitLabel: { type: String, default: "Save GRN" },
    readonly: { type: Boolean, default: false },
    orderReference: { type: String, default: "N/A" },
    customerName: { type: String, default: "N/A" },
    orderDate: { type: String, default: "N/A" },
    products: { type: Array, required: true },
  },
  data() {
    return { showGrnConfirmation: false };
  },
  computed: {
    grnSummaries() {
      return [
        {
          shopName: this.customerName,
          orderReference: this.orderReference,
          products: this.products,
        },
      ];
    },
  },
  emits: ["save"],
  methods: {
    save() {
      this.showGrnConfirmation = true;
    },
    confirmSave() {
      this.showGrnConfirmation = false;
      this.$emit("save");
    },
  },
};
</script>
