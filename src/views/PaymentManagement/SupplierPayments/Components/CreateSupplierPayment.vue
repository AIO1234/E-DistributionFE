<template>
  <!-- createSupplierpayment.vue -->

  <div class="payment_management">
    <v-skeleton-loader
      :loading="pageLoading"
      height="240"
      type="image, list-item-two-line"
      style="background-color: transparent"
    >
    <v-responsive>
    <div class="create_form">
      <!-- basic details -->
      <v-row>
        <v-col lg="8" class="pt-5" cols="12">
          <h2 class="heading">Add Payment For {{ supplier.suplier_name }}</h2>
        </v-col>
        <v-col lg="4" cols="12" class="text-right">
          <VBtn
            icon="tabler-x"
            variant="text"
            color="secondary"
            density="comfortable"
            @click="close('neverload')"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <VChip color="success" size="small" variant="tonal">
            Credit Balance: {{ getPrice(supplierCreditBalance) }}
          </VChip>
        </v-col>
      </v-row>

      <v-form v-model="isFormValid">
        <v-row>
          <!-- supplier payment id -->
          <v-col lg="6" class="pt-5" cols="12">
            <label class="label">Supplier Payment Id</label>
            <div class="mt-2" />
            <v-text-field
              placeholder="Payment Id"
              v-model="form.payment_reference_id"
              readonly
              class="create_date"
            >
            </v-text-field>
          </v-col>

          <!-- payment direction -->
          <v-col lg="6" class="pt-5" cols="12">
            <label class="label">Payment Direction</label>
            <div class="mt-2" />
            <v-autocomplete
              :rules="[required]"
              placeholder="Select Direction"
              class="create_date"
              v-model="form.payment_direction"
              :items="paymentDirectionOptions"
              item-title="title"
              item-value="value"
              item-props
              @update:model-value="handleDirectionChange"
            ></v-autocomplete>
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
              :items="paymentsMethods"
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

          <!-- payment receipt -->
          <v-col
            lg="6"
            class="pt-5"
            cols="12"
            v-if="form.payment_method === 'Check'"
          >
            <label class="label">Payment Receipt</label>
            <div class="mt-2" />
            <v-file-input
              v-model="form.payment_receipt"
              placeholder="Drag Payment Receipt..."
              variant="outlined"
              class="create_date"
              accept=".png,.jpg,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              @change="handleFileChange"
            ></v-file-input>
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
              :items="paymentStasuses"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <div class="pt-2"></div>
        <hr />
        <!-- order details -->
        <div class="pt-7"></div>
        <h2 class="heading">Purchase Orders</h2>
        <div class="pt-7"></div>
        <v-row v-for="(order, index) in payment_orders" :key="order">
          <!-- select order -->
          <v-col lg="5" cols="12">
            <label class="label">{{ orderSelectionLabel }}</label>
            <div class="mt-2" />
            <v-autocomplete
              placeholder="Select Order"
              v-model="order.suplier_order"
              class="select_order"
              :items="availableSupplierOrders"
              return-object
              item-title="purchased_reference_id"
              clearable
              item-value="id"
              @update:model-value="
                checkuniqueOrders(index, order.suplier_order?.id)
              "
            >
              <template #item="{ props, item }">
                <div>
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.purchased_reference_id"
                    :subtitle="orderSubtitle(item.raw)"
                  >
                    <span style="font-size: 13px"
                      >Full Order Total -
                      {{ getPrice(item.raw.purchased_order_total) }}
                    </span>
                  </v-list-item>
                </div>
              </template>
            </v-autocomplete>
            <span class="pt-1" style="font-size: 12px; display: block">
              Leave empty to pay against the general account balance
              (Due: {{ getPrice(supplierDuePayments) }})
            </span>
          </v-col>

          <!-- payment amount -->
          <v-col lg="4" cols="12">
            <label class="label">Payment Amount</label>
            <div class="mt-2" />
            <v-text-field
              :rules="[required]"
              placeholder="Payment Amount"
              v-model="order.paid_amount"
              class="order_input"
              @update:model-value="
                checkExceedamount(index, order.suplier_order)
              "
            >
            </v-text-field>
          </v-col>

          <!-- remove button -->
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
          <v-btn class="add_order_button" variant="none" @click="repeatForm"
            ><span class="text">Add Order</span></v-btn
          >
        </div>

        <div class="pt-12"></div>

        <div class="text-center">
          <v-btn
            class="submit_button"
            variant="none"
            :loading="loading"
            :disabled="isRepaymentBlocked"
            @click="submitPayment"
          >
            <span class="text">Submit</span>
          </v-btn>
        </div>
      </v-form>
    </div>
    </v-responsive>
    </v-skeleton-loader>
  </div>
  <!-- dialogs -->

  <!-- category create dialog -->
  <VDialog
    v-model="showCategoryModal"
    width="900px"
    class="category_management"
    scrollable=""
  >
    <VCard>
      <VCardText class="add_category">
        <!-- add category form -->
        <div>
          <AddCategory @close-modal="closeCategoryModal" />
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- product create dialog -->
  <VDialog
    v-model="showProductModal"
    width="900px"
    height="715px"
    class="product_management"
    scrollable=""
  >
    <VCard>
      <VCardText class="add_product">
        <!-- add suplier form -->
        <div>
          <AddProduct @close-modal="closeProductModal" />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import AddCategory from "@/views/MasterData/ProductCategoryManagement/Components/AddCategory.vue";
