<template>
  <div class="return_management">
    <div class="create_form">
      <!-- basic details -->
      <v-form v-model="isFormValid">
        <v-row>
          <v-col lg="8" class="pt-5" cols="12">
            <h2 class="heading">Add Return For {{ shop.shop_name }}</h2>
          </v-col>
          <v-col lg="4" cols="12">
            <label class="label">Return Date *</label>
            <div class="pt-2"></div>
            <AppDateTimePicker
              :rules="[required]"
              placeholder="Return Date"
              class="create_date"
              v-model="form.return_date"
            >
            </AppDateTimePicker>
          </v-col>
        </v-row>
        <div class="pt-2"></div>
        <hr />
        <!-- order details -->
        <div class="pt-4"></div>

        <!-- product selection -->
        <div class="pt-4"></div>

        <v-row>
          <!-- select product to return; the order repeater below is scoped to this product -->
          <v-col lg="4" cols="12">
            <label class="label">Product *</label>
            <div class="pt-2"></div>
            <v-autocomplete
              :rules="[required]"
              placeholder="Select Product"
              class="select_order"
              v-model="selected_product"
              :item-title="(item) => item?.product_name ? `${makeUpperCase(item.product_name)} - ${makeUpperCase(item.model_number || 'N/A')}` : ''"
              item-value="product_id"
              :items="shopProducts"
              @update:model-value="onProductSelected()"
            ></v-autocomplete>
          </v-col>
          <v-col></v-col>
        </v-row>

        <div class="pt-7"></div>

        <!-- order repeater: each row returns the selected product against a different shop order -->
        <v-card class="product_card">
          <v-row v-for="(returnorder, index) in returnOrders" :key="returnorder">
            <!-- select shop order, narrowed down to only the orders that contain the selected product -->
            <v-col lg="3" cols="12">
              <label class="label">Shop Order *</label>
              <div class="pt-2"></div>
              <v-autocomplete
                :rules="[required]"
                placeholder="Select Order"
                v-model="returnorder.shop_order_id"
                item-title="order_reference_id"
                item-value="id"
                :items="shopOrders"
                :disabled="!selected_product"
                class="select_order"
                @update:model-value="onOrderSelected(index)"
              >
                <template v-slot:item="{ props, item }">
                  <div>
                    <v-list-item
                      v-bind="props"
                      :title="item.raw.order_reference_id"
                      :subtitle="
                        item.raw.discounted_price !== null &&
                        item.raw.discounted_price !== 0
                          ? getPrice(item.raw.discounted_price)
                          : getPrice(item.raw.unit_price)
                      "
                    >
                      <!-- product being returned on this order -->
                      <div
                        style="font-size: 13px"
                        v-if="selectedProductLabel"
                      >
                        Product: {{ selectedProductLabel }}
                      </div>

                      <span
                        style="font-size: 13px"
                        v-if="item.raw.returnable_quantity !== null"
                        >Returnable Qty: {{ item.raw.returnable_quantity }}</span
                      >
                    </v-list-item>
                  </div>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- quantity -->
            <v-col lg="2" cols="12">
              <label class="label">Quantity *</label>
              <div class="pt-2"></div>
              <v-text-field
                :rules="[required, integer]"
                placeholder="Quantity"
                v-model="returnorder.quantity"
                class="product_input"
                @update:model-value="updateQuantity(index, returnorder.quantity)"
              >
              </v-text-field>
            </v-col>

            <!-- amount -->
            <v-col lg="3" cols="12">
              <label class="label">Amount *</label>
              <div class="pt-2"></div>
              <v-text-field
                placeholder="Amount"
                v-model="returnorder.amount"
                readonly
                class="product_input"
              >
              </v-text-field>
            </v-col>

            <!-- reason -->
            <v-col lg="3" cols="12">
              <label class="label">Return Reason *</label>
              <div class="pt-2"></div>
              <v-autocomplete
                :rules="[required]"
                placeholder="Select Return Reason"
                v-model="returnorder.reason_type"
                :items="['Damage or Expire', 'Other']"
                class="select_order"
              ></v-autocomplete>
            </v-col>

            <!-- remove button -->
            <v-col lg="1" class="text-right" cols="12">
              <div class="pt-8"></div>
              <v-btn
                color="transparent"
                variant="none"
                @click="removeItem(index)"
              >
                <img
                  src="@/assets/images/material-symbols_delete.png"
                  style="width: 24px"
                />
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <!-- add order  button -->
        <div class="pt-5"></div>
        <div class="text-right">
          <v-btn
            class="add_product_button"
            variant="none"
            :disabled="!selected_product"
            @click="repeatOrder()"
            ><span class="text">Add Order</span></v-btn
          >
        </div>

        <div class="pt-12"></div>

        <!-- submit -->
        <div class="text-center">
          <v-btn
            class="submit_button"
            variant="none"
            @click="openSubmitSummary()"
            :loading="loading"
            :disabled="!isFormValid"
          >
            <span class="text">Submit</span>
          </v-btn>
        </div>
      </v-form>

      <!-- summary of the entered return product(s) and their shop order -->
      <!-- details, shown before the return is actually submitted -->
      <OrderSummaryConfirmDialog
        v-model="showSubmitSummary"
        :shop-summaries="submitSummaries"
        :show-discount-column="false"
        :loading="loading"
        @confirm="onSubmitConfirm"
      />
    </div>
  </div>
