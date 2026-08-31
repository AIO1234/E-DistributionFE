<template>
  <div class="payment_management">
    <div class="create_form">
      <!-- basic details -->
      <v-row>
        <v-col lg="8" class="pt-5" cols="12">
          <h2 class="heading">Add Payment For {{ shop.shop_name }}</h2>
        </v-col>
        <v-col lg="4" cols="12"> </v-col>
      </v-row>

      <v-form v-model="isFormValid">
        <v-row>
          <!-- payment reference id -->
          <v-col lg="6" class="pt-5" cols="12">
            <label class="label">Payment Reference Id</label>
            <div class="mt-2" />
            <v-text-field
              placeholder="Payment Reference Id"
              v-model="form.payment_code"
              readonly
              class="create_date"
            >
            </v-text-field>
          </v-col>

          <!-- payment method -->
          <v-col lg="6" class="pt-5" cols="12">
            <label class="label">Payment Method</label>
            <div class="mt-2" />
            <v-autocomplete
              :rules="[required]"
              placeholder="Select Payment Method"
              class="create_date"
              v-model="form.payment_method"
              :items="payment_methods"
            ></v-autocomplete>
          </v-col>

          <!-- payment check_no -->
          <v-col
            lg="6"
            class="pt-5"
            cols="12"
            v-if="form.payment_method === 'Check'"
          >
            <label class="label">Payment Check No</label>
            <div class="mt-2" />
            <v-text-field
              placeholder="Payment Check No"
              v-model="form.check_no"
              class="create_date"
            >
            </v-text-field>
          </v-col>

          <!-- payment date -->
          <v-col
            lg="6"
            class="pt-5"
            cols="12"
            v-if="form.payment_method === 'Cash'"
          >
            <label class="label">Payment Date</label>
            <div class="mt-2" />
            <AppDateTimePicker
              placeholder="Payment Date"
              class="create_date"
              v-model="form.payment_date"
            >
            </AppDateTimePicker>
          </v-col>

          <!-- check date -->
          <v-col
            lg="6"
            class="pt-5"
            cols="12"
            v-if="form.payment_method === 'Check'"
          >
            <label class="label">Check Date</label>
            <div class="mt-2" />
            <AppDateTimePicker
              placeholder="Check Date"
              class="create_date"
              v-model="form.check_date"
            >
            </AppDateTimePicker>
          </v-col>

          <!-- payment status -->
          <v-col lg="6" class="pt-5" cols="12">
            <label class="label">Payment Status</label>
            <div class="mt-2" />
            <v-autocomplete
              :rules="[required]"
              placeholder="Select Status"
              class="create_date"
              v-model="form.payment_status"
              :items="payment_statuses"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <div class="pt-2"></div>
        <hr />
        <!-- order details -->
        <div class="pt-7"></div>
        <h2 class="heading">Shop Orders</h2>
        <div class="pt-7"></div>
        <v-row v-for="(order, index) in orders" :key="order">
          <!-- select order -->
          <v-col lg="5" cols="12">
            <label class="label">Select Order</label>
            <div class="mt-2" />
            <v-autocomplete
              placeholder="Select Order"
              v-model="order.shoporder"
              class="select_order"
              :items="dueOrders"
              item-title="invoice_no"
              item-value="id"
              return-object
              clearable
              @update:model-value="checkuniqueOrders(index, order.shoporder)"
            >
              <template v-slot:item="{ props, item }">
                <div>
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.invoice_no"
                    :subtitle="getPrice(item.raw.order_amount)"
                  >
                    <span
                      style="font-size: 13px"
                      v-if="item.raw.total_due_amount !== null"
                      >Due Amount: {{ item.raw.total_due_amount }}</span
                    >
                  </v-list-item>
                </div>
              </template>
            </v-autocomplete>
            <span class="pt-1" style="font-size: 12px; display: block">
              Leave empty to pay against the shop's general balance
              (Due: {{ getPrice(shopDuePayments) }})
            </span>
          </v-col>

          <!-- amount -->
          <v-col lg="4" cols="12">
            <label class="label">Amount</label>
            <div class="mt-2" />
            <v-text-field
              :rules="[required]"
              placeholder="Amount"
              v-model="order.amount"
              class="order_input"
              @update:model-value="checkExceedamount(index, order.shoporder)"
            >
            </v-text-field>
          </v-col>

          <!-- repeater button -->
          <v-col lg="3" class="text-right" cols="12">
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
          <v-btn class="add_order_button" variant="none" @click="repeatOrder()"
            ><span class="text">Add Order</span></v-btn
          >
        </div>

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
      </v-form>
    </div>
  </div>
