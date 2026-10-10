<template>
  <div class="report_managemnt mt-9">
    <VRow>
      <VCol
        cols="12"
        md="2"
      >
        <label class="label">Year</label>
        <VSelect
          v-model="selectedYear"
          :items="years"
          class="search_input"
          @update:model-value="onMonthYearChange"
        />
      </VCol>
      <VCol
        cols="12"
        md="2"
      >
        <label class="label">Month</label>
        <VSelect
          v-model="selectedMonth"
          :items="months"
          item-title="title"
          item-value="value"
          class="search_input"
          @update:model-value="onMonthYearChange"
        />
      </VCol>
      <VCol
        cols="12"
        md="2"
      >
        <label class="label">From Date</label>
        <AppDateTimePicker
          v-model="fromDate"
          placeholder="From Date"
          class="search_date"
        />
      </VCol>
      <VCol
        cols="12"
        md="2"
      >
        <label class="label">To Date</label>
        <AppDateTimePicker
          v-model="toDate"
          placeholder="To Date"
          class="search_date"
        />
      </VCol>
      <VCol
        cols="12"
        md="2"
        class="d-flex align-end"
      >
        <VBtn
          class="search_button"
          variant="none"
          :loading="loading"
          @click="search"
        >
          <span class="text">Search</span>
        </VBtn>
      </VCol>
    </VRow>

    <VAlert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ errorMessage }}
    </VAlert>

    <VCard class="mt-8">
      <VSkeletonLoader
        :loading="loading"
        type="table"
      >
        <VDataTable
          :headers="headers"
          :items="payments"
          item-value="id"
          :items-per-page="50"
        >
          <template #top>
            <VToolbar flat>
              <VToolbarTitle>
                <span class="table_topic">Month End Receive</span>
              </VToolbarTitle>
            </VToolbar>
          </template>

          <template #item.payment_date="{ item }">
            {{ item.payment_date || item.received_date || "N/A" }}
          </template>
          <template #item.payment_reference="{ item }">
            {{ item.payment_code || item.receipt_reference || item.id || "N/A" }}
          </template>
          <template #item.customer_name="{ item }">
            {{ item.shop?.shop_name || item.party_name || "N/A" }}
          </template>
          <template #item.payment_method="{ item }">
            {{ item.payment_method || "N/A" }}
          </template>
          <template #item.check_no="{ item }">
            {{ item.check_no || "N/A" }}
          </template>
          <template #item.invoices="{ item }">
            <span v-if="item.payment_invoices?.length">
              {{ item.payment_invoices.map((invoice) => invoice.order_reference_id).filter(Boolean).join(", ") }}
            </span>
            <span v-else>N/A</span>
          </template>
          <template #item.payment_amount="{ item }">
            {{ getPrice(item.payment_amount) }}
          </template>
        </VDataTable>
      </VSkeletonLoader>
      <VCardText class="d-flex justify-end font-weight-bold">
        Total Received Amount: {{ getPrice(totalReceivedAmount) }}
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import PaymentApi from "@/Api/Modules/payments"
import mixin from "@/mixins/commonmixins"

const PER_PAGE = 1000
const today = new Date()
const currentYear = today.getFullYear()
const selectedYear = ref(currentYear)
const selectedMonth = ref(today.getMonth() + 1)
const years = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index)

const months = [
  { title: "January", value: 1 },
  { title: "February", value: 2 },
  { title: "March", value: 3 },
  { title: "April", value: 4 },
  { title: "May", value: 5 },
  { title: "June", value: 6 },
  { title: "July", value: 7 },
  { title: "August", value: 8 },
  { title: "September", value: 9 },
  { title: "October", value: 10 },
  { title: "November", value: 11 },
  { title: "December", value: 12 },
]

const fromDate = ref("")
const toDate = ref("")
const payments = ref([])
const loading = ref(false)
const errorMessage = ref("")
const getPrice = mixin.methods.getPrice

const headers = [
  { title: "Received Date", key: "payment_date", align: "start" },
  { title: "Payment / Receipt Reference", key: "payment_reference", align: "start" },
  { title: "Customer / Party Name", key: "customer_name", align: "start" },
  { title: "Payment Method", key: "payment_method", align: "start" },
  { title: "Check No", key: "check_no", align: "start" },
  { title: "Invoice References", key: "invoices", align: "start" },
  { title: "Received Amount (Rs.)", key: "payment_amount", align: "end" },
]

const totalReceivedAmount = computed(() => payments.value.reduce(
  (total, payment) => total + (Number(payment.payment_amount) || 0),
  0,
))

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function monthDateRange() {
  const start = new Date(selectedYear.value, selectedMonth.value - 1, 1)
  const end = new Date(selectedYear.value, selectedMonth.value, 0)

  return { startdate: formatDate(start), enddate: formatDate(end) }
}

function onMonthYearChange() {
  fromDate.value = ""
  toDate.value = ""
  loadReport()
}

async function search() {
  if (fromDate.value || toDate.value) {
    if (!fromDate.value || !toDate.value) {
      errorMessage.value = "Select both a From Date and a To Date."
      
      return
    }
    if (fromDate.value > toDate.value) {
      errorMessage.value = "From Date must be on or before To Date."
      
      return
    }
  }

  await loadReport()
}

async function loadReport() {
  loading.value = true
  errorMessage.value = ""

  const dateRange = fromDate.value && toDate.value
    ? { startdate: fromDate.value, enddate: toDate.value }
    : monthDateRange()

  /* eslint-disable camelcase */
  const params = {
    shop_id: "",
    searchdata: "",
    startdate: dateRange.startdate,
    enddate: dateRange.enddate,
    payment_status: "Recieved",
  }
  /* eslint-enable camelcase */

  try {
    const allPayments = await fetchAllPayments(params)
    const uniquePayments = new Map()

    allPayments
      .filter(payment => ["received", "recieved"].includes(
        String(payment.status || payment.payment_status || "").toLowerCase(),
      ))
      .forEach((payment, index) => {
        const key = String(payment.id ?? payment.payment_code ?? index)
        if (!uniquePayments.has(key)) uniquePayments.set(key, payment)
      })

    payments.value = [...uniquePayments.values()]
  } catch (error) {
    payments.value = []
    errorMessage.value =
      error?.response?.data?.message || "Unable to load received payments."
  } finally {
    loading.value = false
  }
}

async function fetchAllPayments(filters) {
  const allPayments = []
  let page = 1
  let lastPage = 1

  do {
    /* eslint-disable camelcase */
    const response = await PaymentApi.allShopPayments({
      ...filters,
      page,
      per_page: PER_PAGE,
    })
    /* eslint-enable camelcase */

    const pagination = response?.data?.data

    allPayments.push(...(pagination?.data || []))
    lastPage = Number(pagination?.last_page) || 1
    page += 1
  } while (page <= lastPage)

  return allPayments
}

onMounted(loadReport)
</script>