</template>
<script>
import ReturnApi from "@/Api/Modules/returns";
import { toast } from "@/ApiConstance/toast";
import OrderSummaryConfirmDialog from "@/components/OrderSummaryConfirmDialog.vue";
export default {
  components: {
    OrderSummaryConfirmDialog,
  },
  data() {
    return {
      isFormValid: false,
      form: {},
      shopProducts: [],
      selected_product: null,
      shopOrders: [],
      returnOrders: [
        {
          id: 1,
          shop_order_id: "",
          product_price: null,
          available_quantity: null,
          quantity: "",
          amount: "",
          reason_type: "",
        },
      ],
      nextTodoId: 1,
      loading: false,
      showSubmitSummary: false,
    };
  },
  props: {
    shop: Object,
  },
  computed: {
    // "name - model number" of the product currently selected above, shown
    // alongside the unit price in the shop order dropdown so each option is
    // self-descriptive
    selectedProductLabel() {
      const product = this.shopProducts.find(
        (val) => val.product_id === this.selected_product,
      );

      return product
        ? `${this.makeUpperCase(product.product_name)} - ${this.makeUpperCase(product.model_number || "N/A")}`
        : "";
    },

    // shop/product details shown in the pre-submit summary popup - a return
    // is always for a single shop, one entry per shop order row
    submitSummaries() {
      const product = this.shopProducts.find(
        (val) => val.product_id === this.selected_product,
      );

      return [
        {
          shopName: this.shop ? this.shop.shop_name : "",
          showCourierDetails: false,
          products: this.returnOrders
            .filter((returnorder) => returnorder.shop_order_id)
            .map((returnorder) => ({
              productCode: product ? this.makeUpperCase(product.product_code) : "",
              productName: product ? this.makeUpperCase(product.product_name) : "",
              quantity: returnorder.quantity,
              unitPrice: returnorder.product_price,
              amount: returnorder.amount,
            })),
        },
      ];
    },
  },
  async created() {
    await this.getShopProducts();
    this.form.return_code =
      "RETURN-SHOP-" + Math.floor(Math.random() * 100000000);
  },

  methods: {
    // open the pre-submit summary popup
    openSubmitSummary() {
      this.showSubmitSummary = true;
    },

    // proceed with the actual submission once the summary is confirmed
    onSubmitConfirm() {
      this.submitReturn();
    },

    // get every product that appears in one of this shop's orders, so a
    // return can be started from the product rather than the order
    async getShopProducts() {
      const payload = { shop_id: this.shop.id };

      const res = await ReturnApi.shopProductsForShop(payload);

      this.shopProducts = res.data.data;
    },

    // narrow the order dropdown down to the orders that contain the
    // selected product, and reset the order repeater back to a single row
    async onProductSelected() {
      this.shopOrders = [];
      this.returnOrders = [
        {
          id: 1,
          shop_order_id: "",
          product_price: null,
          available_quantity: null,
          quantity: "",
          amount: "",
          reason_type: "",
        },
      ];
      this.nextTodoId = 1;

      const payload = {
        shop_id: this.shop.id,
        product_id: this.selected_product,
      };

      const res = await ReturnApi.shopOrdersForProduct(payload);

      this.shopOrders = res.data.data;
    },

    // load the selected product's price and returnable quantity on this
    // specific order (already carried on shopOrders), and block picking the
    // same order on more than one row
    onOrderSelected(index) {
      const result = this.returnOrders.filter(
        (val) => val.shop_order_id === this.returnOrders[index].shop_order_id
      );

      if (result.length > 1) {
        toast("Order Already Selected Before", "error", 20000);
        this.returnOrders[index].shop_order_id = "";
        return;
      }

      const shoporder = this.shopOrders.find(
        (order) => order.id === this.returnOrders[index].shop_order_id
      );

      // if shop product has discount , get discounted price
      if (
        shoporder.discounted_price !== null &&
        shoporder.discounted_price !== 0
      ) {
        this.returnOrders[index].product_price = shoporder.discounted_price;
      }
      // if not get product unit price
      else if (
        shoporder.discounted_price == null ||
        shoporder.discounted_price == 0
      ) {
        this.returnOrders[index].product_price = shoporder.unit_price;
      }

      this.returnOrders[index].available_quantity = shoporder.returnable_quantity;
    },

    // check quantity is available on this row's order
    updateQuantity(index, entervalue) {
      const returnorder = this.returnOrders[index];

      if (Number(entervalue) > returnorder.available_quantity) {
        // if entered quantity exceded the product stock on this order

        toast(
          "Entered Quantity Exceeded The Shop Order Products",
          "error",
          20000
        );
        this.returnOrders[index].quantity = "";
      }
      // if entered value dont exceded the product stock
      else {
        this.returnOrders[index].amount =
          returnorder.product_price * entervalue;
      }
    },

    //   repeat order button
    repeatOrder() {
      // repeat form
      this.returnOrders.push({
        id: (this.nextTodoId += this.nextTodoId),
        shop_order_id: "",
        product_price: null,
        available_quantity: null,
        quantity: "",
        amount: "",
        reason_type: "",
      });
    },

    // remove order
    removeItem(index) {
      this.returnOrders.splice(index, 1);
    },

    // submit order
    async submitReturn() {
      this.loading = true;

      // regenerate on every attempt (not just once on mount) so a retry
      // after a failed submit - which happens after the return row is
      // already saved - never resends an already-used code and hits
      // "return code has already been taken"
      this.form.return_code =
        "RETURN-SHOP-" + Math.floor(Math.random() * 100000000);

      // every row returns the same selected product, just against a
      // different shop order
      this.form.return_products = this.returnOrders.map((returnorder) => ({
        shop_order_id: returnorder.shop_order_id,
        product: { product_id: this.selected_product },
        product_price: returnorder.product_price,
        quantity: returnorder.quantity,
        amount: returnorder.amount,
        reason_type: returnorder.reason_type,
      }));

      await ReturnApi.storeShopReturn(this.form)
        .then(() => {
          this.loading = false;
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
