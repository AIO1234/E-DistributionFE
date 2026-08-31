<template>
  <div class="order_management">
    <div class="update_form">
      <!-- basic details -->
      <v-skeleton-loader
        :loading="loadingPage"
        style="background-color: transparent"
        type="image, list-item-two-line"
      >
        <v-responsive>
          <v-row>
            <v-col lg="8" class="pt-5" cols="12">
              <h2>Update Order</h2>
            </v-col>
            <v-col lg="4" cols="12"> </v-col>
          </v-row>
          <v-form v-model="isFormValid">
            <v-row>
              <!-- date -->
              <v-col lg="4" class="pt-5" cols="12">
                <label class="label">Order Date*</label>
                <div class="pt-3"></div>
                <AppDateTimePicker
                  placeholder="Order Date"
                  class="update_date"
                  v-model="form.date"
                  :rules="[required]"
                  :config="{ minDate: minSelectableDate }"
                >
                </AppDateTimePicker>
              </v-col>
              <!-- reference id -->
              <v-col lg="4" class="pt-5" cols="12">
                <label class="label">Order Reference*</label>
                <div class="pt-3"></div>
                <v-text-field
                  placeholder="Order Reference Id"
                  v-model="form.order_reference_id"
                  readonly
                  class="product_input"
                >
                </v-text-field>
              </v-col>
              <!-- invoice -->
              <v-col lg="4" class="pt-5" cols="12">
                <label class="label">Invoice No*</label>
                <div class="pt-3"></div>
                <v-text-field
                  placeholder="Invoice No"
                  v-model="form.invoice_no"
                  readonly
                  class="product_input"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <div class="pt-2"></div>
            <hr />
            <!-- order details -->
            <div class="pt-7"></div>
            <h2>Products</h2>
            <div class="pt-7"></div>
            <v-row
              v-for="(orderproduct, index) in orderproducts"
              :key="orderproduct"
            >
              <!-- select product -->
              <v-col lg="3" cols="12">
                <label class="label">Product*</label>
                <div class="pt-3"></div>
                <v-autocomplete
                  :items="products"
                  :loading="productsLoading"
                  no-filter
                  item-title="product_name"
                  item-value="id"
                  placeholder="Select Product"
                  v-model="orderproduct.product"
                  class="select_product"
                  :rules="[required]"
                  return-object
                  @update:model-value="
                    ExistsProduct(index, orderproduct.product)
                  "
                  @update:search="onProductSearch"
                >
                  <template v-slot:item="{ props, item }">
                    <div>
                      <v-list-item
                        v-bind="props"
                        :title="`${item.raw.product_name} - ${item.raw.model_number || 'N/A'}`"
                      >
                        <!-- stock -->
                        <div
                          style="font-size: 13px"
                          v-if="item.raw.stock_count !== null"
                        >
                          Balance Stock: {{ item.raw.stock_count }}
                        </div>

                        <!-- min_selling_price -->
                        <div
                          class="pt-1"
                          style="font-size: 13px"
                          v-if="item.raw.min_selling_price !== null"
                        >
                          Min Selling Price {{ item.raw.min_selling_price }}
                        </div>

                        <!-- max selling price -->
                        <div
                          class="pt-1"
                          style="font-size: 13px"
                          v-if="item.raw.min_selling_price !== null"
                        >
                          Max Selling Price {{ item.raw.max_selling_price }}
                        </div>
                      </v-list-item>
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- quantity -->
              <v-col lg="2" cols="12">
                <label class="label">Quantity*</label>
                <div class="pt-3"></div>
                <v-text-field
                  placeholder="Quantity"
                  v-model="orderproduct.quantity"
                  class="product_input"
                  :rules="[required]"
                  @update:model-value="
                    updateQuantity(
                      index,
                      orderproduct.quantity,
                      orderproduct.product
                    )
                  "
                >
                </v-text-field>
              </v-col>

              <!-- unit price -->
              <v-col lg="3" cols="12">
                <label class="label">Unit Price</label>
                <div class="pt-3"></div>
                <v-text-field
                  placeholder="Amount"
                  v-model="orderproduct.unit_price"
                  class="product_input"
                  :rules="[required]"
                  @update:model-value="
                    changeUnitPrice(
                      index,
                      orderproduct.product,
                      orderproduct.unit_price,
                      orderproduct.quantity
                    )
                  "
                >
                </v-text-field>
                <span
                  v-if="sellingPriceRange(orderproduct.product)"
                  class="pt-1"
                  style="font-size: 12px; display: block"
                >
                  Suggested Range: {{ sellingPriceRange(orderproduct.product) }}
                </span>
              </v-col>

              <!-- amount -->
              <v-col lg="3" cols="12">
                <label class="label">Amount</label>
                <div class="pt-3"></div>
                <v-text-field
                  placeholder="Amount"
                  v-model="orderproduct.amount"
                  readonly
                  class="product_input"
                >
                </v-text-field>
              </v-col>

              <!-- repeater button -->
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

            <div class="pt-5"></div>
            <div class="text-right">
              <v-btn
                class="add_product_button"
                variant="none"
                @click="repeatProduct()"
                ><span class="text">Add Product</span></v-btn
              >
            </div>

            <div class="pt-12"></div>

            <div class="text-center">
              <v-btn
                class="submit_button"
                variant="none"
                @click="updateOrder()"
                :loading="loading"
                :disabled="!isFormValid"
              >
                <span class="text">Submit</span>
              </v-btn>
            </div>
          </v-form>
        </v-responsive>
      </v-skeleton-loader>
    </div>
  </div>
