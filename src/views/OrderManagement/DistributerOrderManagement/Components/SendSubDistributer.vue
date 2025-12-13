<template>
  <div class="order_management">
    <div class="send_subdistributer pt-3">
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
      <v-form v-model="isFormValid">
        <v-card
          class="mt-10"
          style="background-color: #f8f8f8"
          v-for="(
            selectedsubdistributer, subdistributerindex
          ) in subdistributerorders"
          :key="selectedsubdistributer"
        >
          <v-card-text>
            <div>
              <!-- select sales rep -->
              <v-row>
                <v-col lg="4" cols="12">
                  <label class="label">Subdistributer *</label>
                  <div class="pt-2"></div>
                  <v-autocomplete
                    :rules="[required]"
                    placeholder="Select Subdistributer"
                    class="select_subdistributer"
                    v-model="selectedsubdistributer.subdis_id"
                    :items="subdistributers"
                    item-title="subdistributer_name"
                    item-value="id"
                    @update:model-value="
                      ExistsSubDistributer(
                        subdistributerindex,
                        selectedsubdistributer.subdis_id
                      )
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col lg="4" cols="12">
                  <label class="label">Order Date *</label>
                  <div class="pt-2"></div>
                  <AppDateTimePicker
                    :rules="[required]"
                    placeholder="Sub Distributer Order Date"
                    class="send_date"
                    v-model="selectedsubdistributer.order_date"
                  >
                  </AppDateTimePicker>
                </v-col>
                <v-col lg="4" cols="12"> </v-col>
              </v-row>

              <!-- order details -->
              <div class="pt-4"></div>
              <v-row
                class="pt-6"
                v-for="(
                  orderproduct, productindex
                ) in selectedsubdistributer.orderproducts"
                :key="orderproduct"
              >
                <!-- select product -->
                <v-col lg="3" cols="12">
                  <label class="label">Product *</label>
                  <div class="pt-2"></div>
                  <v-autocomplete
                    :rules="[required]"
                    placeholder="Select Product"
                    v-model="orderproduct.product"
                    class="select_product"
                    return-object
                    :items="products"
                    item-title="product_name"
                    item-value="product_id"
                    @update:model-value="
                      ExistsProduct(
                        subdistributerindex,
                        productindex,
                        orderproduct.product
                      )
                    "
                  >
                    <template v-slot:item="{ props, item }">
                      <div>
                        <v-list-item
                          v-bind="props"
                          :title="item.raw.product_name"
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
                    :rules="[required, interger]"
                    v-model="orderproduct.quantity"
                    class="product_input"
                    @update:model-value="
                      updateQuantity(
                        subdistributerindex,
                        productindex,
                        orderproduct.product,
                        orderproduct.quantity
                      )
                    "
                  >
                  </v-text-field>
                </v-col>

                <!-- Unit Price -->
                <v-col lg="3" cols="12">
                  <label class="label">Unit Price</label>
                  <div class="pt-2"></div>
                  <v-text-field
                    :rules="[required]"
                    placeholder="Unit Price"
                    v-model="orderproduct.unitprice"
                    class="product_input"
                  >
                  </v-text-field>
                </v-col>

                <!-- discount_value-->
                <v-col lg="3" cols="12">
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
                    @click="removeProduct(subdistributerindex, productindex)"
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
                    @click="repeatProduct(subdistributerindex)"
                    ><span class="text">Add Product</span></v-btn
                  >
                </v-col>
                <v-col>
                  <div class="text-right">
                    <v-btn
                      class="delete_subdistributer"
                      variant="none"
                      @click="removesubdistributer(subdistributerindex)"
                      ><span class="text">Delete subdistributer</span></v-btn
                    >
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>

        <!-- add button -->
        <div class="pt-6 text-right">
          <v-btn
            class="add_subdistributer"
            variant="none"
            @click="repeatsubdistributer()"
            ><span class="text">Add subdistributor</span></v-btn
          >
        </div>

        <div class="pt-16 text-center">
          <v-btn
            class="submit_button"
            variant="none"
            @click="submitOrder()"
            :disabled="!isFormValid"
            :loading="loading"
            ><span class="text">Submit</span></v-btn
          >
        </div>
      </v-form>
    </div>
  </div>
