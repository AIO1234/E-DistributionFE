<template>
  <div class="order_management">
    <div class="send_shops pt-3">
      <!-- back button -->
      <v-btn
        class="back_button"
        variant="none"
        @click="$router.back()"
        elevation="6"
      >
        <v-icon icon="tabler-chevron-left" class="text"></v-icon>
        <span class="text pl-2">Back</span></v-btn
      >
      <!-- form content -->

      <v-card
        class="mt-10"
        style="background-color: #f8f8f8"
        v-for="(selectedshop, shopindex) in shoporders"
        :key="selectedshop"
      >
        <v-card-text>
          <div>
            <!-- select sales rep -->
            <v-row>
              <v-col lg="4" cols="12">
                <v-autocomplete
                  placeholder="Select shop"
                  :rules="[required]"
                  class="select_shop"
                  v-model="selectedshop.shop_id"
                  :items="shops"
                  item-title="shop_name"
                  item-value="id"
                  @update:model-value="
                    Existsshop(shopindex, selectedshop.shop_id)
                  "
                ></v-autocomplete>
              </v-col>
              <v-col lg="4" cols="12">
                <AppDateTimePicker
                  :rules="[required]"
                  placeholder="shop Order Date"
                  class="send_date"
                  v-model="selectedshop.order_date"
                >
                </AppDateTimePicker>
              </v-col>
              <!-- Delivery Note No -->
              <v-col lg="4" cols="12">
                <v-text-field
                  placeholder="Deliery Note No"
                  v-model="selectedshop.delivery_note_no"
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
              v-for="(orderproduct, productindex) in selectedshop.orderproducts"
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
                    ExistsProduct(shopindex, productindex, orderproduct.product)
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
                          v-if="item.raw.uptodate_quantity !== null"
                          >Balance Stock: {{ item.raw.uptodate_quantity }}</span
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
                      shopindex,
                      productindex,
                      orderproduct.product,
                      orderproduct.quantity
                    )
                  "
                >
                </v-text-field>
              </v-col>

              <!-- Unit Price -->
              <v-col lg="2" cols="12">
                <label class="label">Unit Price(Rs)</label>
                <div class="pt-2"></div>
                <v-text-field
                  placeholder="Unit Price"
                  readonly
                  v-model="orderproduct.unitprice"
                  class="product_input"
                >
                </v-text-field>
              </v-col>

              <!-- discount value -->
              <v-col lg="2" cols="12">
                <label class="label">Discount Value(Rs)</label>
                <div class="pt-2"></div>
                <v-text-field
                  placeholder="Discount Value"
                  v-model="orderproduct.discount_value"
                  class="product_input"
                >
                </v-text-field>
              </v-col>

              <!-- repeater button -->
              <v-col lg="1" class="text-right" cols="12">
                <div class="pt-7"></div>
                <v-btn
                  color="transparent"
                  variant="none"
                  @click="removeProduct(shopindex, productindex)"
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
                  @click="repeatProduct(shopindex)"
                  ><span class="text">Add Product</span></v-btn
                >
              </v-col>
              <v-col>
                <div class="text-right">
                  <v-btn
                    class="delete_shop"
                    variant="none"
                    @click="removeshop(shopindex)"
                    ><span class="text">Delete shop</span></v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- add button -->
      <div class="pt-6 text-right">
        <v-btn class="add_shop" variant="none" @click="repeatshop()"
          ><span class="text">Add shop</span></v-btn
        >
      </div>

      <div class="pt-16 text-center">
        <v-btn
          class="submit_button"
          variant="none"
          @click="submitOrder()"
          :loading="loading"
          ><span class="text">Submit</span></v-btn
        >
      </div>
    </div>
  </div>
