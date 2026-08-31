<template>
  <div class="payment_management">
    <v-skeleton-loader
      :loading="pageLoading"
      height="240"
      type="image, list-item-two-line"
      style="background-color: transparent"
    >
      <v-responsive>
        <div>
          <div class="create_form">
            <!-- basic details -->
            <v-row>
              <v-col lg="8" class="pt-5" cols="12">
                <h2 class="heading">
                  Update Payment For {{ supplier.suplier_name }}
                </h2>
              </v-col>
              <v-col lg="4" cols="12" class="text-right">
                <VBtn
                  icon="tabler-x"
                  variant="text"
                  color="secondary"
                  density="comfortable"
                  @click="$emit('close-modal', 'neverload')"
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

              <!-- check status -->
              <v-col
                lg="6"
                class="pt-5"
                cols="12"
                v-if="form.payment_method === 'Check'"
              >
                <label class="label">Select Check Status</label>
                <div class="mt-2" />
                <v-autocomplete
                  placeholder="Select Check Status"
                  class="create_date"
                  v-model="form.check_status"
                  :items="checkStatuses"
                ></v-autocomplete>
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
                  v-model="form.payment_reciept"
                  placeholder="Drag Payment Receipt..."
                  variant="outlined"
                  class="create_date"
                  accept=".jpg,.jpeg,.png,.pdf"
                ></v-file-input>
              </v-col>

              <!-- payment status -->
              <v-col lg="6" class="pt-5" cols="12">
                <label class="label">Payment Status</label>
                <div class="mt-2" />
                <v-autocomplete
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
            <v-row v-for="(order, index) in payment_orders" :key="index">
              <!-- select order -->
              <v-col lg="5" cols="12">
                <label class="label">{{ orderSelectionLabel }}</label>
                <div class="mt-2" />
                <v-autocomplete
                  placeholder="Select Order"
                  v-model="order.supplier_order"
                  class="select_order"
                  :items="availableSupplierOrders"
                  return-object
                  item-title="purchased_reference_id"
                  clearable
                  item-value="id"
                  @update:model-value="
                    checkuniqueOrders(index, order.supplier_order?.id)
                  "
                >
                  <template #item="{ props, item }">
                    <div>
                      <v-list-item
                        v-bind="props"
                        :title="item.raw.purchased_reference_id"
                        :subtitle="orderSubtitle(item.raw)"
                      >
                        <span style="font-size: 13px">
                          Full Order Total -
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
                  placeholder="Payment Amount"
                  v-model="order.paid_amount"
                  class="order_input"
                  @update:model-value="
                    checkExceedamount(index, order.supplier_order)
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
                type="button"
                class="submit_button"
                variant="none"
                :loading="loading"
                :disabled="isRepaymentBlocked"
                @click="submitPayment"
              >
                <span class="text">Submit</span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>

<script>
import SupplyChainApi from "@/Api/Modules/supply_chain"
import SupplierPaymentApi from "@/Api/Modules/supplier_payments"
import { toast } from "@/ApiConstance/toast"

