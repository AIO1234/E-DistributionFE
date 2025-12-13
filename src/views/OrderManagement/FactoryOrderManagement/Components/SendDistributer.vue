<template>
  <div class="order_management">
    <div class="send_distributer pt-3">
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
      <v-form v-model="isFormValid">
        <!-- form content -->
        <v-card
          class="mt-10"
          style="background-color: #f8f8f8"
          v-for="(selecteddistributer, distributerindex) in orderdistributers"
          :key="selecteddistributer"
        >
          <v-card-text>
            <div>
              <!-- select distributer -->
              <v-row>
                <v-col lg="4" cols="12">
                  <label class="label">Distributor *</label>
                  <div class="pt-2"></div>
                  <v-autocomplete
                    :rules="[required]"
                    placeholder="Select Distributor"
                    class="select_distributer"
                    v-model="selecteddistributer.distributer_id"
                    :items="distributers"
                    item-title="distributer_name"
                    item-value="id"
                    @update:model-value="
                      ExistsDistributer(
                        distributerindex,
                        selecteddistributer.distributer_id
                      )
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col lg="4" cols="12">
                  <label class="label">Order Date *</label>
                  <div class="pt-2"></div>
                  <AppDateTimePicker
                    :rules="[required]"
                    placeholder="Distributer Order Date"
                    class="send_date"
                    v-model="selecteddistributer.order_date"
                  >
                  </AppDateTimePicker>
                </v-col>
                <v-col lg="4" cols="12" class="text-right"> </v-col>
              </v-row>

              <!-- order details -->
              <div class="pt-4"></div>
              <v-row
                class="pt-6"
                v-for="(
                  orderproduct, productindex
                ) in selecteddistributer.orderproducts"
                :key="orderproduct"
              >
                <!-- select product -->
                <v-col lg="3" cols="12">
                  <label class="label">Product *</label>
                  <div class="pt-3"></div>
                  <v-autocomplete
                    placeholder="Select Product"
                    :rules="[required]"
                    v-model="orderproduct.product"
                    class="select_product"
                    :items="products"
                    item-title="product_name"
                    item-value="product_id"
                    return-object
                    @update:model-value="
                      ExistsProduct(
                        distributerindex,
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
                <v-col lg="3" cols="12">
                  <label class="label">Quantity *</label>
                  <div class="pt-3"></div>
                  <v-text-field
                    placeholder="Quantity"
                    v-model="orderproduct.quantity"
                    :rules="[required, interger]"
                    class="product_input"
                    @update:model-value="
                      updateQuantity(
                        distributerindex,
                        productindex,
                        orderproduct.product,
                        orderproduct.quantity
                      )
                    "
                  >
                  </v-text-field>
                </v-col>

                <!--unit price -->
                <v-col lg="2" cols="12">
                  <label class="label">Unit Price *</label>
                  <div class="pt-3"></div>
                  <v-text-field
                    placeholder="Unit Price"
                    :rules="[required]"
                    v-model="orderproduct.unitprice"
                    @update:model-value="
                      changeUnitPrice(
                        distributerindex,
                        productindex,
                        orderproduct.unitprice,
                        orderproduct.quantity
                      )
                    "
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
                    :rules="[required]"
                    readonly
                    v-model="orderproduct.amount"
                    class="product_input"
                  >
                  </v-text-field>
                </v-col>

                <!-- remove product button -->
                <v-col lg="1" class="text-right" cols="12">
                  <div class="pt-8"></div>
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="removeProduct(distributerindex, productindex)"
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
                    @click="repeatProduct(distributerindex)"
                    ><span class="text">Add Product</span></v-btn
                  >
                </v-col>
                <v-col>
                  <div class="text-right">
                    <v-btn
                      class="delete_disributer"
                      variant="none"
                      @click="removeDistribute(distributerindex)"
                      ><span class="text">Delete Distributer</span></v-btn
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
            class="add_disributer"
            variant="none"
            @click="repeatDistributer()"
            ><span class="text">Add Distributer</span></v-btn
          >
        </div>

        <div class="pt-16 text-center">
          <v-btn
            class="submit_button"
            variant="none"
            @click="submitOrder()"
            :loading="loading"
            :disabled="!isFormValid"
            ><span class="text">Submit</span></v-btn
          >
        </div>
      </v-form>
    </div>
  </div>
</template>
<script>
import DistributerApi from "@/Api/Modules/distributer";
import { toast } from "@/ApiConstance/toast";
export default {
  data() {
    return {
      isFormValid: false,
      form: {},
      loading: false,
      distributers: [],
      products: [],
      orderdistributers: [
        {
          distributer_id: "Select Distributer",
          orderproducts: [
            {
              product: "Select Product",
              quantity: "",
              unitprice: "",
              amount: "",
            },
          ],
        },
      ],
    };
  },

  async created() {
    await this.Distributers();
    await this.DeliveredistributerProducts();
  },

  methods: {
    // get distributers
    async Distributers() {
      const res = await DistributerApi.allDistributers();

      this.distributers = res.data.data;
    },

    // check weather the distributer is already added
    ExistsDistributer(index, currentid) {
      // get previouslyadded product exactly same like this
      const result = this.orderdistributers.filter((val) => {
        return val.distributer_id === currentid;
      });

      if (this.orderdistributers[index - 1] && result.length > 1) {
        toast("Distributer Already Selected Before", "error", 20000);
        this.orderdistributers[index].distributer_id = "";
      }
    },

    // get sent products fro the factory for the dustributer
    async DeliveredistributerProducts() {
      const payload = {
        order_id: this.$route.params.main_order_id,
      };

      const res = await DistributerApi.SendProductsForDistributers(payload);

      this.products = res.data.data;
    },

    // check quantity is available
    updateQuantity(distributerindex, productindex, product, entervalue) {
      let count = 0;

      // get full count of privious added produt quantities where this product equal
      this.orderdistributers.forEach((val) => {
        val.orderproducts.forEach((val1) => {
          if (val1.product.product_id === product.product_id) {
            count = count + Number(val1.quantity);
          }
        });
      });

      if (count > product.uptodate_quantity) {
        // if full count of privious added produt exceded the product stock

        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.orderdistributers[distributerindex].orderproducts[
          productindex
        ].quantity = "";
      }
      // if entered value dont exceded the product stock
      else {
        this.orderdistributers[distributerindex].orderproducts[
          productindex
        ].unitprice = product.unit_price;

        this.orderdistributers[distributerindex].orderproducts[
          productindex
        ].amount = product.unit_price * entervalue;
      }
    },

    //change unit price when changing
    changeUnitPrice(
      distributerindex,
      productindex,
      enteredunitprice,
      enteredquantity
    ) {
      this.orderdistributers[distributerindex].orderproducts[
        productindex
      ].amount = enteredunitprice * enteredquantity;
    },

    // check weather the product is already ad by same distributer before
    ExistsProduct(distributerindex, productindex, sendproduct) {
      // get previouslyadded product exactly same like this
      const result = this.orderdistributers[
        distributerindex
      ].orderproducts.filter((val) => {
        return val.product.product_id === sendproduct.product_id;
      });

      if (
        this.orderdistributers[distributerindex].orderproducts[
          productindex - 1
        ] &&
        result.length > 1
      ) {
        toast(
          "Product Already Selected Before By This Distributer",
          "error",
          20000
        );
        this.orderdistributers[distributerindex].orderproducts[
          productindex
        ].product = "";
      }
    },
    // repeat distributer
    repeatDistributer() {
      // repeat form
      this.orderdistributers.push({
        distributer_id: "Select Distributer",
        orderproducts: [
          {
            product: "Select Product",
            quantity: "",
            unitprice: "",
            amount: "",
          },
        ],
      });
    },

    // remove distributer

    // remove product
    removeDistribute(index) {
      this.orderdistributers.splice(index, 1);
    },

    // repeat product

    repeatProduct(index) {
      // repeat form
      this.orderdistributers[index].orderproducts.push({
        product: "Select Product",
        quantity: "",
        unitprice: "",
        amount: "",
      });
    },

    // remove product
    removeProduct(distributerindex, productindex) {
      this.orderdistributers[distributerindex].orderproducts.splice(
        productindex,
        1
      );
    },

    // submit distributer order

    async submitOrder() {
      this.loading = true;

      this.form.order_id = this.$route.params.main_order_id;
      this.form.distributer_orders = this.orderdistributers;

      console.log(this.form);
      await DistributerApi.storeDistributerOrder(this.form)
        .then(() => {
          this.loading = false;
          this.$router.push("/factoryorder");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
