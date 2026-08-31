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
                  <label class="label">ShowRoom *</label>
                  <div class="pt-2"></div>
                  <v-autocomplete
                    :rules="[required]"
                    placeholder="Select ShowRoom"
                    class="select_distributer"
                    v-model="selecteddistributer.distributer_id"
                    :items="distributers"
                    item-title="distributer_name"
                    item-value="id"
                    @update:model-value="
                      ExistsDistributer(
                        distributerindex,
                        selecteddistributer.distributer_id,
                      )
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col lg="4" cols="12">
                  <label class="label">Order Date *</label>
                  <div class="pt-2"></div>
                  <AppDateTimePicker
                    :rules="[required]"
                    placeholder="Order Date"
                    class="send_date"
                    v-model="selecteddistributer.order_date"
                    :config="{ minDate: minSelectableDate }"
                  >
                  </AppDateTimePicker>
                </v-col>
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
                    :loading="productsLoading"
                    no-filter
                    item-title="product_name"
                    item-value="product_id"
                    return-object
                    @update:model-value="
                      ExistsProduct(
                        distributerindex,
                        productindex,
                        orderproduct.product,
                      )
                    "
                    @update:search="onProductSearch"
                  >
                    <template v-slot:item="{ props, item }">
                      <!-- if distributed from stock -->
                      <div v-if="$route.params.main_order_id == 'no'">
                        <v-list-item
                          v-bind="props"
                          :title="`${makeUpperCase(item.raw.product_name)} - ${makeUpperCase(item.raw.model_number || 'N/A')}`"
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
                      <!-- if distributed the order -->
                      <div v-else>
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
                        orderproduct.quantity,
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
                        orderproduct.product,
                        orderproduct.unitprice,
                        orderproduct.quantity,
                      )
                    "
                    class="product_input"
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
                      ><span class="text">Delete ShowRoom</span></v-btn
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
            ><span class="text">Add ShowRoom</span></v-btn
          >
        </div>

        <div class="pt-16 text-center">
          <v-btn
            class="submit_button"
            variant="none"
            @click="openSubmitSummary()"
            :loading="loading"
            :disabled="!isFormValid"
            ><span class="text">Submit</span></v-btn
          >
        </div>
      </v-form>

      <!-- summary of the entered showroom(s) and their product details, -->
      <!-- shown before the order is actually submitted -->
      <OrderSummaryConfirmDialog
        v-model="showSubmitSummary"
        entity-label="ShowRoom"
        :shop-summaries="submitSummaries"
        :show-discount-column="false"
        :loading="loading"
        @confirm="onSubmitConfirm"
      />
    </div>
  </div>