</template>
<script>
import SubDistributerApi from "@/Api/Modules/sub_distributer";
import { toast } from "@/ApiConstance/toast";
export default {
  data() {
    return {
      isFormValid: false,
      form: {},
      loading: false,
      subdistributers: [],
      products: [],
      subdistributerorders: [
        {
          distributer: "Select Subdistributor",
          orderproducts: [
            {
              product: "Select Product",
              quantity: "",
              unitsize: "",
              amount: "",
              discount_value: "",
            },
          ],
        },
      ],
    };
  },

  async created() {
    await this.getSubDistributers();
    await this.DelivereSubDistributerProducts();
  },

  methods: {
    // get SubDistributers
    async getSubDistributers() {
      const res = await SubDistributerApi.allSubDistributers();
      this.subdistributers = res.data.data;
    },

    // check weather the subdistributer is already added
    ExistsSubDistributer(index, currentid) {
      // get previously added product exactly same like this
      const result = this.subdistributerorders.filter((val) => {
        return val.subdis_id === currentid;
      });

      if (this.subdistributerorders[index - 1] && result.length > 1) {
        toast("Subdistributer Already Selected Before", "error", 20000);
        this.subdistributerorders[index].subdis_id = "";
      }
    },

    // get sent products from the distributer for the Sub distributer
    async DelivereSubDistributerProducts() {
      const payload = {
        distributer_order_id: this.$route.params.distributer_order_id,
      };

      const res = await SubDistributerApi.SendProductsForSubDistributers(
        payload
      );

      this.products = res.data.data;
    },

    // check quantity is available
    updateQuantity(subdistributerindex, productindex, product, entervalue) {
      let count = 0;

      // get full count of privious added produt quantities where this product equal
      this.subdistributerorders.forEach((val) => {
        val.orderproducts.forEach((val1) => {
          if (val1.product.product_id === product.product_id) {
            count = count + Number(val1.quantity);
          }
        });
      });

      if (count > product.uptodate_quantity) {
        // if full count of privious added produt exceded the product stock

        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.subdistributerorders[subdistributerindex].orderproducts[
          productindex
        ].quantity = "";
      }
      // if entered value dont exceded the product stock
      else {
        this.subdistributerorders[subdistributerindex].orderproducts[
          productindex
        ].unitprice = product.unit_price;

        this.subdistributerorders[subdistributerindex].orderproducts[
          productindex
        ].amount = product.unit_price * entervalue;
      }
    },

    // check weather the product is already ad by same distributer before
    ExistsProduct(subdistributerindex, productindex, sendproduct) {
      // get previouslyadded product exactly same like this
      const result = this.subdistributerorders[
        subdistributerindex
      ].orderproducts.filter((val) => {
        return val.product.product_id === sendproduct.product_id;
      });

      if (result.length > 1) {
        toast(
          "Product Already Selected Before By This Sub distributer",
          "error",
          20000
        );
        this.subdistributerorders[subdistributerindex].orderproducts[
          productindex
        ].product = "";
      }
    },

    // prcess discount value

    processDiscount(subdistributerindex, productindex, unitprice, discount) {
      // process discont value
      this.subdistributerorders[subdistributerindex].orderproducts[
        productindex
      ].discount_value = (unitprice * discount) / 100;
    },
    // repeat sub distributer

    repeatsubdistributer() {
      // repeat form
      this.subdistributerorders.push({
        distributer: "Select SubDistributer",
        orderproducts: [
          {
            product: "Select Product",
            quantity: "",
            unitsize: "",
            amount: "",
            discount_value: "",
          },
        ],
      });
    },

    // remove distributer

    // remove product
    removesubdistributer(index) {
      this.subdistributerorders.splice(index, 1);
    },

    // repeat product

    repeatProduct(index) {
      // repeat form
      this.subdistributerorders[index].orderproducts.push({
        product: "Select Product",
        quantity: "",
        unitsize: "",
        amount: "",
        discount_value: "",
      });
    },

    // remove product
    removeProduct(subdistributerindex, productindex) {
      this.subdistributerorders[subdistributerindex].orderproducts.splice(
        productindex,
        1
      );
    },

    // submit shop order

    async submitOrder() {
      this.loading = true;

      this.form.disorder_id = this.$route.params.distributer_order_id;
      this.form.distributer_id = this.$route.params.distributer_id;
      this.form.main_order_id = this.$route.params.main_order_id;
      this.form.subdistributers_orders = this.subdistributerorders;

      await SubDistributerApi.StoreSubDistributerOrder(this.form)
        .then(() => {
          this.loading = false;
          this.$router.push("/distributororder");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
