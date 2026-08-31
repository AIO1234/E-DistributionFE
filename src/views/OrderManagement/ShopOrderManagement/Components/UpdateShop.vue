<template>
  <div class="order_management">
    <v-skeleton-loader
      :loading="pageLoad"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <div class="send_shops pt-3">
          <!-- back button -->
          <v-row>
            <v-col lg="4" cols="12">
              <v-btn
                class="back_button"
                variant="none"
                @click="$router.back()"
                elevation="6"
              >
                <v-icon icon="tabler-chevron-left" class="text"></v-icon>
                <span class="text pl-2">Back</span></v-btn
              >
            </v-col>
            <v-col lg="8" cols="12" class="pt-5">
              <h2 class="title">Update Shop Order</h2>
            </v-col>
          </v-row>

          <!-- form content -->
          <v-form v-model="isFormValid">
            <v-card class="mt-10" style="background-color: #f8f8f8">
              <v-card-text>
                <div>
                  <v-row>
                    <!-- shop - fixed at creation, cannot change on update -->
                    <v-col lg="4" cols="12">
                      <label class="label">Shop</label>
                      <div class="pt-2"></div>
                      <v-text-field
                        readonly
                        :model-value="shop ? shop.shop_name : ''"
                        class="product_input"
                      >
                      </v-text-field>
                    </v-col>

                    <!-- courier + carton unit price / quantity are fixed at
                    creation and not editable here - the original values are
                    still submitted unchanged so the courier charge is untouched -->

                    <!-- order date -->
                    <v-col lg="4" cols="12">
                      <label class="label">Order Date *</label>
                      <div class="pt-2"></div>
                      <AppDateTimePicker
                        :rules="[required]"
                        placeholder="shop Order Date"
                        class="send_date"
                        v-model="order.order_date"
                      >
                      </AppDateTimePicker>
                    </v-col>

                    <!-- Delivery Note No -->
                    <v-col lg="4" cols="12">
                      <label class="label">Delivery Note No *</label>
                      <div class="pt-2"></div>
                      <v-text-field
                        placeholder="Deliery Note No"
                        v-model="order.delivery_note_no"
                        class="product_input"
                        :rules="[required]"
                      >
                      </v-text-field>
                    </v-col>

                    <!-- Invoice Number -->
                    <v-col lg="4" cols="12">
                      <label class="label">Invoice Number *</label>
                      <div class="pt-2"></div>
                      <v-text-field
                        placeholder="Invoice Number"
                        v-model="order.invoice_no"
                        class="product_input"
                        :rules="[required]"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <!-- order details -->
                  <div class="pt-4"></div>
                  <v-row
                    class="pt-6"
                    v-for="(orderproduct, productindex) in order.orderproducts"
                    :key="orderproduct"
                  >
                    <!-- select product -->
                    <v-col lg="3" cols="12">
                      <label class="label">Product *</label>
                      <div class="pt-2"></div>
                      <v-autocomplete
                        placeholder="Select Product"
                        :rules="[required]"
                        v-model="orderproduct.product"
                        class="select_product"
                        return-object
                        :items="products"
                        item-title="product_name"
                        item-value="product_id"
                        @update:model-value="
                          ExistsProduct(productindex, orderproduct.product)
                        "
                      >
                        <template v-slot:item="{ props, item }">
                          <div>
                            <v-list-item
                              v-bind="props"
                              :title="`${makeUpperCase(item.raw.product_name)} - ${makeUpperCase(item.raw.model_number || 'N/A')}`"
                              :subtitle="getPrice(item.raw.unit_price)"
                            >
                              <span
                                style="font-size: 13px"
                                v-if="item.raw.uptodate_quantity !== null"
                                >Balance Stock:
                                {{ item.raw.uptodate_quantity }}</span
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
                        placeholder="Quantity"
                        v-model="orderproduct.quantity"
                        class="product_input"
                        :rules="[required, interger]"
                        @update:model-value="
                          updateQuantity(
                            productindex,
                            orderproduct.product,
                            orderproduct.quantity,
                          )
                        "
                      >
                      </v-text-field>
                    </v-col>

                    <!-- Unit Price -->
                    <v-col lg="3" cols="12">
                      <label class="label">Unit Price(Rs) *</label>
                      <div class="pt-2"></div>
                      <v-text-field
                        placeholder="Unit Price"
                        v-model="orderproduct.unitprice"
                        class="product_input"
                        @update:model-value="
                          changeUnitPrice(
                            orderproduct.product,
                            productindex,
                            orderproduct.unitprice,
                            orderproduct.quantity,
                          )
                        "
                      >
                      </v-text-field>
                      <span
                        v-if="sellingPriceRange(orderproduct.product)"
                        class="pt-1"
                        style="font-size: 12px; display: block"
                      >
                        Suggested Range:
                        {{ sellingPriceRange(orderproduct.product) }}
                      </span>
                    </v-col>

                    <!-- amount -->
                    <v-col lg="3" cols="12">
                      <label class="label">Amount</label>
                      <div class="pt-2"></div>
                      <v-text-field
                        placeholder="Amount"
                        :rules="[required]"
                        readonly
                        v-model="orderproduct.amount"
                        class="product_input"
                      >
                      </v-text-field>
                    </v-col>

                    <!-- Discount Value -->
                    <v-col lg="3" cols="12">
                      <label class="label">Discount Value(Rs)</label>
                      <div class="pt-2"></div>
                      <v-text-field
                        placeholder="Discount Value"
                        v-model="orderproduct.discount_value"
                        class="product_input"
                        @update:model-value="changeDiscount(productindex)"
                      >
                      </v-text-field>
                      <span class="pt-1" style="font-size: 12px; display: block">
                        Type discount per unit price
                      </span>
                    </v-col>

                    <!-- repeater button -->
                    <v-col lg="1" class="text-right" cols="12">
                      <div class="pt-7"></div>
                      <v-btn
                        color="transparent"
                        variant="none"
                        @click="removeProduct(productindex)"
                      >
                        <img src="@/assets/images/material-symbols_delete.png" />
                      </v-btn>
                    </v-col>
                  </v-row>

                  <!-- footer buttons -->
                  <v-row>
                    <v-col>
                      <v-btn
                        class="add_product_button"
                        variant="none"
                        @click="repeatProduct()"
                        ><span class="text">Add Product</span></v-btn
                      >
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>

            <div class="pt-16 text-center">
              <v-btn
                class="submit_button"
                variant="none"
                @click="updateOrder()"
                :loading="loading"
                :disabled="!isFormValid"
                ><span class="text">Submit</span></v-btn
              >
            </div>
          </v-form>
        </div>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>
