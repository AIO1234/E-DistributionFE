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
            <AppDateTimePicker
              placeholder="Check Date"
              class="create_date"
              v-model="form.check_date"
            >
            </AppDateTimePicker>
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
            <v-autocomplete
              :rules="[required]"
              placeholder="Select Order"
              v-model="order.shoporder"
              class="select_order"
              :items="dueOrders"
              item-title="order_reference_id"
              item-value="id"
              return-object
              @update:model-value="checkuniqueOrders(index, order.shoporder)"
            >
              <template v-slot:item="{ props, item }">
                <div>
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.order_reference_id"
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
          </v-col>

          <!-- amount -->
          <v-col lg="4" cols="12">
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
      nextTodoId: 1,
      loading: false,
    };
  },
  async created() {
    this.form.payment_code =
      "PAY-SHOP-" + Math.floor(Math.random() * 100000000);
    await this.getDueOrders();
    // autogenarate ids
  },
  props: {
    shop: Object,
  },
  methods: {
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
      let count = 0;
      // get full count of privious added produt quantities where this product equal
      this.orders.forEach((val) => {
        // console.log(val.client_order.id)
        if (val.shoporder.id === order.id) {
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
      // get previously added product exactly same like this
      const result = this.orders.filter((val) => {
        return val.shoporder.id === value.id;
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
      this.form.shop_invoices = this.orders;
      this.form.shops_id = this.shop.id;

      console.log(this.form);
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
