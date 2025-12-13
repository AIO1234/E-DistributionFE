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

        <!-- order selection -->
        <div class="pt-4"></div>

        <v-row>
          <v-col lg="4" cols="12">
            <label class="label">Shop Order *</label>
            <div class="pt-2"></div>
            <v-autocomplete
              :rules="[required]"
              placeholder="Select Order"
              class="select_order"
              v-model="form.shop_order_id"
              item-title="order_reference_id"
              item-value="id"
              :items="shopOrders"
              @update:model-value="getOrderPorducts()"
            ></v-autocomplete>
          </v-col>
          <v-col></v-col>
        </v-row>

        <div class="pt-7"></div>

        <v-card class="product_card">
          <v-row
            v-for="(returnproduct, index) in returnProducts"
            :key="returnproduct"
          >
            <!-- select product -->
            <v-col lg="3" cols="12">
              <label class="label">Product *</label>
              <div class="pt-2"></div>
              <v-autocomplete
                :rules="[required]"
                placeholder="Select Product"
                v-model="returnproduct.product"
                item-title="product_name"
                item-value="product_id"
                :items="availableOrderProducts"
                class="select_order"
                return-object
                @update:model-value="
                  ExistsProduct(index, returnproduct.product)
                "
              >
                <template v-slot:item="{ props, item }">
                  <div>
                    <v-list-item
                      v-bind="props"
                      :title="item.raw.product_name"
                      :subtitle="
                        item.raw.discounted_price !== null &&
                        item.raw.discounted_price !== 0
                          ? getPrice(item.raw.discounted_price)
                          : getPrice(item.raw.unit_price)
                      "
                    >
                      <span
                        style="font-size: 13px"
                        v-if="item.raw.quantity !== null"
                        >Quantity: {{ item.raw.quantity }}</span
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
                v-model="returnproduct.quantity"
                class="product_input"
                @update:model-value="
                  updateQuantity(
                    index,
                    returnproduct.product,
                    returnproduct.quantity
                  )
                "
              >
              </v-text-field>
            </v-col>

            <!-- amount -->
            <v-col lg="3" cols="12">
              <label class="label">Amount *</label>
              <div class="pt-2"></div>
              <v-text-field
                placeholder="Amount"
                v-model="returnproduct.amount"
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
                v-model="returnproduct.reason_type"
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
            @click="repeatProduct()"
            ><span class="text">Add Product</span></v-btn
          >
        </div>

        <div class="pt-12"></div>

        <!-- submit -->
        <div class="text-center">
          <v-btn
            class="submit_button"
            variant="none"
            @click="submitReturn()"
            :loading="loading"
            :disabled="!isFormValid"
          >
            <span class="text">Submit</span>
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>
<script>
import ReturnApi from "@/Api/Modules/returns";
import { toast } from "@/ApiConstance/toast";
import ShopApi from "@/Api/Modules/shop";
export default {
  data() {
    return {
      isFormValid: false,
      form: {},
      shopOrders: [],
      availableOrderProducts: [],
      returnProducts: [
        {
          id: 1,
          product: "Select Product",
          quantity: "",
          unitsize: "",
          amount: "",
          reason_type: "Select Return Reason",
        },
      ],
      nextTodoId: 1,
      loading: false,
    };
  },
  props: {
    shop: Object,
  },
  async created() {
    await this.getShopOrders();
    this.form.return_code =
      "RETURN-SHOP-" + Math.floor(Math.random() * 100000000);
  },

  methods: {
    // get shop orders for the shop
    async getShopOrders() {
      const payload = {
        shop_id: this.shop.id,
        searchdata: "",
        startdate: "",
        enddate: "",
      };

      const res = await ShopApi.allShopOrders(payload);

      this.shopOrders = res.data.data.shop_orders;
    },

    // get product for added to shop order only
    async getOrderPorducts() {
      const payload = {
        shop_order_id: this.form.shop_order_id,
      };

      const res = await ReturnApi.shopOrderProducts(payload);

      this.availableOrderProducts = res.data.data;
    },

    // check quantity is available
    updateQuantity(index, product, entervalue) {
      let count = 0;

      // get full count of privious added produt quantities where this product id equal
      this.returnProducts.forEach((val) => {
        if (val.product.product_id === product.product_id) {
          count = count + Number(val.quantity);
        }
      });

      if (count > product.quantity) {
        // if full count of privious added produt exceded the product stock

        toast(
          "Entered Quantity Exceeded The Shop Order Products",
          "error",
          20000
        );
        this.returnProducts[index].quantity = "";
      }
      // if entered value dont exceded the product stock
      else {
        this.returnProducts[index].amount =
          this.returnProducts[index].product_price * entervalue;
      }
    },

    // check weather the product is already add by same distributor before
    ExistsProduct(index, product) {
      // get previously added product exactly same like this
      const result = this.returnProducts.filter((val) => {
        return val.product.product_id === product.product_id;
      });

      if (result.length > 1) {
        toast("Product Already Selected Before", "error", 20000);
        this.returnProducts[index].product = "";
      } else {
        // if shop product has discount , get discounted price
        if (
          product.discounted_price !== null &&
          product.discounted_price !== 0
        ) {
          this.returnProducts[index].product_price = product.discounted_price;
        }
        // if not get product unit price
        else if (
          product.discounted_price == null ||
          product.discounted_price == 0
        ) {
          this.returnProducts[index].product_price = product.unit_price;
        }
      }
    },

    //   repeat order button
    repeatProduct() {
      // repeat form
      this.returnProducts.push({
        id: (this.nextTodoId += this.nextTodoId),
        product: "Select Product",
        quantity: "",
        unitsize: "",
        amount: "",
        reason_type: "",
      });
    },

    // remove order
    removeItem(index) {
      this.returnProducts.splice(index, 1);
    },

    // submit order
    async submitReturn() {
      this.loading = true;
      this.form.return_products = this.returnProducts;

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
