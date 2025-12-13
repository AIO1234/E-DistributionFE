<template>
  <div class="order_management">
    <div class="send_salesrep pt-3">
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
          v-for="(selectedsalesrep, salesrepindex) in salesreporders"
          :key="selectedsalesrep"
        >
          <v-card-text>
            <div>
              <!-- select sales rep -->
              <v-row>
                <v-col lg="4" cols="12">
                  <label class="label">Salesrep *</label>
                  <div class="pt-2"></div>
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
                  <label class="label">Order Date *</label>
                  <div class="pt-2"></div>
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
                  <label class="label">Quantity *</label>
                  <div class="pt-2"></div>
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
                  <label class="label">Unit Price *</label>
                  <div class="pt-2"></div>
                  <v-text-field
                    placeholder="Unit Price"
                    :rules="[required]"
                    v-model="orderproduct.unitprice"
                    class="product_input"
                    @update:model-value="
                      changeUnitPrice(
                        salesrepindex,
                        productindex,
                        orderproduct.unitprice,
                        orderproduct.quantity
                      )
                    "
                  >
                  </v-text-field>
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

                <!-- repeater button -->
                <v-col lg="1" class="text-right" cols="12">
                  <div class="pt-8"></div>
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="removeProduct(salesrepindex, productindex)"
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
          <v-btn class="add_salesrep" variant="none" @click="repeatSalesRep()"
            ><span class="text">Add SalesRep</span></v-btn
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
import SalesRepApi from "@/Api/Modules/salesrep";
import { toast } from "@/ApiConstance/toast";
export default {
  data() {
    return {
      isFormValid: false,
      form: {},
      loading: false,
      salesreps: [],
      products: [],
      salesreporders: [
        {
          salesrep_id: "Select SalesRep",
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
    await this.SalesReps();
    await this.DelivereSalesRepProducts();
  },

  methods: {
    // get salesreps
    async SalesReps() {
      const res = await SalesRepApi.allSalesReps();
      this.salesreps = res.data.data;
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
      const payload = {
        distributer_order_id: this.$route.params.distributer_order_id,
      };

      const res = await SalesRepApi.SendProductsForsalesreps(payload);

      this.products = res.data.data;
    },

    // check quantity is available
    updateQuantity(salesrepindex, productindex, product, entervalue) {
      let count = 0;

      // get full count of previous added product quantities where this product equal
      this.salesreporders.forEach((val) => {
        val.orderproducts.forEach((val1) => {
          if (val1.product.product_id === product.product_id) {
            count = count + Number(val1.quantity);
          }
        });
      });

      if (count > product.uptodate_quantity) {
        // if full count of privious added product , exceded the product stock

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

    //change unit price when changing
    changeUnitPrice(
      salesrepindex,
      productindex,
      enteredunitprice,
      enteredquantity
    ) {
      this.salesreporders[salesrepindex].orderproducts[productindex].amount =
        enteredunitprice * enteredquantity;
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
    // repeat salesrep
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

    // remove salesrep

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

    async submitOrder() {
      this.loading = true;

      this.form.disorder_id = this.$route.params.distributer_order_id;
      this.form.distributer_id = this.$route.params.distributer_id;
      this.form.main_order_id = this.$route.params.main_order_id;
      this.form.salesrep_orders = this.salesreporders;

      await SalesRepApi.storeSalesRepOrder(this.form)
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
