<template>
  <div class="order_management">
    <div class="create_form">
      <!-- basic details -->
      <v-row>
        <v-col lg="8" class="pt-5" cols="12">
          <h2>Create New Order</h2>
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
              class="create_date"
              :rules="[required]"
              v-model="form.date"
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
              :rules="[required]"
              v-model="orderproduct.product"
              class="select_product"
              return-object
              @update:model-value="ExistsProduct(index, orderproduct.product)"
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
              :rules="[required]"
              class="product_input"
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

        <div class="pt-5"></div>
        <!-- repeater button -->
        <div class="text-right">
          <v-btn
            class="add_product_button"
            variant="none"
            @click="repeatProduct()"
            ><span class="text">Add Product</span></v-btn
          >
        </div>
      </v-form>
      <div class="pt-12"></div>

      <div class="text-center">
        <v-btn
          class="submit_button"
          variant="none"
          @click="submitOrder()"
          :loading="loading"
          :disabled="!isFormValid"
        >
          <span class="text">Submit</span>
        </v-btn>
      </div>
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
      orderproducts: [
        {
          id: 1,
          product: "Select Product",
          quantity: "",
          unit_price: "",
          amount: "",
        },
      ],
      nextTodoId: 1,
      form: {},
      loading: false,
    };
  },

  async created() {
    await this.allProducts();
    // autogenarate ids
    this.form.order_reference_id =
      "ORD-" + Math.floor(Math.random() * 100000000);

    this.form.invoice_no = "INV-" + Math.floor(Math.random() * 100000000);
  },

  methods: {
    // get all products
    async allProducts() {
      // initialize payload
      const payload = {
        searchdata: "",
      };
      const res = await ProductApi.allProducts(payload);

      this.products = res.data.data;
    },

    // check quantity is available
    updateQuantity(index, entervalue, product) {
      if (entervalue > product.stock_count) {
        // if entered value exceded the product stock
        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.orderproducts[index].quantity = "";
      } else {
        this.orderproducts[index].unit_price = product.product_amount;
        this.orderproducts[index].amount =
          this.orderproducts[index].unit_price * entervalue;
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

    async submitOrder() {
      this.loading = true;
      this.form.order_products = this.orderproducts;
      console.log(this.form);
      await OrderApi.storeFactoryOrder(this.form)
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