</template>
<script>
import shopApi from "@/Api/Modules/shop";
import { toast } from "@/ApiConstance/toast";
export default {
  data() {
    return {
      form: {},
      loading: false,
      shops: [],
      products: [],
      shoporders: [
        {
          shop_id: "Select shop",
          delivery_note_no: "",
          orderproducts: [
            {
              product: "Select Product",
              quantity: "",
              unitprice: "",
              discount: "",
              discount_value: "",
              amount: "",
            },
          ],
        },
      ],
    };
  },

  async created() {
    await this.AllShops();
    await this.DeliveredShopProducts();
  },

  methods: {
    // get shops
    async AllShops() {
      const res = await shopApi.allShops();
      this.shops = res.data.data;
    },

    // check weather the shop is already added
    Existsshop(index, currentid) {
      // get previously added product exactly same like this
      const result = this.shoporders.filter((val) => {
        return val.shop_id === currentid;
      });

      if (this.shoporders[index - 1] && result.length > 1) {
        toast("Shop Already Selected Before", "error", 20000);
        this.shoporders[index].shop_id = "";
      } else {
        // autogenarate ids
        this.shoporders[index].delivery_note_no =
          "DELIVERY-" + Math.floor(Math.random() * 100000000);
      }
    },

    // get sent products from the factory for the shop
    async DeliveredShopProducts() {
      const payload = {
        salesrep_order_id: this.$route.params.reporder_id,
      };

      const res = await shopApi.SendProductsForShops(payload);

      this.products = res.data.data;
    },

    // check quantity is available
    updateQuantity(shopindex, productindex, product, entervalue) {
      let count = 0;

      // get full count of privious added produt quantities where this product equal
      this.shoporders.forEach((val) => {
        val.orderproducts.forEach((val1) => {
          if (val1.product.product_id === product.product_id) {
            count = count + Number(val1.quantity);
          }
        });
      });

      if (count > product.uptodate_quantity) {
        // if full count of privious added produt exceded the product stock

        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.shoporders[shopindex].orderproducts[productindex].quantity = "";
      }
      // if entered value dont exceded the product stock
      else {
        this.shoporders[shopindex].orderproducts[productindex].unitprice =
          product.unit_price;
      }
    },

    // check weather the product is already ad by same shop before
    ExistsProduct(shopindex, productindex, sendproduct) {
      // get previously added product exactly same like this
      const result = this.shoporders[shopindex].orderproducts.filter((val) => {
        return val.product.product_id === sendproduct.product_id;
      });

      if (
        this.shoporders[shopindex].orderproducts[productindex - 1] &&
        result.length > 1
      ) {
        toast("Product Already Selected Before By This Shop", "error", 20000);
        this.shoporders[shopindex].orderproducts[productindex].product = "";
      }
    },

    // repeat distributor
    repeatshop() {
      // repeat form
      this.shoporders.push({
        shop_id: "Select shop",
        delivery_note_no: "",
        orderproducts: [
          {
            product: "Select Product",
            quantity: "",
            unitprice: "",
            discount: "",
            discount_value: "",
            amount: "",
          },
        ],
      });
    },

    // remove distributor

    // remove product
    removeshop(index) {
      this.shoporders.splice(index, 1);
    },

    // repeat product

    repeatProduct(index) {
      // repeat form
      this.shoporders[index].orderproducts.push({
        product: "Select Product",
        quantity: "",
        unitprice: "",
        discount: "",
        discount_value: "",
        amount: "",
      });
    },

    // remove product
    removeProduct(shopindex, productindex) {
      this.shoporders[shopindex].orderproducts.splice(productindex, 1);
    },

    // submit shop order

    async submitOrder() {
      this.loading = true;

      this.form.disorder_id = this.$route.params.distributer_order_id;
      this.form.distributer_id = this.$route.params.distributer_id;
      this.form.main_order_id = this.$route.params.main_order_id;
      this.form.sales_rep_id = this.$route.params.sales_rep_id;
      this.form.reporder_id = this.$route.params.reporder_id;
      this.form.shop_orders = this.shoporders;

      await shopApi
        .storeShopOrder(this.form)
        .then(() => {
          this.loading = false;
          this.$router.push("/salesreporder");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
