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
      <v-form v-model="isFormValid">
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
                <!-- shop -->
                <v-col lg="4" cols="12">
                  <label class="label">Shop *</label>
                  <div class="pt-2"></div>
                  <v-autocomplete
                    placeholder="Select shop"
                    :rules="[required]"
                    class="select_shop"
                    v-model="selectedshop.shop_id"
                    :items="shops"
                    :loading="shopsLoading"
                    no-filter
                    item-title="shop_name"
                    item-value="id"
                    @update:model-value="
                      Existsshop(shopindex, selectedshop.shop_id)
                    "
                    @update:search="onShopSearch"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :title="item.raw.shop_name"
                        :subtitle="
                          item.raw.area?.area_name ??
                          item.raw.area_name ??
                          ''
                        "
                      ></v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- courier -->
                <v-col lg="4" cols="12" v-if="position == 'courier'">
                  <label class="label">Courier *</label>
                  <div class="pt-2"></div>
                  <v-autocomplete
                    :rules="[required]"
                    placeholder="Select Courier"
                    class="select_shop"
                    v-model="selectedshop.courier_id"
                    :items="couriers"
                    item-title="company_name"
                    item-value="id"
                  ></v-autocomplete>
                </v-col>

                <!-- Cartons unit price -->
                <v-col lg="4" cols="12" v-if="position == 'courier'">
                  <label class="label">Carton Unit Price *</label>
                  <div class="pt-2"></div>
                  <v-text-field
                    placeholder="Cartoons Unit Price"
                    v-model="selectedshop.cartons_unit_price"
                    class="product_input"
                    :rules="[required]"
                  >
                  </v-text-field>
                </v-col>

                <!-- Cartons -->
                <v-col lg="4" cols="12" v-if="position == 'courier'">
                  <label class="label"
                    >Carton Quantity
                    <span v-if="!isRepeatCourier(shopindex)">*</span></label
                  >
                  <div class="pt-2"></div>
                  <v-text-field
                    placeholder="Carton Quantity"
                    v-model="selectedshop.cartons_quantity"
                    class="product_input"
                    :rules="isRepeatCourier(shopindex) ? [] : [required]"
                  >
                  </v-text-field>
                </v-col>

                <!-- order date -->
                <v-col lg="4" cols="12">
                  <label class="label">Order Date *</label>
                  <div class="pt-2"></div>
                  <AppDateTimePicker
                    :rules="[required]"
                    placeholder="shop Order Date"
                    class="send_date"
                    v-model="selectedshop.order_date"
                    :config="{ minDate: minSelectableDate }"
                  >
                  </AppDateTimePicker>
                </v-col>
                <!-- Delivery Note No -->
                <v-col lg="4" cols="12">
                  <label class="label">Delivery Note No *</label>
                  <div class="pt-2"></div>
                  <v-text-field
                    placeholder="Deliery Note No"
                    v-model="selectedshop.delivery_note_no"
                    class="product_input"
                    :rules="[required]"
                  >
                  </v-text-field>
                </v-col>

                <!-- Invoice Number -->
                <v-col lg="4" cols="12">
                  <label class="label">Invoice Number *</label>
                  <div class="pt-2"></div>
                  <v-text-field
                    placeholder="Invoice Number"
                    v-model="selectedshop.invoice_no"
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
                v-for="(
                  orderproduct, productindex
                ) in selectedshop.orderproducts"
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
                    no-filter
                    item-title="product_name"
                    item-value="product_id"
                    @update:model-value="
                      ExistsProduct(
                        shopindex,
                        productindex,
                        orderproduct.product,
                      )
                    "
                  >
                    <template v-slot:item="{ props, item }">
                      <div>
                        <v-list-item
                          v-bind="props"
                          :title="`${makeUpperCase(item.raw.product_name)} - ${makeUpperCase(item.raw.model_number || 'N/A')}`"
                          :subtitle="getPrice(item.raw.unit_price)"
                        >
                          <span
                            style="font-size: 13px"
                            v-if="item.raw.uptodate_quantity !== null"
                            >Balance Stock:
                            {{ balanceStock(item.raw) }}</span
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
                        orderproduct.quantity,
                      )
                    "
                  >
                  </v-text-field>
                </v-col>

                <!-- Unit Price -->
                <v-col lg="3" cols="12">
                  <label class="label">Unit Price(Rs) *</label>
                  <div class="pt-2"></div>
                  <v-text-field
                    placeholder="Unit Price"
                    v-model="orderproduct.unitprice"
                    class="product_input"
                    @update:model-value="
                      changeUnitPrice(
                        orderproduct.product,
                        shopindex,
                        productindex,
                        orderproduct.unitprice,
                        orderproduct.quantity,
                      )
                    "
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

                <!-- Discount Value -->
                <v-col lg="3" cols="12">
                  <label class="label">Discount Value(Rs)</label>
                  <div class="pt-2"></div>
                  <v-text-field
                    placeholder="Discount Value"
                    v-model="orderproduct.discount_value"
                    class="product_input"
                    @update:model-value="changeDiscount(shopindex, productindex)"
                  >
                  </v-text-field>
                  <span class="pt-1" style="font-size: 12px; display: block">
                    Type discount per unit price
                  </span>
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
            @click="openSubmitSummary()"
            :loading="loading"
            :disabled="!isFormValid"
            ><span class="text">Submit</span></v-btn
          >
        </div>
      </v-form>

      <!-- summary of the entered shop (and courier, when required) details, -->
      <!-- shown before the order is actually submitted -->
      <OrderSummaryConfirmDialog
        v-model="showSubmitSummary"
        :shop-summaries="submitSummaries"
        :courier-summaries="courierSummaries"
        :loading="loading"
        @confirm="onSubmitConfirm"
      />
    </div>
  </div>