</template>
<script>
import ProductApi from "@/Api/Modules/products";
import DistributerApi from "@/Api/Modules/distributer";
import { toast } from "@/ApiConstance/toast";
import OrderSummaryConfirmDialog from "@/components/OrderSummaryConfirmDialog.vue";
export default {
  components: {
    OrderSummaryConfirmDialog,
  },

  data() {
    return {
      isFormValid: false,
      authRole: "",
      form: {},
      loading: false,
      distributers: [],
      products: [],
      productsLoading: false,
      showSubmitSummary: false,
      orderdistributers: [
        {
          distributer_id: "",
          order_reference_id: "ORD-" + Math.floor(Math.random() * 100000000),
          orderproducts: [
            {
              product: "",
              quantity: "",
              unitprice: "",
              amount: "",
            },
          ],
        },
      ],
    };
  },

  computed: {
    // showroom details shown in the pre-submit summary popup, one entry per
    // distributer (showroom) order being submitted
    submitSummaries() {
      return this.orderdistributers.map((orderdistributer) => {
        const distributer = this.distributers.find(
          (val) => val.id === orderdistributer.distributer_id,
        );

        return {
          shopName: distributer ? distributer.distributer_name : "",
          showCourierDetails: false,
          products: orderdistributer.orderproducts
            .filter((orderproduct) => orderproduct.product)
            .map((orderproduct) => ({
              productCode: orderproduct.product.product_code || "",
              productName:
                orderproduct.product.product_name ||
                orderproduct.product.product_code ||
                "",
              quantity: orderproduct.quantity,
              unitPrice: orderproduct.unitprice,
              amount: orderproduct.amount,
            })),
        };
      });
    },
  },

  async created() {
    await this.init();
  },

  methods: {
    async init() {
      this.getAuthUser();

      this.debouncedProductSearch = this.debounce(
        (searchdata) => this.DeliveredistributerProducts(searchdata),
        400,
      );

      await this.Distributers();
      await this.DeliveredistributerProducts();
    },

    // get distributers
    async Distributers() {
      const res = await DistributerApi.allDistributers({
        page: 1,
        per_page: 1000,
      });

      this.distributers = res.data.data.data;
    },

    // open the pre-submit summary popup
    openSubmitSummary() {
      this.showSubmitSummary = true;
    },

    // proceed with the actual submission once the summary is confirmed
    onSubmitConfirm() {
      this.submitOrder();
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
    async DeliveredistributerProducts(searchdata = "") {
      if (this.$route.params.main_order_id == "no") {
        // distributing directly from stock - search the whole catalog
        // instead of loading every product up front
        this.productsLoading = true;

        const payload = {
          searchdata,
          page: 1,
          per_page: 40,
        };
        const res = await ProductApi.allProducts(payload);
        this.products = res.data.data.data;

        this.productsLoading = false;
      } else {
        const payload = {
          order_id: this.$route.params.main_order_id,
        };

        const res = await DistributerApi.SendProductsForDistributers(payload);
        this.products = res.data.data;
      }
    },

    // debounced so we don't fire a request on every keystroke - only
    // relevant when distributing directly from stock, where the list is
    // search-driven rather than the small order-scoped list. Vuetify
    // echoes an already-selected product's code back through this event
    // when its dropdown is simply reopened (not a real search the user
    // typed) - treat that as no search, otherwise it silently narrows the
    // list down to just the one product already selected
    onProductSearch(searchdata) {
      if (this.$route.params.main_order_id == "no") {
        const isEchoOfSelection = this.orderdistributers.some((distributer) =>
          distributer.orderproducts.some(
            (orderproduct) =>
              orderproduct.product &&
              searchdata === orderproduct.product.product_code,
          ),
        );

        this.debouncedProductSearch(isEchoOfSelection ? "" : searchdata);
      }
    },

    // product id: flat "id" when distributing from stock, "product_id" when
    // distributing an existing order (same shape split as sellingPriceRange)
    getProductId(product) {
      return this.$route.params.main_order_id == "no"
        ? product.id
        : product.product_id;
    },

    // check quantity is available
    updateQuantity(distributerindex, productindex, product, entervalue) {
      let count = 0;

      // get full count of privious added produt quantities where this product equal
      this.orderdistributers.forEach((val) => {
        val.orderproducts.forEach((val1) => {
          if (this.getProductId(val1.product) === this.getProductId(product)) {
            count = count + Number(val1.quantity);
          }
        });
      });

      // if distributing from stock
      if (this.$route.params.main_order_id == "no") {
        if (count > product.stock_count) {
          // if full count of privious added produt exceded the product stock

          toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
          this.orderdistributers[distributerindex].orderproducts[
            productindex
          ].quantity = "";
        }
      }
      // if distributing an order
      else {
        if (count > product.uptodate_quantity) {
          // if full count of privious added produt exceded the product stock

          toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
          this.orderdistributers[distributerindex].orderproducts[
            productindex
          ].quantity = "";
        }
      }
    },

    // formatted "min - max" selling price range shown under the unit price
    // field, sourced from the same product shape changeUnitPrice validates
    // against (flat when distributing from stock, nested under .product
    // when distributing an order)
    sellingPriceRange(product) {
      if (!product) return "";

      const rangeProduct =
        this.$route.params.main_order_id == "no" ? product : product.product;

      if (
        !rangeProduct ||
        rangeProduct.min_selling_price == null ||
        rangeProduct.max_selling_price == null
      ) {
        return "";
      }

      return `${this.getPrice(rangeProduct.min_selling_price)} - ${this.getPrice(rangeProduct.max_selling_price)}`;
    },

    //change unit price when changing
    changeUnitPrice(
      distributerindex,
      productindex,
      product,
      enteredunitprice,
      enteredquantity,
    ) {
      // if distributing from stock
      if (this.$route.params.main_order_id == "no") {
        // if unit price  in suggested range
        if (enteredunitprice >= product.min_selling_price) {
          this.orderdistributers[distributerindex].orderproducts[
            productindex
          ].amount = enteredunitprice * enteredquantity;
        }
        // if unit price not in suggested range
        else {
          this.orderdistributers[distributerindex].orderproducts[
            productindex
          ].amount = "";
        }
      }
      // if distributing from order
      else {
        // if unit price  in suggested range
        if (enteredunitprice >= product.product.min_selling_price) {
          this.orderdistributers[distributerindex].orderproducts[
            productindex
          ].amount = enteredunitprice * enteredquantity;
        }
        // if unit price not in suggested range
        else {
          this.orderdistributers[distributerindex].orderproducts[
            productindex
          ].amount = "";
        }
      }
    },

    // check weather the product is already ad by same distributer before
    async ExistsProduct(distributerindex, productindex, sendproduct) {
      // get previouslyadded product exactly same like this
      const result = this.orderdistributers[
        distributerindex
      ].orderproducts.filter((val) => {
        return (
          this.getProductId(val.product) === this.getProductId(sendproduct)
        );
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
          20000,
        );
        this.orderdistributers[distributerindex].orderproducts[
          productindex
        ].product = "";
      }

      // refresh the dropdown back to the default (unsearched) batch, so
      // reopening any row right after picking a product doesn't leave it
      // stuck showing only the narrow search results that product matched
      await this.DeliveredistributerProducts();
    },
    // repeat distributer
    repeatDistributer() {
      // repeat form
      this.orderdistributers.push({
        distributer_id: "Select ShowRoom",
        order_reference_id: "ORD-" + Math.floor(Math.random() * 100000000),
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
        product: "",
        quantity: "",
        unitprice: "",
        amount: "",
      });
    },

    // remove product
    removeProduct(distributerindex, productindex) {
      this.orderdistributers[distributerindex].orderproducts.splice(
        productindex,
        1,
      );
    },

    // submit distributer order

    async submitOrder() {
      this.loading = true;

      this.form.order_id = this.$route.params.main_order_id;
      this.form.distributer_orders = this.orderdistributers;

      await DistributerApi.storeDistributerOrder(this.form)
        .then(() => {
          this.loading = false;
          // if distributing from stock
          if (this.$route.params.main_order_id == "no") {
            this.$router.push("/distributororder");
          }
          // if distributing from order
          else {
            this.$router.push("/factoryorder");
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