</template>
<script>
import ProductApi from "@/Api/Modules/products";
import OrderApi from "@/Api/Modules/master_order";
import { toast } from "@/ApiConstance/toast";
export default {
  data() {
    return {
      isFormValid: false,
      authRole: "",
      products: [],
      orderproducts: [],
      nextTodoId: 1,
      form: {},
      loading: false,
      loadingPage: false,
      productsLoading: false,
    };
  },

  props: {
    order_id: Number,
  },

  async created() {
    await this.init();
  },

  methods: {
    async init() {
      this.getAuthUser();

      this.debouncedProductSearch = this.debounce(
        (searchdata) => this.allProducts(searchdata),
        400,
      );

      await this.allProducts();
      await this.initializeData();
    },

    // initialiedata form the edit order

    async initializeData() {
      this.loadingPage = true;
      const payload = {
        order_id: this.order_id,
      };
      const res = await OrderApi.EditFactoryOrder(payload);
      this.form = res.data.data;

      // push exist order data to exist array
      this.orderproducts = this.form.order_products.map((val) => ({
        product: val,
        quantity: val.pivot.quantity,
        unit_price: val.pivot.unit_price,
        amount: val.pivot.price,
      }));

      this.loadingPage = false;
    },
    // get products matching the search text, capped so the whole 500+
    // catalog is never loaded up front - typing narrows the results
    // server-side instead
    async allProducts(searchdata = "") {
      this.productsLoading = true;

      const payload = {
        searchdata,
        page: 1,
        per_page: 40,
      };
      const res = await ProductApi.allProducts(payload);

      this.products = res.data.data.data;
      this.productsLoading = false;
    },

    // debounced so we don't fire a request on every keystroke. Vuetify
    // echoes a row's already-selected product name back through this event
    // when that row's dropdown is simply reopened (not a real search the
    // user typed) - treat that as no search, otherwise it silently
    // narrows the list down to just the one product already selected
    onProductSearch(searchdata) {
      const isEchoOfSelection = this.orderproducts.some((orderproduct) => {
        return (
          orderproduct.product &&
          searchdata === orderproduct.product.product_name
        );
      });

      this.debouncedProductSearch(isEchoOfSelection ? "" : searchdata);
    },

    // check quantity is available
    updateQuantity(index, entervalue, product) {
      // check weather extra product added or not
      if (this.form.order_products.length <= this.orderproducts.length) {
        // if not extra product added but change the product from same index
        if (
          this.form.order_products.length === this.orderproducts.length &&
          this.form.order_products[index].id !==
            this.orderproducts[index].product.id
        ) {
          this.orderproducts[index].unit_price = 0;
        }

        // if  extra product added and going to change the extra added product
        else if (
          this.form.order_products.length !== this.orderproducts.length &&
          index >= this.form.order_products.length
        ) {
          this.orderproducts[index].unit_price = 0;
        }
        // if  extra product added and going to change exist product
        else if (
          this.form.order_products.length !== this.orderproducts.length &&
          index <= this.form.order_products.length &&
          this.form.order_products[index].id !==
            this.orderproducts[index].product.id
        ) {
          this.orderproducts[index].unit_price = 0;
        }
        // if  extra product added and going to change exist product again
        else if (
          this.form.order_products.length !== this.orderproducts.length &&
          index <= this.form.order_products.length &&
          this.form.order_products[index].id ===
            this.orderproducts[index].product.id
        ) {
          this.orderproducts[index].unit_price =
            this.form.order_products[index].pivot.unit_price;
        }
      }

      // the backend restores every product this pending order already
      // holds back onto stock_count before reapplying the new quantities
      // on submit - account for that restore here too, otherwise
      // re-entering (or increasing up to) the order's own already-reserved
      // quantity is wrongly rejected as exceeding stock
      const alreadyReservedByThisOrder = this.form.order_products
        .filter((original) => original.id === product.id)
        .reduce((total, original) => total + original.pivot.quantity, 0);

      // check weather quantity exceed
      if (entervalue > product.stock_count + alreadyReservedByThisOrder) {
        // if entered value exceded the product stock
        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.orderproducts[index].quantity = "";
      } else {
        //  check aed unit price is 0
        if (this.orderproducts[index].unit_price !== 0) {
          this.orderproducts[index].amount =
            this.orderproducts[index].unit_price * entervalue;
        } else {
          // no unit price yet (product just changed at this row) - leave it
          // for the user to enter via the Unit Price field; product_amount
          // is never populated on any product, so reading it here used to
          // silently save a 0 unit price
          this.orderproducts[index].amount = "";
        }
      }
    },

    // formatted "min - max" selling price range shown under the unit price
    // field, sourced from the same product changeUnitPrice validates against
    // (same pattern as CreateOrder's sellingPriceRange)
    sellingPriceRange(product) {
      if (
        !product ||
        product.min_selling_price == null ||
        product.max_selling_price == null
      ) {
        return "";
      }

      return `${this.getPrice(product.min_selling_price)} - ${this.getPrice(product.max_selling_price)}`;
    },

    //change unit price when changing
    changeUnitPrice(index, product, enteredunitprice, enteredquantity) {
      // if unit price in suggested range
      if (enteredunitprice >= product.min_selling_price) {
        this.orderproducts[index].amount = enteredunitprice * enteredquantity;
      }

      // if unit price not in suggested range
      else {
        this.orderproducts[index].amount = "";
      }
    },

    // chcech weather products previousy added or not
    async ExistsProduct(index, product) {
      // get previously added product exactly same like this
      const result = this.orderproducts.filter((val) => {
        return val.product.id === product.id;
      });

      if (result.length > 1) {
        toast("Product Already Selected Before", "error", 20000);
        this.orderproducts[index].product = "";
      }

      // refresh the dropdown back to the default (unsearched) batch, so
      // reopening any row right after picking a product doesn't leave it
      // stuck showing only the narrow search results that product matched
      await this.allProducts();
    },

    // repeat product button

    repeatProduct() {
      // repeat form
      this.orderproducts.push({
        id: (this.nextTodoId += this.nextTodoId),
        product: "Select Product",
        quantity: "",
        unit_price: "",
        amount: "",
      });
    },

    // remove product
    removeItem(index) {
      this.orderproducts.splice(index, 1);
    },

    // submit order

    async updateOrder() {
      this.loading = true;
      this.form.order_products = this.orderproducts;

      await OrderApi.UpdateFactoryOrder(this.form)
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
