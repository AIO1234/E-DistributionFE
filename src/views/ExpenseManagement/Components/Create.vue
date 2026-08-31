<template>
  <div class="masterdata expense_management">
    <!-- title -->
    <h3 class="form_title">
      Create Expense
    </h3>

    <div class="form">
      <!-- add forms -->
      <VForm v-model="isFormValid">
        <VRow>
          <!-- Expense Type -->
          <VCol
            lg="12"
            cols="12"
          >
            <label class="label">Expense Type *</label>
            <div class="mt-2" />
            <VAutocomplete
              v-model="mainType"
              :items="expenseTypes"
              class="input expense_type_select"
              item-title="label"
              item-value="value"
              placeholder="Select Expense Type"
              :rules="[required]"
              @update:model-value="onTypeChange"
            />
          </VCol>

          <!-- Sub Category - only for the categories that have one -->
          <VCol
            v-if="subCategoriesByType[mainType]"
            lg="12"
            cols="12"
          >
            <label class="label">Sub Category *</label>
            <div class="mt-2" />
            <VAutocomplete
              v-model="subCategory"
              :items="subCategoriesByType[mainType]"
              class="input"
              placeholder="Select Sub Category"
              :rules="[required]"
              @update:model-value="onSubCategoryChange"
            />
          </VCol>

          <!-- Expense Reference Id -->
          <VCol
            lg="4"
            cols="12"
          >
            <label class="label">Expense Id</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.expense_reference_id"
              class="input"
              readonly=""
            />
          </VCol>

          <!-- Expense Date -->
          <VCol
            lg="4"
            cols="12"
          >
            <label class="label">Expense Date *</label>
            <div class="mt-2" />
            <AppDateTimePicker
              v-model="form.expense_date"
              placeholder="Expense Date"
              class="input"
              :rules="[required]"
            />
          </VCol>

          <!-- Payment Status -->
          <VCol
            lg="4"
            cols="12"
          >
            <label class="label">Payment Status *</label>
            <div class="mt-2" />
            <VAutocomplete
              v-model="form.status"
              :items="statuses"
              class="input"
              placeholder="Select Payment Status"
              :rules="[required]"
            />
          </VCol>
        </VRow>

        <!-- dynamic section — changes based on the selected expense type -->
        <VRow
          v-if="form.expense_type"
          class="dynamic_section"
        >
          <!-- Courier -->
          <template v-if="form.expense_type === 'Courier'">
            <!-- Select Transportation Agent -->
            <VCol
              lg="6"
              cols="12"
            >
              <label class="label">Select Transportation Agent *</label>
              <div class="mt-2" />
              <VAutocomplete
                v-model="selectedCourier"
                :items="couriers"
                class="input"
                item-title="company_name"
                item-value="id"
                placeholder="Select Transportation Agent"
                return-object
                :rules="[required]"
              >
                <template #item="{ props, item }">
                  <VListItem
                    v-bind="props"
                    :title="item.raw.company_name"
                    :subtitle="
                      'Pending Amount - ' + getPrice(item.raw.pending_from || 0)
                    "
                  />
                </template>
              </VAutocomplete>
            </VCol>

            <!-- Payment Amount -->
            <VCol
              lg="6"
              cols="12"
            >
              <label class="label">Payment Amount(Rs) *</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.amount"
                placeholder="Payment Amount"
                class="input"
                :rules="[required]"
                @update:model-value="checkCourierAmount"
              />
            </VCol>
          </template>

          <!-- Transport -->
          <template v-else-if="form.expense_type === 'Transport'">
            <VCol
              lg="12"
              cols="12"
            >
              <label class="label">Reason *</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.reason"
                placeholder="e.g. Fuel expense for delivery"
                class="input"
                :rules="[required]"
              />
            </VCol>

            <VCol
              lg="6"
              cols="12"
            >
              <label class="label">Amount(Rs) *</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.amount"
                placeholder="e.g. 5,000"
                class="input"
                :rules="[required]"
              />
            </VCol>
          </template>

          <!-- Sales Rep Commission -->
          <template v-else-if="form.expense_type === 'Sales Rep Commission'">
            <!-- Select Sales Representative -->
            <VCol
              lg="6"
              cols="12"
            >
              <label class="label">Select Sales Representative *</label>
              <div class="mt-2" />
              <VAutocomplete
                v-model="selectedSalesRep"
                :items="salesReps"
                class="input"
                item-title="rep_name"
                item-value="id"
                placeholder="Select Sales Representative"
                return-object
                :rules="[required]"
              >
                <template #item="{ props, item }">
                  <VListItem
                    v-bind="props"
                    :title="item.raw.rep_name"
                    :subtitle="
                      'Rep Due - ' + getPrice(item.raw.rep_due || 0)
                    "
                  />
                </template>
              </VAutocomplete>
            </VCol>

            <!-- Payment Amount -->
            <VCol
              lg="6"
              cols="12"
            >
              <label class="label">Payment Amount(Rs) *</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.amount"
                placeholder="Payment Amount"
                class="input"
                :rules="[required]"
                @update:model-value="checkCommissionAmount"
              />
            </VCol>
          </template>

          <!-- Additional Payment -->
          <template v-else-if="form.expense_type === 'Additional Payment'">
            <VCol
              lg="12"
              cols="12"
            >
              <label class="label">Reason *</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.reason"
                placeholder="e.g. Office maintenance"
                class="input"
                :rules="[required]"
              />
            </VCol>

            <VCol
              lg="6"
              cols="12"
            >
              <label class="label">Amount(Rs) *</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.amount"
                placeholder="e.g. 10,000"
                class="input"
                :rules="[required]"
              />
            </VCol>
          </template>

          <!-- any other category/sub-category - the category/sub-category
          selection itself already conveys the reason, so no free-text
          Reason field here -->
          <template v-else>
            <VCol
              lg="6"
              cols="12"
            >
              <label class="label">Amount(Rs) *</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.amount"
                placeholder="e.g. 10,000"
                class="input"
                :rules="[required]"
              />
            </VCol>
          </template>
        </VRow>

        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            :disabled="!isFormValid"
            :loading="loading"
            @click="addExpense"
          >
            <span class="btn_text">Submit</span>
          </VBtn>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script>