</template>
<script>
import DistributerApi from "@/Api/Modules/distributer";
import SalesRepApi from "@/Api/Modules/salesrep";
import shopApi from "@/Api/Modules/shop";
import commonmixins from "@/mixins/commonmixins";
import { toast } from "@/ApiConstance/toast";
import OrderSummaryConfirmDialog from "@/components/OrderSummaryConfirmDialog.vue";
export default {
  components: {
    OrderSummaryConfirmDialog,
  },

  data() {
    return {
      position: this.$route.params.position,
      couriers: [],
      isFormValid: false,
      authRole: "",
      form: {},
      loading: false,
      shops: [],
      shopsLoading: false,
      products: [],
      showSubmitSummary: false,
      // numeric part of the last invoice number proposed to the user -
      // repeatshop() increments this locally so each added shop order gets
      // its own proposed next number without another round trip per row
      invoiceNumberCounter: 0,
      // same idea for delivery note numbers, but the value is assigned in
      // Existsshop() (on shop selection) rather than up front, so this is
      // seeded one below the real next number - the increment happens
      // right before each use instead of after
      deliveryNoteCounter: 0,
      shoporders: [
        {
          cartons_unit_price: "",
          cartons_quantity: "",
          courier_id: "",
          shop_id: "",
          delivery_note_no: "",
          invoice_no: "",
          orderproducts: [
            {
              product: "",
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

  computed: {
    // shop (and courier, when required) details shown in the pre-submit
    // summary popup, one entry per shop order being submitted
    submitSummaries() {
      return this.shoporders.map((shoporder) => {
        const shop = this.shops.find((val) => val.id === shoporder.shop_id);
        const courier = this.couriers.find(
          (val) => val.id === shoporder.courier_id,
        );

        return {
          shopName: shop ? shop.shop_name : "",
          showCourierDetails: this.position === "courier",
          courierName: courier ? courier.company_name : "",
          cartonUnitPrice: shoporder.cartons_unit_price,
          cartonQuantity: shoporder.cartons_quantity,
          products: shoporder.orderproducts
            .filter((orderproduct) => orderproduct.product)
            .map((orderproduct) => ({
              productCode: orderproduct.product.product_code || "",
              productName: orderproduct.product.product_name || "",
              quantity: orderproduct.quantity,
              unitPrice: orderproduct.unitprice,
              discountValue: orderproduct.discount_value,
              amount: orderproduct.amount,
            })),
        };
      });
    },

    // per-courier totals (full cartons and full amount) shown in the
    // pre-submit summary popup, one entry per courier actually used
    courierSummaries() {
      if (this.position !== "courier") return [];

      const totalsByCourier = {};

      this.shoporders.forEach((shoporder) => {
        if (!shoporder.courier_id) return;

        // courier's own full amount (cartons * carton unit price), not the
        // shop's product order amount
        const courierAmount =
          Number(shoporder.cartons_unit_price || 0) *
          Number(shoporder.cartons_quantity || 0);

        if (!totalsByCourier[shoporder.courier_id]) {
          const courier = this.couriers.find(
            (val) => val.id === shoporder.courier_id,
          );

          totalsByCourier[shoporder.courier_id] = {
            courierName: courier ? courier.company_name : "",
            totalCartons: 0,
            totalAmount: 0,
          };
        }

        totalsByCourier[shoporder.courier_id].totalCartons += Number(
          shoporder.cartons_quantity || 0,
        );
        totalsByCourier[shoporder.courier_id].totalAmount += courierAmount;
      });

      return Object.values(totalsByCourier);
    },
  },

  async created() {
    await this.init();
  },

  methods: {
    async init() {
      this.getAuthUser();

      this.debouncedShopSearch = this.debounce(
        (searchdata) => this.AllShops(searchdata),
        400,
      );

      await this.getCouriers();
      await this.AllShops();
      await this.DeliveredShopProducts();
      await this.setNextInvoiceNumber();
      await this.setNextDeliveryNoteNumber();
    },

    // format a numeric counter as an INV-##### (5 digit) invoice number
    formatInvoiceNumber(number) {
      return "INV-" + String(number).padStart(5, "0");
    },

    // fetch the real next invoice number from the backend (the client can't
    // know the true next number, it depends on the DB) and propose it as
    // the editable default on the first shop order row
    async setNextInvoiceNumber() {
      const res = await shopApi.nextShopOrderInvoiceNumber();
      const nextInvoiceNumber = res.data.data;

      this.invoiceNumberCounter = parseInt(
        nextInvoiceNumber.split("-")[1],
        10,
      );
      this.shoporders[0].invoice_no = nextInvoiceNumber;
    },

    // format a numeric counter as a DELIVERY-##### (5 digit) delivery note number
    formatDeliveryNoteNumber(number) {
      return "DELIVERY-" + String(number).padStart(5, "0");
    },

    // fetch the real next delivery note number from the backend. Unlike
    // invoice numbers, delivery note numbers are only assigned once a shop
    // is picked (see Existsshop()), so seed the counter one below the real
    // next number - Existsshop() increments before each use
    async setNextDeliveryNoteNumber() {
      const res = await shopApi.nextShopOrderDeliveryNoteNumber();
      const nextDeliveryNoteNumber = res.data.data;

      this.deliveryNoteCounter =
        parseInt(nextDeliveryNoteNumber.split("-")[1], 10) - 1;
    },

    // get couriers from the globals
    async getCouriers() {
      this.loading = true;
      this.couriers = await commonmixins.methods.getCouriers();
      this.loading = false;
    },
    // get shops matching the search text, capped so the whole 187+ shop
    // list is never loaded up front - typing narrows the results
    // server-side instead
    async AllShops(searchdata = "") {
      this.shopsLoading = true;

      const res = await shopApi.allShops({ seacrh_data: searchdata, page: 1, per_page: 40 });

      this.shops = res.data.data.data;

      this.shopsLoading = false;
    },

    // debounced so we don't fire a request on every keystroke. Vuetify
    // echoes a row's already-selected shop name back through this event
    // when that row's dropdown is simply reopened (not a real search the
    // user typed) - treat that as no search, otherwise it silently
    // narrows the list down to just the one shop already selected
    onShopSearch(searchdata) {
      const isEchoOfSelection = this.shoporders.some((order) => {
        const selected = this.shops.find((val) => val.id === order.shop_id);
        return selected && searchdata === selected.shop_name;
      });

      this.debouncedShopSearch(isEchoOfSelection ? "" : searchdata);
    },

    // check weather the shop is already added
    async Existsshop(index, currentid) {
      // get previously added product exactly same like this
      const result = this.shoporders.filter((val) => {
        return val.shop_id === currentid;
      });

      if (this.shoporders[index - 1] && result.length > 1) {
        toast("Shop Already Selected Before", "error", 20000);
        this.shoporders[index].shop_id = "";
      } else if (!this.shoporders[index].delivery_note_no) {
        // only propose a new delivery note number the first time this row
        // gets a shop - re-picking a different shop for the same row (not
        // yet submitted) should keep the number it already has instead of
        // burning another one
        this.deliveryNoteCounter += 1;
        this.shoporders[index].delivery_note_no = this.formatDeliveryNoteNumber(
          this.deliveryNoteCounter,
        );
      }

      // refresh the dropdown back to the default (unsearched) batch, so
      // reopening any row right after picking a shop doesn't leave it
      // stuck showing only the narrow search results that shop matched
      await this.AllShops();
    },

    // open the pre-submit summary popup
    openSubmitSummary() {
      this.showSubmitSummary = true;
    },

    // proceed with the actual submission once the summary is confirmed
    onSubmitConfirm() {
      this.submitOrder();
    },

    // get sent products from the factory for the shop
    async DeliveredShopProducts() {
      // if sending from showroom
      if (
        this.$route.params.position == "directfromshowroom" ||
        this.$route.params.position == "courier"
      ) {
        const payload = {
          distributer_order_id: this.$route.params.distributer_order_id,
        };

        const res = await SalesRepApi.SendProductsForsalesreps(payload);

        this.products = res.data.data;
      }
      // if sending from factory
      else if (this.$route.params.position == "directfromfactory") {
        const payload = {
          order_id: this.$route.params.main_order_id,
        };

        const res = await DistributerApi.SendProductsForDistributers(payload);
        this.products = res.data.data;
      }
      // if sending from salesrep
      else {
        const payload = {
          salesrep_order_id: this.$route.params.reporder_id,
        };

        const res = await shopApi.SendProductsForShops(payload);

        this.products = res.data.data;
      }
    },

    // live remaining stock for a product = its API balance minus every
    // quantity already entered for that same product anywhere in this form
    // (across all shop rows / item rows), so picking the same product for a
    // later shop shows what's actually left, not the original balance
    balanceStock(product) {
      if (!product || product.uptodate_quantity == null) return null;

      let allocated = 0;
      this.shoporders.forEach((shop) => {
        shop.orderproducts.forEach((op) => {
          if (op.product && op.product.product_id === product.product_id) {
            allocated += Number(op.quantity) || 0;
          }
        });
      });

      return product.uptodate_quantity - allocated;
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

        this.shoporders[shopindex].orderproducts[productindex].amount =
          this.calculateAmount(shopindex, productindex, product.unit_price, entervalue);
      }
    },

    // per-unit discount subtracted from the unit price before multiplying by
    // quantity, matching the backend's discounted_price calculation so the
    // pre-submit summary shows the same amount that will actually be saved
    calculateAmount(shopindex, productindex, unitprice, quantity) {
      const discountValue = Number(
        this.shoporders[shopindex].orderproducts[productindex]
          .discount_value || 0,
      );

      return (Number(unitprice) - discountValue) * Number(quantity);
    },

    // recompute amount when the discount value itself changes, after unit
    // price and quantity are already set
    changeDiscount(shopindex, productindex) {
      const orderproduct = this.shoporders[shopindex].orderproducts[productindex];

      if (orderproduct.unitprice && orderproduct.quantity) {
        orderproduct.amount = this.calculateAmount(
          shopindex,
          productindex,
          orderproduct.unitprice,
          orderproduct.quantity,
        );
      }
    },

    // formatted "min - max" selling price range shown under the unit price
    // field, sourced from the same product relation changeUnitPrice
    // validates against
    sellingPriceRange(product) {
      const rangeProduct = product && product.product;

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
      product,
      shopindex,
      productindex,
      enteredunitprice,
      enteredquantity,
    ) {
      // if unit price  in suggested range
      if (enteredunitprice >= product.product.min_selling_price) {
        this.shoporders[shopindex].orderproducts[productindex].amount =
          this.calculateAmount(
            shopindex,
            productindex,
            enteredunitprice,
            enteredquantity,
          );
      }
      // if unit price not in suggested range
      else {
        this.shoporders[shopindex].orderproducts[productindex].amount = "";
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

    // carton quantity is required the first time a courier is used in this
    // batch, but optional on a later shop row that reuses a courier already
    // entered on an earlier row (its carton charge was captured there)
    isRepeatCourier(shopindex) {
      const courierId = this.shoporders[shopindex]?.courier_id;
      if (!courierId) return false;
      return this.shoporders
        .slice(0, shopindex)
        .some((shop) => shop.courier_id === courierId);
    },

    // repeat distributor
    repeatshop() {
      // propose the next invoice number in sequence for this row
      this.invoiceNumberCounter += 1;

      // carry the batch-wide fields forward from the previous shop row so they
      // don't have to be re-entered for every shop: the order date (a whole
      // send usually shares one date) and, when sending via courier, the
      // courier and its per-carton price (the same courier normally delivers
      // the whole batch). All stay editable/required, just pre-filled.
      // shop_id and cartons_quantity are genuinely per-shop and stay blank.
      const previous = this.shoporders[this.shoporders.length - 1] ?? {};
      const carriedOrderDate = previous.order_date ?? "";
      const carriedCourierId =
        this.position === "courier" ? previous.courier_id ?? "" : "";
      const carriedCartonUnitPrice =
        this.position === "courier" ? previous.cartons_unit_price ?? "" : "";

      // repeat form
      this.shoporders.push({
        shop_id: "",
        order_date: carriedOrderDate,
        cartons_unit_price: carriedCartonUnitPrice,
        cartons_quantity: "",
        courier_id: carriedCourierId,
        delivery_note_no: "",
        invoice_no: this.formatInvoiceNumber(this.invoiceNumberCounter),
        orderproducts: [
          {
            product: "",
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
      this.form.comming_from = this.$route.params.position;

      // carton quantity is optional now - send 0 when left blank so the
      // backend's cartons_unit_price * cartons_quantity stays numeric
      this.form.shop_orders = this.shoporders.map((shop) => ({
        ...shop,
        cartons_quantity:
          shop.cartons_quantity === "" || shop.cartons_quantity == null
            ? 0
            : shop.cartons_quantity,
      }));

      await shopApi
        .storeShopOrder(this.form)
        .then(() => {
          this.loading = false;
          this.$router.push({ name: "shoporder" });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