<script>
import DistributerApi from "@/Api/Modules/distributer";
import SalesRepApi from "@/Api/Modules/salesrep";
import shopApi from "@/Api/Modules/shop";
import { toast } from "@/ApiConstance/toast";

export default {
  data() {
    return {
      isFormValid: false,
      authRole: "",
      loading: false,
      pageLoad: false,
      shop: null,
      hasCourier: false,
      courierName: "",
      products: [],
      order: {
        order_date: "",
        delivery_note_no: "",
        invoice_no: "",
        order_reference_id: "",
        cartons_unit_price: "",
        cartons_quantity: "",
        orderproducts: [],
      },
      // which of the 3 creation branches this order came from - fixed at
      // creation, only used here to pick the right "available products" feed
      reporder_id: null,
      disorder_id: null,
      main_order_id: null,
      // total quantity per product this order already holds, captured once
      // from the server before any edits - the backend restores all of this
      // back onto the parent stock/uptodate_quantity before reapplying on
      // submit, so it must be added back to the live stock ceiling used
      // while editing (see updateQuantity)
      originalReservedByProduct: {},
    };
  },

  async created() {
    await this.init();
  },

  methods: {
    async init() {
      this.getAuthUser();
      await this.initializeData();
    },

    // initialize data
    async initializeData() {
      this.pageLoad = true;

      const payload = { shop_order_id: this.$route.params.shop_order_id };
      const res = await shopApi.GetShopOrderForUpdate(payload);
      const orderData = res.data.data;

      this.shop = orderData.shop;
      this.reporder_id = orderData.reporder_id;
      this.disorder_id = orderData.disorder_id;
      this.main_order_id = orderData.main_order_id;

      this.hasCourier = orderData.courier_id !== null;
      this.courierName = orderData.courier ? orderData.courier.company_name : "";

      this.order.order_date = orderData.order_date;
      this.order.delivery_note_no = orderData.delivery_note_no;
      this.order.invoice_no = orderData.invoice_no;
      this.order.order_reference_id = orderData.order_reference_id;
      this.order.cartons_unit_price = orderData.cartons_unit_price;
      this.order.cartons_quantity = orderData.cartons_quantity;

      // get the branch-appropriate available products list before mapping
      // this order's own products, so quantity/stock validation has
      // something to compare against right away
      await this.getAvailableProducts();

      const items = [];

      orderData.distributer_salesrep_shop_order_items.forEach((val) => {
        const obj = this.products.find((value) => value.product_id === val.id);

        items.push({
          product: obj,
          quantity: val.pivot.quantity,
          unitprice: val.pivot.unit_price,
          discount_value: val.pivot.discount_value,
          amount: val.pivot.price,
        });
      });

      this.order.orderproducts = items;

      // accumulate this order's original per-product quantities for the
      // stock-ceiling restore below
      items.forEach((item) => {
        if (!item.product) return;
        const productId = item.product.product_id;
        this.originalReservedByProduct[productId] =
          (this.originalReservedByProduct[productId] || 0) +
          Number(item.quantity);
      });

      this.pageLoad = false;
    },

    // get sent products from whichever stage this order originated from
    async getAvailableProducts() {
      if (this.reporder_id) {
        const res = await shopApi.SendProductsForShops({
          salesrep_order_id: this.reporder_id,
        });
        this.products = res.data.data;
      } else if (this.disorder_id) {
        const res = await SalesRepApi.SendProductsForsalesreps({
          distributer_order_id: this.disorder_id,
        });
        this.products = res.data.data;
      } else {
        const res = await DistributerApi.SendProductsForDistributers({
          order_id: this.main_order_id,
        });
        this.products = res.data.data;
      }
    },

    // check quantity is available
    updateQuantity(productindex, product, entervalue) {
      let count = 0;

      // get full count of this order's product quantities where this product equal
      this.order.orderproducts.forEach((val) => {
        if (val.product.product_id === product.product_id) {
          count = count + Number(val.quantity);
        }
      });

      // the backend restores this order's original quantities back onto
      // stock before reapplying on submit, so add back what this order
      // originally held for this product before comparing
      const availableStock =
        product.uptodate_quantity +
        (this.originalReservedByProduct[product.product_id] || 0);

      if (count > availableStock) {
        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.order.orderproducts[productindex].quantity = "";
      } else {
        this.order.orderproducts[productindex].unitprice = product.unit_price;
        this.order.orderproducts[productindex].amount = this.calculateAmount(
          productindex,
          product.unit_price,
          entervalue,
        );
      }
    },

    // per-unit discount subtracted from the unit price before multiplying by
    // quantity, matching the backend's discounted_price calculation
    calculateAmount(productindex, unitprice, quantity) {
      const discountValue = Number(
        this.order.orderproducts[productindex].discount_value || 0,
      );

      return (Number(unitprice) - discountValue) * Number(quantity);
    },

    // recompute amount when the discount value itself changes, after unit
    // price and quantity are already set
    changeDiscount(productindex) {
      const orderproduct = this.order.orderproducts[productindex];

      if (orderproduct.unitprice && orderproduct.quantity) {
        orderproduct.amount = this.calculateAmount(
          productindex,
          orderproduct.unitprice,
          orderproduct.quantity,
        );
      }
    },

    // formatted "min - max" selling price range shown under the unit price field
    sellingPriceRange(product) {
      const rangeProduct = product && product.product;

      if (
        !rangeProduct ||
        rangeProduct.min_selling_price == null ||
        rangeProduct.max_selling_price == null
      ) {
        return "";
      }

      return `${this.getPrice(rangeProduct.min_selling_price)} - ${this.getPrice(rangeProduct.max_selling_price)}`;
    },

    // change unit price when changing
    changeUnitPrice(product, productindex, enteredunitprice, enteredquantity) {
      if (enteredunitprice >= product.product.min_selling_price) {
        this.order.orderproducts[productindex].amount = this.calculateAmount(
          productindex,
          enteredunitprice,
          enteredquantity,
        );
      } else {
        this.order.orderproducts[productindex].amount = "";
      }
    },

    // check weather the product is already added to this order before
    ExistsProduct(productindex, sendproduct) {
      const result = this.order.orderproducts.filter((val) => {
        return val.product.product_id === sendproduct.product_id;
      });

      if (this.order.orderproducts[productindex - 1] && result.length > 1) {
        toast("Product Already Selected Before In This Order", "error", 20000);
        this.order.orderproducts[productindex].product = "";
      }
    },

    // repeat product
    repeatProduct() {
      this.order.orderproducts.push({
        product: "",
        quantity: "",
        unitprice: "",
        discount_value: "",
        amount: "",
      });
    },

    // remove product
    removeProduct(productindex) {
      this.order.orderproducts.splice(productindex, 1);
    },

    // submit updated shop order
    async updateOrder() {
      this.loading = true;

      const payload = {
        shop_order_id: this.$route.params.shop_order_id,
        order_date: this.order.order_date,
        delivery_note_no: this.order.delivery_note_no,
        invoice_no: this.order.invoice_no,
        order_reference_id: this.order.order_reference_id,
        cartons_unit_price: this.order.cartons_unit_price,
        cartons_quantity: this.order.cartons_quantity,
        orderproducts: this.order.orderproducts,
      };

      await shopApi
        .UpdateShopOrder(payload)
        .then(() => {
          this.loading = false;
          this.$router.push({ name: "shoporder" });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
