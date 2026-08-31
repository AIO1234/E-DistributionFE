<template>
  <v-dialog v-model="dialogModel" max-width="700" persistent scrollable>
    <v-card class="order_summary_confirm_dialog">
      <v-card-text class="pa-8">
        <!-- title -->
        <h3 class="dialog_title text-center">Confirm Order Details</h3>

        <div class="pt-4"></div>
        <div class="hrclass"></div>
        <div class="pt-6"></div>

        <!-- one block per shop order: shop, courier (when required) and its -->
        <!-- own product lines -->
        <div
          class="shop_summary_block"
          v-for="(shop, shopIndex) in shopSummaries"
          :key="shopIndex"
        >
          <!-- shop / showroom / distributer etc, labelled via entityLabel -->
          <div class="summary_row">
            <span class="summary_label">{{ entityLabel }}</span>
            <span class="summary_value">{{ shop.shopName || "N/A" }}</span>
          </div>

          <!-- courier details: only rendered for courier-based shop orders -->
          <template v-if="shop.showCourierDetails">
            <div class="summary_row">
              <span class="summary_label">Courier</span>
              <span class="summary_value">{{
                shop.courierName || "N/A"
              }}</span>
            </div>
            <div class="summary_row">
              <span class="summary_label">Carton Unit Price</span>
              <span class="summary_value">{{
                shop.cartonUnitPrice || "N/A"
              }}</span>
            </div>
            <div class="summary_row">
              <span class="summary_label">Carton Quantity</span>
              <span class="summary_value">{{
                shop.cartonQuantity || "N/A"
              }}</span>
            </div>
          </template>

          <!-- product details table -->
          <div class="pt-3" v-if="shop.products && shop.products.length"></div>
          <table
            class="products_table"
            v-if="shop.products && shop.products.length"
          >
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th v-if="showDiscountColumn">Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(product, productIndex) in shop.products"
                :key="productIndex"
              >
                <td>{{ product.productCode || "N/A" }}</td>
                <td>{{ product.productName || "N/A" }}</td>
                <td>{{ product.quantity || "N/A" }}</td>
                <td>{{ product.unitPrice || "N/A" }}</td>
                <td v-if="showDiscountColumn">
                  {{ product.discountValue || "N/A" }}
                </td>
                <td>{{ product.amount || "N/A" }}</td>
              </tr>
            </tbody>
          </table>

          <!-- divider between shop blocks (skipped after the last one) -->
          <template
            v-if="shopIndex !== shopSummaries.length - 1"
          >
            <div class="pt-4"></div>
            <div class="hrclass"></div>
            <div class="pt-4"></div>
          </template>
        </div>

        <!-- per-courier totals: shown once above the confirm message when the -->
        <!-- order is being sent by courier and one or more couriers are used -->
        <template v-if="courierSummaries && courierSummaries.length">
          <div class="pt-4"></div>
          <div class="hrclass"></div>
          <div class="pt-6"></div>
          <h4 class="courier_summary_title">Courier Summary</h4>
          <div class="pt-3"></div>
          <table class="courier_summary_table">
            <thead>
              <tr>
                <th>Courier</th>
                <th>Full Cartons</th>
                <th>Full Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(courier, courierIndex) in courierSummaries"
                :key="courierIndex"
              >
                <td>{{ courier.courierName || "N/A" }}</td>
                <td>{{ courier.totalCartons || "N/A" }}</td>
                <td>{{ courier.totalAmount || "N/A" }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- confirm question -->
        <div class="pt-6"></div>
        <p class="confirm_question text-center">
          Do you want to submit this order?
        </p>

        <!-- back / yes buttons -->
        <div class="pt-4"></div>
        <v-row>
          <v-col cols="6">
            <v-btn
              class="no_button"
              variant="none"
              block
              :disabled="loading"
              @click="onCancel"
            >
              <span class="text">Back</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              class="yes_button"
              variant="none"
              block
              :loading="loading"
              :disabled="loading"
              @click="onConfirm"
            >
              <span class="text">Yes</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// Common confirmation popup shown when the "Submit" button is clicked while
// creating a shop/showroom/distributer order. Summarizes the entered entity,
// courier details (when the order requires them) and the product lines, and
// lets the user either move forward with the submission (Yes) or go back and
// edit (Back). Reused across the different "send" forms (SendShop,
// SendDistributer, etc) by customizing entityLabel and shopSummaries.
export default {
  name: "OrderSummaryConfirmDialog",

  props: {
    // dialog visibility, bound with v-model from the parent
    modelValue: {
      type: Boolean,
      default: false,
    },
    // label used for the entity row in each summary block, e.g. "Shop" or
    // "ShowRoom", so the same popup can be reused by different "send" forms
    entityLabel: {
      type: String,
      default: "Shop",
    },
    // one entry per shop/showroom order: { shopName, showCourierDetails,
    // courierName, cartonUnitPrice, cartonQuantity, products: [{ productCode,
    // productName, quantity, unitPrice, discountValue, amount }] }
    shopSummaries: {
      type: Array,
      default: () => [],
    },
    // whether the product table's Discount column is shown; forms without a
    // discount field (e.g. SendDistributer) pass false to hide it
    showDiscountColumn: {
      type: Boolean,
      default: true,
    },
    // one entry per courier used across the shop orders: { courierName,
    // totalCartons, totalAmount }
    courierSummaries: {
      type: Array,
      default: () => [],
    },
    // whether the parent's submission is in flight; keeps the "Yes" button
    // spinning and both buttons disabled so the submit can't be triggered
    // twice, and the dialog stays open until the parent closes it
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue", "confirm", "cancel"],

  computed: {
    // v-model passthrough so the parent controls the dialog's visibility
    dialogModel: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },

  methods: {
    // user clicked "Yes": let the parent proceed with the submission. The
    // dialog is left open (with the Yes button spinning via the `loading`
    // prop) so a slow request can't be triggered twice - the parent closes
    // it once the submission finishes (success navigates away; failure
    // just drops `loading` back to false so "Yes" can be retried)
    onConfirm() {
      this.$emit("confirm");
    },
    // user clicked "Back": close the popup and keep the form as is
    onCancel() {
      this.$emit("cancel");
      this.dialogModel = false;
    },
  },
};
</script>