export default {
  props: {
    paymentData: { type: Object, required: true },
    supplier: { type: Object, required: true },
  },
  data() {
    return {
      pageLoading: false,
      payment_orders: [],
      supplierOrders: [],
      loading: false,

      form: {
        id: null,
        payment_reference_id: "",
        payment_date: "",
        payment_status: "",
        payment_method: "",
        payment_direction: "Company To Supplier",
        check_no: "",
        check_date: "",
        check_status: "",
        payment_reciept: null,
      },
      paymentsMethods: ["Check", "Cash"],
      paymentStasuses: ["Pending", "Confirmed"],
      checkStatuses: ["Pending", "Received"],

      // the supplier prop can be stale (the parent page fetches the
      // supplier list once and doesn't refresh it after other pages
      // change credit_balance/due) - this is refreshed from the live
      // supplierSummary call in fetchSupplierOrders() below
      supplierCreditBalance: this.supplier.credit_balance,

      // remaining account-level due, used to cap a payment line that has
      // no order selected (it pays this down directly instead)
      supplierDuePayments: this.supplier.due_payments,
    }
  },
  computed: {
    // "Supplier To Company" is disabled outright in the dropdown (not just
    // toasted-and-reverted after picking it) whenever there's no credit
    // left to repay, so the invalid state can't be reached through the UI
    paymentDirectionOptions() {
      const noCredit = Number(this.supplierCreditBalance || 0) <= 0

      return [
        { title: "Company To Supplier", value: "Company To Supplier" },
        {
          title: noCredit
            ? "Supplier To Company (no credit balance)"
            : "Supplier To Company",
          value: "Supplier To Company",
          disabled: noCredit,
        },
      ]
    },
    // hard stop on the submit button - belt-and-braces alongside the
    // disabled dropdown option, in case payment_direction is already
    // "Supplier To Company" from before the balance dropped to 0
    isRepaymentBlocked() {
      return (
        this.form.payment_direction === "Supplier To Company" &&
        Number(this.supplierCreditBalance || 0) <= 0
      )
    },
    availableSupplierOrders() {
      if (this.form.payment_direction === "Supplier To Company") {
        return this.supplierOrders
      }

      return this.supplierOrders.filter(order => Number(order.due_amount) > 0)
    },
    orderSelectionLabel() {
      return this.form.payment_direction === "Supplier To Company"
        ? "Select Related Purchase Order"
        : "Select Purchase Order"
    },
  },
  async created() {
    this.pageLoading = true
    await this.mapData()
    this.pageLoading = false
  },

  methods: {
    async mapData() {
      const showPayment = this.paymentData
      if (!showPayment) return

      this.form.id = showPayment.id
      this.form.payment_reference_id = showPayment.payment_reference_id
      this.form.payment_date = showPayment.payment_date
      this.form.payment_status = showPayment.payment_status
      this.form.payment_method = showPayment.payment_method
      this.form.payment_direction =
        showPayment.payment_direction || "Company To Supplier"
      this.form.check_no = showPayment.check_no
      this.form.check_date = showPayment.check_date
      this.form.check_status = showPayment.check_status

      await this.fetchSupplierOrders(this.supplier.id)

      this.payment_orders = []

      if (
        showPayment.supplier_order_payments &&
        Array.isArray(showPayment.supplier_order_payments)
      ) {
        showPayment.supplier_order_payments.forEach(payment => {
          // no supplier_order_id means this line already pays down the
          // general account balance directly - keep it as its own line
          // instead of dropping it for having no matching order
          if (!payment.supplier_order_id) {
            this.payment_orders.push({
              paid_amount: payment.paid_amount,
              supplier_order: null,
            })
            return
          }

          let orderReference = this.supplierOrders.find(
            order => order.id === payment.supplier_order_id,
          )

          if (!orderReference && payment.supplier_order) {
            orderReference = {
              id: payment.supplier_order.id,
              purchased_reference_id:
                payment.supplier_order.purchased_reference_id,
              due_amount: Number(payment.supplier_order.due_amount),
              purchased_order_total: Number(
                payment.supplier_order.purchased_order_total,
              ),
            }
            this.supplierOrders.push(orderReference)
          }

          if (orderReference) {
            this.payment_orders.push({
              paid_amount: payment.paid_amount,
              supplier_order: orderReference,
            })
          }
        })
      }
    },

    async fetchSupplierOrders(supplierId) {
      try {
        const payload = {
          id: supplierId,
          start_purchased_date: "",
          end_purhased_date: "",
        }

        const res = await SupplyChainApi.showsuppliersummary(payload)

        this.supplierOrders = res.data.data.suplier_orders || []
        this.supplierCreditBalance = res.data.data.credit_balance ?? this.supplier.credit_balance
        this.supplierDuePayments = res.data.data.due_payments ?? this.supplier.due_payments
      } catch (e) {
        console.error("Orders Fetch Error:", e)
      }
    },

    checkuniqueOrders(index, value) {
      if (!value) return

      const result = this.payment_orders.filter(
        val => val.supplier_order?.id === value,
      )

      if (result.length > 1) {
        toast("You have already selected this purchase order", "error")
        this.payment_orders[index].supplier_order = ""
      }
    },

    checkExceedamount(index, order) {
      if (this.form.payment_direction === "Supplier To Company") return

      // no order selected - this line pays down the supplier's general
      // account balance directly, cap against the sum of ALL no-order
      // lines (there can be more than one) instead of just this one
      if (!order) {
        let generalCount = 0

        this.payment_orders.forEach(val => {
          if (!val.supplier_order) {
            generalCount += Number(val.paid_amount || 0)
          }
        })

        if (generalCount > Number(this.supplierDuePayments || 0)) {
          toast(
            "You Have Entered Larger Amount Than The Supplier's Due Balance Of Rs." +
              this.supplierDuePayments,
            "error",
            30000,
          )
          this.payment_orders[index].paid_amount = ""
        }

        return
      }

      const allowedMaxLimit = Number(order.due_amount || 0)

      if (Number(this.payment_orders[index].paid_amount) > allowedMaxLimit) {
        toast(
          "You Have Entered Large Amount Than Due Amount Of Rs." +
            order.due_amount +
            " For This Order",
          "error",
          30000,
        )
        this.payment_orders[index].paid_amount = ""
      }
    },

    async submitPayment() {
      if (this.loading) return

      this.loading = true
      try {
        // a line with no order selected still counts as valid - it pays
        // down the supplier's general account balance directly
        const validOrders = this.payment_orders.filter(
          item => Number(item.paid_amount) > 0,
        )

        if (validOrders.length === 0) {
          toast(
            "Please select at least one order and enter a payment amount",
            "warning",
          )
          this.loading = false
          return
        }

        if (this.form.payment_direction === "Supplier To Company") {
          if (Number(this.supplierCreditBalance || 0) <= 0) {
            toast("This supplier has no credit balance to repay", "error")
            this.loading = false
            return
          }

          const totalAmount = validOrders.reduce(
            (total, item) => total + Number(item.paid_amount),
            0,
          )

          if (totalAmount > Number(this.supplierCreditBalance || 0)) {
            toast("The repayment amount cannot exceed the supplier credit balance", "error")
            this.loading = false
            return
          }
        }

        const payload = {
          id: Number(this.form.id),
          suplier_id: this.supplier.id,
          payment_reference_id: this.form.payment_reference_id,
          payment_date: this.form.payment_date,
          payment_method: this.form.payment_method,
          payment_direction: this.form.payment_direction,
          check_no: this.form.check_no,
          check_date: this.form.check_date,
          check_status: this.form.check_status,
          payment_status: this.form.payment_status,
          orders: validOrders.map(item => ({
            suplier_order: item.supplier_order
              ? { id: item.supplier_order.id }
              : null,
            paid_amount: Number(item.paid_amount),
          })),
        }

        await SupplierPaymentApi.SupplierPaymentUpdate(payload)
        toast("Supplier Payment Updated Successfully", "success")
        this.$emit("close-modal", "load")
      } catch (e) {
        console.error(e)
        toast(
          e.response?.data?.message ||
            e.response?.data?.error ||
            "Something went wrong",
          "error",
        )
      } finally {
        this.loading = false
      }
    },

    repeatForm() {
      this.payment_orders.push({
        paid_amount: "",
        supplier_order: "",
      })
    },

    handleDirectionChange() {
      if (
        this.form.payment_direction === "Supplier To Company" &&
        Number(this.supplierCreditBalance || 0) <= 0
      ) {
        toast("This supplier has no credit balance to repay", "warning")
        this.form.payment_direction = "Company To Supplier"
      }

      this.payment_orders = [{
        paid_amount: "",
        supplier_order: "",
      }]
    },

    // repayment orders only surface the supplier's credit balance when
    // there's actually something left to repay (balance > 0), the order
    // itself had credit applied to it, and that applied amount didn't
    // already consume the whole balance - otherwise there's nothing
    // useful to flag on that order
    orderSubtitle(order) {
      if (this.form.payment_direction === "Supplier To Company") {
        const creditApplied = Number(order.credit_applied) || 0
        const creditBalance = Number(this.supplierCreditBalance) || 0

        if (creditBalance > 0 && creditApplied > 0 && creditApplied < creditBalance) {
          return "Credit Balance - " + this.getPrice(creditBalance)
        }

        return ""
      }

      return "Due Amount - " + this.getPrice(order.due_amount)
    },

    removeItem(index) {
      this.payment_orders.splice(index, 1)
    },

    getPrice(amount) {
      return amount ? Number(amount).toLocaleString() : "0"
    },
  },
}
</script>