</template>
<script>
import PaymentApi from "@/Api/Modules/payments";
import ShopApi from "@/Api/Modules/shop";
import { toast } from "@/ApiConstance/toast";
export default {
  data() {
    return {
      isFormValid: false,
      form: {},
      orders: [
        {
          id: 1,
          shoporder: "Select Order",
          amount: "",
        },
      ],
      dueOrders: [],
      payment_methods: ["Check", "Cash"],
      payment_statuses: ["Pending", "Recieved"],
      nextTodoId: 1,
      loading: false,
      // the shop prop is a snapshot from the parent page's shop list,
      // never refreshed - kept as the fallback default, but refreshed
      // from a live lookup in refreshShopDue() below so the general
      // account cap uses the shop's actual current due amount
      shopDuePayments: this.shop.Uptodate_due_amounts,
    };
  },
  async created() {
    this.form.payment_code =
      "PAY-SHOP-" + Math.floor(Math.random() * 100000000);
    await this.getDueOrders();
    await this.refreshShopDue();
    // autogenarate ids
  },
  props: {
    shop: Object,
  },
  methods: {
    // re-fetch this shop's current due amount rather than trusting the
    // prop snapshot - searches by the shop's own (unique) code, which
    // reliably resolves back to this exact shop, without needing a
    // dedicated single-shop lookup endpoint
    async refreshShopDue() {
      const res = await ShopApi.allShops({
        seacrh_data: this.shop.shop_code,
        page: 1,
        per_page: 10,
      });

      const liveShop = (res.data.data.data || []).find(
        (val) => val.id === this.shop.id,
      );

      if (liveShop) {
        this.shopDuePayments = liveShop.Uptodate_due_amounts;
      }
    },

    // get due orders for the shop
    async getDueOrders() {
      const payload = {
        shop_id: this.shop.id,
      };

      const res = await PaymentApi.dueShopInvoices(payload);

      this.dueOrders = res.data.data;
    },

    // check order due amount is exceeded
    checkExceedamount(index, order) {
      // no order selected - this line pays down the shop's general
      // account balance directly, cap against that instead
      if (!order || typeof order !== "object") {
        let generalCount = 0;

        this.orders.forEach((val) => {
          if (!val.shoporder || typeof val.shoporder !== "object") {
            generalCount += Number(val.amount || 0);
          }
        });

        if (generalCount > Number(this.shopDuePayments || 0)) {
          toast(
            "You Have Entered Larger Amount Than The Shop's Due Balance Of Rs." +
              this.shopDuePayments,
            "error",
            30000
          );

          this.orders[index].amount = "";
        }

        return;
      }

      let count = 0;
      // get full count of privious added produt quantities where this product equal
      this.orders.forEach((val) => {
        // console.log(val.client_order.id)
        if (val.shoporder?.id === order.id) {
          count = count + Number(val.amount);
        }
      });

      if (count > order.total_due_amount) {
        toast(
          "You Have Entered Large Amount Than Due Amount Of Rs." +
            order.total_due_amount +
            " For This Order",
          "error",
          30000
        );

        // set empty if exceeded
        this.orders[index].amount = "";
      }
    },

    // check entered order already entred

    checkuniqueOrders(index, value) {
      if (!value || typeof value !== "object") return;

      // get previously added product exactly same like this
      const result = this.orders.filter((val) => {
        return val.shoporder?.id === value.id;
      });

      // check previously have orders

      if (this.orders[index - 1] && result.length > 1) {
        toast("You Have already Selected This Order", "error", 20000);

        // let empty order id if itis same with previous one
        this.orders[index].shoporder = "";
      }
    },

    // repeat order button
    repeatOrder() {
      // repeat form
      this.orders.push({
        id: (this.nextTodoId += this.nextTodoId),
        shoporder: "Select Order",
        amount: "",
      });
    },

    // remove order
    removeItem(index) {
      this.orders.splice(index, 1);
    },

    // submit order

    async submitOrder() {
      this.loading = true;

      // a line's shoporder is either a real order object (return-object)
      // or unset/cleared/still the unfilled-row placeholder - normalize
      // anything that isn't a real order object to null, so the backend
      // treats it as a general account line rather than misreading it
      this.form.shop_invoices = this.orders.map((order) => ({
        ...order,
        shoporder:
          order.shoporder && typeof order.shoporder === "object"
            ? order.shoporder
            : null,
      }));
      this.form.shops_id = this.shop.id;

      await PaymentApi.storeShopPayment(this.form)
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
