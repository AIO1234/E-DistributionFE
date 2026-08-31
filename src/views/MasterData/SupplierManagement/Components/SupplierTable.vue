<template>
  <div>
    <!-- supplier table -->
    <VSkeletonLoader
      :loading="loading"
      height="240"
      type="image, list-item-two-line"
    >
      <VDataTableServer
        :headers="filteredHeaders"
        :items="tabledata"
        :items-length="totalItems"
        :page="currentPage"
        :items-per-page="itemsPerPage"
        @update:page="onPage"
        @update:items-per-page="onPerPage"
      >
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <center>
                <span class="table_topic">All Suppliers</span>
              </center>
            </VToolbarTitle>
          </VToolbar>
        </template>
        <!-- contents  -->
        <template
          v-for="header in filteredHeaders"
          :key="header.value"
          #[`item.${header.key}`]="props"
        >
          <!-- name -->
          <div v-if="header.key === 'name'">
            <span v-if="props.item.suplier_name !== null">
              {{ props.item.suplier_name }}</span
            >
            <span v-else> N/A </span>
          </div>

          <!-- email -->
          <div v-if="header.key === 'email'">
            <span v-if="props.item.email !== null">
              {{ props.item.email }}</span
            >
            <span v-else> N/A </span>
          </div>

          <!-- phone -->
          <div v-if="header.key === 'phone'">
            <span v-if="props.item.contact_no !== null">
              {{ props.item.contact_no }}</span
            >
            <span v-else> N/A </span>
          </div>

          <!-- last purchase date -->
          <div v-if="header.key === 'lastpurchasedate'">
            <span v-if="props.item.purchases_count > 0">
              {{ props.item.last_purchase_date }}
            </span>
            <span v-else> N/A </span>
          </div>

          <div v-if="header.key === 'purchasescount'">
            {{ props.item.purchases_count }}
          </div>

          <div v-if="header.key === 'purchasestotal'">
            <span v-if="props.item.purchases_count > 0">
              {{ getPriceWithStrings(props.item.purchases_total) }}
            </span>
            <span v-else> N/A </span>
          </div>

          <!-- showroom distributed total -->
          <div v-if="header.key === 'showroomdistributedtotal'">
            <span v-if="props.item.showroom_distributed_total > 0">
              {{ getPriceWithStrings(props.item.showroom_distributed_total) }}
            </span>
            <span v-else> N/A </span>
          </div>

          <!-- paid amount -->
          <div v-if="header.key === 'paidamount'">
            {{ getPriceWithStrings(props.item.total_payments) }}
          </div>

          <!-- due amount -->
          <div v-if="header.key === 'dueamount'">
            {{ getPriceWithStrings(props.item.due_payments) }}
          </div>

          <!-- credit balance -->
          <div v-if="header.key === 'creditbalance'">
            {{ getPriceWithStrings(props.item.credit_balance) }}
          </div>

          <div v-if="header.key === 'summaryaction'">
            <VBtn
              color="transparent"
              variant="none"
              @click="$router.push(`/supply_summary/${props.item.id}`)"
            >
              <VIcon icon="tabler-eye-filled" start size="large" />
            </VBtn>
          </div>
          <div v-if="header.key === 'productaction'">
            <VBtn
              color="transparent"
              variant="none"
              @click="
                $router.push({
                  name: 'add_purchase_order',
                  params: {
                    id: props.item.id,
                    name: props.item.suplier_name,
                  },
                  query: $route.query,
                })
              "
            >
              <img style="width: 17px" src="@images/plus.png" />
            </VBtn>
          </div>
        </template>
      </VDataTableServer>
    </VSkeletonLoader>
  </div>
</template>

<script>
export default {
  props: {
    tabledata: Array,
    loading: Boolean,
    totalItems: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 50,
    },
  },

  emits: ["edit-supplier", "pagechange", "pagesizechange"],

  created() {
    this.getAuthUser();
  },

  computed: {
    // Data Operator may only see supplier identity (name / contact) + the
    // "Create Order" action to enter purchase invoices - every financial
    // column (paid / due / credit / purchase totals) and the Summary link
    // are hidden for that role
    filteredHeaders() {
      if (this.authRole !== "Data Operator") return this.headers;

      const allowed = [
        "name",
        "email",
        "phone",
        "lastpurchasedate",
        "productaction",
      ];

      return this.headers.filter((h) => allowed.includes(h.key));
    },
  },

  data() {
    return {
      authRole: "",
      headers: [
        {
          title: "Name",
          align: "start",
          key: "name",
        },
        { title: "Email", align: "start", key: "email" },
        { title: "Phone Number", align: "start", key: "phone" },
        {
          title: "Last Purchase date",
          align: "start",
          key: "lastpurchasedate",
        },
        { title: "Purchases Count", align: "start", key: "purchasescount" },
        { title: "Purchases Total", align: "start", key: "purchasestotal" },
        {
          title: "Showroom Distributed Total",
          align: "start",
          key: "showroomdistributedtotal",
        },
        { title: "Paid Amount", align: "start", key: "paidamount" },
        { title: "Due Amount", align: "start", key: "dueamount" },
        { title: "Credit Balance", align: "start", key: "creditbalance" },
        { title: "Summary", align: "start", key: "summaryaction" },
        { title: "Create Order", align: "start", key: "productaction" },
      ],
    };
  },

  methods: {
    // page change
    onPage(page) {
      this.$emit("pagechange", { page });
    },

    // items-per-page change
    onPerPage(perPage) {
      this.$emit("pagesizechange", {
        page: 1,
        per_page: perPage == -1 ? 10000 : perPage,
      });
    },

    // get price with strings
    getPriceWithStrings(value) {
      const amount = Number(value || 0);

      return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
};
</script>
