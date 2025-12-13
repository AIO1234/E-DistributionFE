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
                >
                  <template v-slot:item="{ props, item }">
                    <div>
                      <v-list-item
                        v-bind="props"
                        :title="item.raw.product_name"
                        :subtitle="getPrice(item.raw.product_amount)"
                      >
                        <span
                          style="font-size: 13px"
                          v-if="item.raw.stock_count !== null"
                          >Stock : {{ item.raw.stock_count }}</span
                        >
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
                  readonly
                  class="product_input"
                >
                </v-text-field>
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
      products: [],
      orderproducts: [],
      nextTodoId: 1,
      form: {},
      loading: false,
      loadingPage: false,
    };
  },

  props: {
    order_id: Number,
  },
  async created() {
    await this.allProducts();
    await this.initializeData();
  },

  methods: {
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
    // get all products
    async allProducts() {
      this.loadingPage = true;
      // initialize payload
      const payload = {
        searchdata: "",
      };
      const res = await ProductApi.allProducts(payload);

      this.products = res.data.data;
      this.loadingPage = false;
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

      // check weather quantity exceed
      if (entervalue > product.stock_count) {
        // if entered value exceded the product stock
        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.orderproducts[index].quantity = "";
      } else {
        //  check aed unit price is 0
        if (this.orderproducts[index].unit_price !== 0) {
          this.orderproducts[index].amount =
            this.orderproducts[index].unit_price * entervalue;
        } else {
          this.orderproducts[index].unit_price = product.product_amount;

          this.orderproducts[index].amount =
            product.product_amount * entervalue;
        }
      }
    },

    // chcech weather products previousy added or not
    ExistsProduct(index, product) {
      // get previously added product exactly same like this
      const result = this.orderproducts.filter((val) => {
        return val.product.id === product.id;
      });

      if (result.length > 1) {
        toast("Product Already Selected Before", "error", 20000);
        this.orderproducts[index].product = "";
      }
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