import AddProduct from "@/views/StockManagement/Components/Create.vue";
import SupplyChainApi from "@/Api/Modules/supply_chain";
import SupplierPaymentApi from "@/Api/Modules/supplier_payments";
import { toast } from "@/ApiConstance/toast";

export default {
  components: {
    AddCategory,
    AddProduct,
  },
  props: {
    supplier: { type: Object, required: true },
  },
  data() {
    return {
      currentProductIndex: "",

      payment_orders: [
        {
          paid_amount: "",
          suplier_order: null,
        },
      ],

      nextTodoId: 1,

      supplierOrders: [],

      pageTitle: {},

      form: {
        payment_reference_id: "",
        payment_date: "",
        payment_method: "",
        payment_direction: "Company To Supplier",
        check_no: "",
        check_date: "",
        payment_status: "",
        payment_receipt: null,
      },

      loading: false,
      // gates the form behind a skeleton until getOrders() resolves, so
      // supplierDuePayments can't be read as its stale/0 seed value while
      // the live due amount is still in flight
      pageLoading: false,

      paymentStasuses: ["Pending", "Confirmed"],

      paymentsMethods: ["Check", "Cash"],

      showCategoryModal: false,
      showProductModal: false,

      // the supplier prop can be stale (the parent page fetches the
      // supplier list once and doesn't refresh it after other pages
      // change credit_balance/due) - this is refreshed from the live
      // supplierSummary call in getOrders() below
      supplierCreditBalance: this.supplier.credit_balance,

      // remaining account-level due, used to cap a payment line that has
      // no order selected (it pays this down directly instead)
      supplierDuePayments: this.supplier.due_payments,
    };
  },
  computed: {
    // "Supplier To Company" is disabled outright in the dropdown (not just
    // toasted-and-reverted after picking it) whenever there's no credit
    // left to repay, so the invalid state can't be reached through the UI
    paymentDirectionOptions() {
      const noCredit = Number(this.supplierCreditBalance || 0) <= 0;

      return [
        { title: "Company To Supplier", value: "Company To Supplier" },
        {
          title: noCredit
            ? "Supplier To Company (no credit balance)"
            : "Supplier To Company",
          value: "Supplier To Company",
          disabled: noCredit,
        },
      ];
    },
    availableSupplierOrders() {
      if (this.form.payment_direction === "Supplier To Company") {
        return this.supplierOrders;
      }

      return this.supplierOrders.filter((order) => Number(order.due_amount) > 0);
    },
    // hard stop on the Done button - belt-and-braces alongside the
    // disabled dropdown option, in case payment_direction is already
    // "Supplier To Company" from before the balance dropped to 0
    isRepaymentBlocked() {
      return (
        this.form.payment_direction === "Supplier To Company" &&
        Number(this.supplierCreditBalance || 0) <= 0
      );
    },
    orderSelectionLabel() {
      return this.form.payment_direction === "Supplier To Company"
        ? "Select Related Purchase Order"
        : "Select Purchase Order";
    },
  },
  async created() {
    this.pageLoading = true;

    this.form.payment_reference_id =
      "SUP-PAY-" + Math.floor(Math.random() * 10000000000000);

    // get due orders for the supplier chosen on the parent page
    await this.getOrders();

    this.pageLoading = false;
  },
  methods: {
    // close button
    close(data) {
      this.$emit("close-modal", data);
    },

    goBack() {
      this.$emit("close-modal", "neverload");
    },

    // get orders for the supplier
    async getOrders() {
      const payload = {
        id: this.supplier.id,
        start_purchased_date: "",
        end_purhased_date: "",
      };

      const res = await SupplyChainApi.showsuppliersummary(payload);

      this.supplierOrders = res.data.data.suplier_orders || [];
      this.supplierCreditBalance = res.data.data.credit_balance ?? this.supplier.credit_balance;
      this.supplierDuePayments = res.data.data.due_payments ?? this.supplier.due_payments;
    },

    handleDirectionChange() {
      if (
        this.form.payment_direction === "Supplier To Company" &&
        Number(this.supplierCreditBalance || 0) <= 0
      ) {
        toast("This supplier has no credit balance to repay", "warning");
        this.form.payment_direction = "Company To Supplier";
      }

      this.payment_orders = [{
        paid_amount: "",
        suplier_order: null,
      }];
    },

    // repayment orders only surface the supplier's credit balance when
    // there's actually something left to repay (balance > 0), the order
    // itself had credit applied to it, and that applied amount didn't
    // already consume the whole balance - otherwise there's nothing
    // useful to flag on that order
    orderSubtitle(order) {
      if (this.form.payment_direction === "Supplier To Company") {
        const creditApplied = Number(order.credit_applied) || 0;
        const creditBalance = Number(this.supplierCreditBalance) || 0;

        if (creditBalance > 0 && creditApplied > 0 && creditApplied < creditBalance) {
          return "Credit Balance - " + this.getPrice(creditBalance);
        }

        return "";
      }

      return "Due Amount - " + this.getPrice(order.due_amount);
    },

    getPrice(amount) {
      return amount ? Number(amount).toLocaleString() : "0";
    },

    // check unique orders
    checkuniqueOrders(index, value) {
      if (!value) return;

      const result = this.payment_orders.filter((val) => {
        return val.suplier_order?.id === value;
      });

      if (this.payment_orders[index - 1] && result.length > 1) {
        toast("You Have already Selected This Purchase Order", "error", 20000);

        this.payment_orders[index].suplier_order = "";
      }
    },

    // check order due amount is exceeded
    checkExceedamount(index, order) {
      if (this.form.payment_direction === "Supplier To Company") return;

      // no order selected - this line pays down the supplier's general
      // account balance directly, cap against that instead
      if (!order) {
        let generalCount = 0;

        this.payment_orders.forEach((val) => {
          if (!val.suplier_order) {
            generalCount += Number(val.paid_amount || 0);
          }
        });

        if (generalCount > Number(this.supplierDuePayments || 0)) {
          toast(
            "You Have Entered Larger Amount Than The Supplier's Due Balance Of Rs. " +
              this.supplierDuePayments,
            "error",
            30000,
          );

          this.payment_orders[index].paid_amount = "";
        }

        return;
      }

      let count = 0;

      this.payment_orders.forEach((val) => {
        if (val.suplier_order?.id === order.id) {
          count += Number(val.paid_amount || 0);
        }
      });

      if (count > Number(order.due_amount)) {
        toast(
          "You Have Entered Larger Amount Than Due Amount Of Rs. " +
            order.due_amount,
          "error",
          30000,
        );

        this.payment_orders[index].paid_amount = "";
      }
    },

    // upload image
    async uploadImage(data) {
      await SupplierPaymentApi.uploadReceipt(data);
    },

    // submit form

    async submitPayment() {
      this.loading = true;

      try {
        // a line with no order selected still counts as valid - it pays
        // down the supplier's general account balance directly
        const validOrders = this.payment_orders.filter(
          (order) => Number(order.paid_amount) > 0,
        );

        if (validOrders.length === 0) {
          toast("Please select at least one order and enter a payment amount", "warning");
          return;
        }

        if (this.form.payment_direction === "Supplier To Company") {
          if (Number(this.supplierCreditBalance || 0) <= 0) {
            toast("This supplier has no credit balance to repay", "error");
            return;
          }

          const totalAmount = validOrders.reduce(
            (total, order) => total + Number(order.paid_amount),
            0,
          );

          if (totalAmount > Number(this.supplierCreditBalance || 0)) {
            toast("The repayment amount cannot exceed the supplier credit balance", "error");
            return;
          }
        }

        const formData = new FormData();

        const payload = {
          ...this.form,

          suplier_id: this.supplier.id,

          orders: validOrders.map((order) => ({
            suplier_order: order.suplier_order
              ? { id: order.suplier_order.id }
              : null,
            paid_amount: Number(order.paid_amount),
          })),
        };

        const res = await SupplierPaymentApi.SupplierPaymentStore(payload);

        if (this.form.payment_receipt) {
          formData.append("payment_receipt", this.form.payment_receipt[0]);

          formData.append("id", res.data.data.id);

          formData.append("direction", "Create Payment");

          await this.uploadImage(formData);
        }

        this.close("load");
      } catch (e) {
        toast("Something went wrong", "error");
      } finally {
        this.loading = false;
      }
    },

    // repeat form
    repeatForm() {
      this.payment_orders.push({
        id: (this.nextTodoId += this.nextTodoId),
        paid_amount: "",
        suplier_order: null,
      });
    },

    // remove product
    removeItem(index) {
      this.payment_orders.splice(index, 1);
    },
  },
};
</script>
