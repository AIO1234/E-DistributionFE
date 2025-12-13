<template>
  <div class="order_management">
    <v-skeleton-loader
      :loading="pageLoad"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <div class="send_salesrep pt-3">
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
              <h2 class="title">Update SalesRep Orders</h2>
            </v-col>
          </v-row>
          <!-- form content -->
          <v-form v-model="isFormValid">
            <v-card
              class="mt-10"
              style="background-color: #f8f8f8"
              v-for="(selectedsalesrep, salesrepindex) in salesreporders"
              :key="selectedsalesrep"
            >
              <v-card-text>
                <div>
                  <!-- select sales rep -->
                  <v-row>
                    <v-col lg="4" cols="12">
                      <v-autocomplete
                        :rules="[required]"
                        placeholder="Select SalesRep"
                        class="select_salesrep"
                        v-model="selectedsalesrep.salesrep_id"
                        :items="salesreps"
                        item-title="rep_name"
                        item-value="id"
                        @update:model-value="
                          ExistsSalesRep(
                            salesrepindex,
                            selectedsalesrep.salesrep_id
                          )
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col lg="4" cols="12">
                      <AppDateTimePicker
                        :rules="[required]"
                        placeholder="SalesRep Order Date"
                        class="send_date"
                        v-model="selectedsalesrep.order_date"
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
                    ) in selectedsalesrep.orderproducts"
                    :key="orderproduct"
                  >
                    <!-- select product -->
                    <v-col lg="3" cols="12">
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
                            salesrepindex,
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
                      <v-text-field
                        :rules="[required, interger]"
                        placeholder="Quantity"
                        v-model="orderproduct.quantity"
                        class="product_input"
                        @update:model-value="
                          updateQuantity(
                            salesrepindex,
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
                      <v-text-field
                        :rules="[required]"
                        placeholder="Unit Price"
                        readonly
                        v-model="orderproduct.unitprice"
                        class="product_input"
                      >
                      </v-text-field>
                    </v-col>

                    <!-- amount -->
                    <v-col lg="3" cols="12">
                      <v-text-field
                        :rules="[required]"
                        placeholder="Amount"
                        readonly
                        v-model="orderproduct.amount"
                        class="product_input"
                      >
                      </v-text-field>
                    </v-col>

                    <!-- repeater button -->
                    <v-col lg="1" class="text-right" cols="12">
                      <v-btn
                        color="transparent"
                        variant="none"
                        @click="removeProduct(salesrepindex, productindex)"
                      >
                        <img
                          src="@/assets/images/material-symbols_delete.png"
                        />
                      </v-btn>
                    </v-col>
                  </v-row>

                  <!-- footer buttons -->
                  <v-row>
                    <v-col>
                      <v-btn
                        class="add_product_button"
                        variant="none"
                        @click="repeatProduct(salesrepindex)"
                        ><span class="text">Add Product</span></v-btn
                      >
                    </v-col>
                    <v-col>
                      <div class="text-right">
                        <v-btn
                          class="delete_salesrep"
                          variant="none"
                          @click="removeSalesRep(salesrepindex)"
                          ><span class="text">Delete SalesRep</span></v-btn
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
                class="add_salesrep"
                variant="none"
                @click="repeatSalesRep()"
                ><span class="text">Add SalesRep</span></v-btn
              >
            </div>

            <div class="pt-16 text-center">
              <v-btn
                class="submit_button"
                variant="none"
                @click="updateOrders()"
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
import SalesRepApi from "@/Api/Modules/salesrep";
import { toast } from "@/ApiConstance/toast";
export default {
  data() {
    return {
      isFormValid: false,
      form: {},
      loading: false,
      pageLoad: false,
      salesreps: [],
      products: [],
      salesreporders: [],
    };
  },

  async created() {
    await this.SalesReps();
    await this.DelivereSalesRepProducts();
    await this.initializeData();
  },

  methods: {
    // initializedata

    async initializeData() {
      this.pageLoad = true;

      const payload = {
        distributer_order_id: this.$route.params.distributer_order_id,
      };
      const res = await SalesRepApi.EditSalesRepOrder(payload);

      const resArray = res.data.data;

      resArray.forEach((element) => {
        const items = [];
        // loop order items
        element.distributer_salesrep_order_items.forEach((val) => {
          // check send product equal with product it
          const obj = this.products.find((value) => {
            return value.product_id === val.id;
          });

          items.push({
            product: obj,
            quantity: val.pivot.quantity,
            unitprice: val.pivot.unit_price,
            amount: val.pivot.price,
          });
        });

        //   push this order to payment orders
        this.salesreporders.push({
          salesrep_id: element.salesrep_id,
          order_date: element.order_date,
          orderproducts: items,
        });
      });

      this.pageLoad = false;
    },
    // get salesreps
    async SalesReps() {
      this.pageLoad = true;

      const res = await SalesRepApi.allSalesReps();
      this.salesreps = res.data.data;

      this.pageLoad = false;
    },

    // check weather the salesrep is already added
    ExistsSalesRep(index, currentid) {
      // get previously added product exactly same like this
      const result = this.salesreporders.filter((val) => {
        return val.salesrep_id === currentid;
      });

      if (this.salesreporders[index - 1] && result.length > 1) {
        toast("SalesRep Already Selected Before", "error", 20000);
        this.salesreporders[index].salesrep_id = "";
      }
    },

    // get sent products fro the factory for the salesrep
    async DelivereSalesRepProducts() {
      this.pageLoad = true;
      const payload = {
        distributer_order_id: this.$route.params.distributer_order_id,
      };

      const res = await SalesRepApi.SendProductsForsalesreps(payload);

      this.products = res.data.data;
      this.pageLoad = false;
    },

    // check quantity is available
    updateQuantity(salesrepindex, productindex, product, entervalue) {
      let count = 0;

      // get full count of privious added produt quantities where this product equal
      this.salesreporders.forEach((val) => {
        val.orderproducts.forEach((val1) => {
          if (val1.product.product_id === product.product_id) {
            count = count + Number(val1.quantity);
          }
        });
      });

      if (count > product.uptodate_quantity) {
        // if full count of privious added produt exceded the product stock

        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.salesreporders[salesrepindex].orderproducts[
          productindex
        ].quantity = "";
      }
      // if entered value dont exceded the product stock
      else {
        this.salesreporders[salesrepindex].orderproducts[
          productindex
        ].unitprice = product.unit_price;

        this.salesreporders[salesrepindex].orderproducts[productindex].amount =
          product.unit_price * entervalue;
      }
    },

    // check weather the product is already ad by same distributer before
    ExistsProduct(salesrepindex, productindex, sendproduct) {
      // get previouslyadded product exactly same like this
      const result = this.salesreporders[salesrepindex].orderproducts.filter(
        (val) => {
          return val.product.product_id === sendproduct.product_id;
        }
      );

      if (
        this.salesreporders[salesrepindex].orderproducts[productindex - 1] &&
        result.length > 1
      ) {
        toast(
          "Product Already Selected Before By This SalesRep",
          "error",
          20000
        );
        this.salesreporders[salesrepindex].orderproducts[productindex].product =
          "";
      }
    },
    // repeat distributer
    repeatSalesRep() {
      // repeat form
      this.salesreporders.push({
        salesrep_id: "Select SalesRep",
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
    removeSalesRep(index) {
      this.salesreporders.splice(index, 1);
    },

    // repeat product

    repeatProduct(index) {
      // repeat form
      this.salesreporders[index].orderproducts.push({
        product: "Select Product",
        quantity: "",
        unitprice: "",
        amount: "",
      });
    },

    // remove product
    removeProduct(salesrepindex, productindex) {
      this.salesreporders[salesrepindex].orderproducts.splice(productindex, 1);
    },

    // submit salesrep order

    async updateOrders() {
      this.loading = true;

      this.form.disorder_id = this.$route.params.distributer_order_id;
      this.form.distributer_id = this.$route.params.distributer_id;
      this.form.main_order_id = this.$route.params.main_order_id;
      this.form.salesrep_orders = this.salesreporders;

      await SalesRepApi.UpdateSalesRepOrder(this.form)
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