import ExpensesApi from "@/Api/Modules/expenses"
import CouriersApi from "@/Api/Modules/couriers"
import SalesRepApi from "@/Api/Modules/salesrep"
import { toast } from "@/ApiConstance/toast"

export default {
  data() {
    return {
      isFormValid: false,
      loading: false,
      couriers: [],
      salesReps: [],
      selectedCourier: null,
      selectedSalesRep: null,
      statuses: ["Pending", "Confirmed"],
      // top-level "Expense Type" selection - Courier moved under
      // "Transportation & Delivery" as a sub category (see subCategoriesByType)
      expenseTypes: [
        { value: "Additional Payment", label: "Additional Payment" },
        { value: "Sales Rep Commission", label: "Sales Rep Commission" },
        { value: "Cost of Goods Sold", label: "Cost of Goods Sold" },
        { value: "Operating Expenses", label: "Operating Expenses" },
        { value: "Transportation & Delivery", label: "Transportation & Delivery" },
        { value: "Staff Salaries", label: "Staff Salaries" },
        { value: "Office & Admin", label: "Office & Admin" },
        { value: "Financial", label: "Financial" },
        { value: "Miscellaneous", label: "Miscellaneous" },
      ],
      // sub category options per main category - only categories listed
      // here get a second "Sub Category" dropdown
      subCategoriesByType: {
        "Cost of Goods Sold": ["Packaging", "Purchase of trp"],
        "Operating Expenses": [
          "Rent",
          "Utilities (electricity, water, internet)",
          "Office Supplies",
          "Equipment (racks,blub,fan,ac)",
          "supplier",
        ],
        "Transportation & Delivery": [
          "Vehicle Purchase/Lease",
          "Fuel",
          "Driver Salaries",
          "Vehicle Maintenance",
          "Delivery Packaging",
          "Auto fees",
          "Courier",
        ],
        "Staff Salaries": [
          "Sales team",
          "Warehouse staff",
          "Delivery staff",
          "Accountant",
          "Admin & support",
        ],
        "Office & Admin": [
          "Utilities (sim,phone)",
          "Stationery & Supplies",
          "Software (Accounting, inventory)",
        ],
        "Financial": ["Bank Charges", "Loan Interest"],
        "Miscellaneous": [
          "Insurance (stock, Vehicle)",
          "Licenses & renewal Fees",
          "Depreciation On assets",
        ],
      },
      // main category picked in the first dropdown - kept separate from
      // form.expense_type so the visible selection doesn't get overwritten
      // once a sub category (e.g. "Courier") sets the actual submitted value
      mainType: "",
      subCategory: "",
      form: {
        expense_reference_id: "",
        expense_type: "",
        expense_date: "",
        reason: "",
        amount: "",
        status: "Pending",
      },
    }
  },

  async created() {
    this.form.expense_reference_id =
      "EXP-" + Math.floor(Math.random() * 10000000000000)

    await this.getCouriers()
    await this.getSalesReps()
  },

  methods: {
    // get all couriers 
   
    async getCouriers() {
      const res = await CouriersApi.allCouriers({ page: 1, per_page: 1000 })

      this.couriers = res.data.data.data
    },

    // get all sales reps 
    
    async getSalesReps() {
      const res = await SalesRepApi.allSalesReps({ page: 1, per_page: 1000 })

      this.salesReps = res.data.data.data
    },

    // reset the dynamic fields whenever the main expense type changes.
    // a category with sub categories waits for onSubCategoryChange to set
    // the actual submitted value; everything else submits mainType directly
    onTypeChange() {
      this.selectedCourier = null
      this.selectedSalesRep = null
      this.subCategory = ""
      this.form.reason = ""
      this.form.amount = ""
      this.form.expense_type = this.subCategoriesByType[this.mainType]
        ? ""
        : this.mainType
    },

    // the sub category itself is what actually gets submitted as
    // expense_type - e.g. picking "Courier" under "Transportation &
    // Delivery" makes expense_type "Courier", same as it always has been
    onSubCategoryChange() {
      this.selectedCourier = null
      this.form.reason = ""
      this.form.amount = ""
      this.form.expense_type = this.subCategory
    },

    // warn if the entered amount exceeds the courier's pending amount —
    // only relevant when the payment will actually be resolved (Confirmed);
    // a Pending expense doesn't touch the courier's balance
    checkCourierAmount() {
      if (!this.selectedCourier || this.form.status !== "Confirmed") return

      const pending = Number(this.selectedCourier.pending_from || 0)

      if (Number(this.form.amount) > pending) {
        toast(
          "Entered amount exceeds the courier's pending amount of " +
            this.getPrice(pending),
          "error",
          20000,
        )

        this.form.amount = ""
      }
    },

    // warn if the entered amount exceeds the sales rep's due amount —
    // only relevant when the payment will actually be resolved (Confirmed);
    // a Pending expense doesn't touch the sales rep's due
    checkCommissionAmount() {
      if (!this.selectedSalesRep || this.form.status !== "Confirmed") return

      const due = Number(this.selectedSalesRep.rep_due || 0)

      if (Number(this.form.amount) > due) {
        toast(
          "Entered amount exceeds the sales representative's due amount of " +
            this.getPrice(due),
          "error",
          20000,
        )

        this.form.amount = ""
      }
    },

    // add expense
    async addExpense() {
      this.loading = true

      const payload = {
        ...this.form,
        amount: Number(this.form.amount),
        courier_id: this.selectedCourier ? this.selectedCourier.id : null,
        salesrep_id: this.selectedSalesRep ? this.selectedSalesRep.id : null,
      }

      await ExpensesApi.storeExpense(payload)
        .then(() => {
          this.loading = false
          this.$emit("close")
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>
