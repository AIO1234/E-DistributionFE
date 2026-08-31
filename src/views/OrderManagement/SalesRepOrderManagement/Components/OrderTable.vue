<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table-server
          :headers="headers"
          :items="SalesRepOrders"
          :items-length="totalItems"
          :page="currentPage"
          :items-per-page="itemsPerPage"
          @update:page="onPage"
          @update:items-per-page="onPerPage"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                ><center>
                  <span class="table_topic">SalesReps Orders</span>
                </center></v-toolbar-title
              >
            </v-toolbar>
          </template>
          <!-- contents -->
          <template
            v-for="header in headers"
            :key="header.value"
            v-slot:[`item.${header.key}`]="props"
          >
            <!-- distributor name -->
            <div v-if="header.key === 'distributer_name'">
              {{ props.item.distributer.distributer_name }}
            </div>

            <!-- salesrep name -->
            <div v-if="header.key === 'rep_name'">
              {{ props.item.salesrep.rep_name }}
            </div>
            <!-- order reference id -->
            <div v-if="header.key === 'order_reference_id'">
              {{ props.item.order_reference_id }}
            </div>

            <!-- invoice no -->
            <div v-if="header.key === 'invoice_no'">
              <span> {{ props.item.invoice_no }}</span>
            </div>

            <!-- order date -->
            <div v-if="header.key === 'order_date'">
              <span> {{ props.item.order_date }}</span>
            </div>

            <!-- order amount -->
            <div v-if="header.key === 'order_amount'">
              <span>
                {{ props.item.order_amount }}
              </span>
            </div>

            <!-- remaining quantity per product -->
            <div v-if="header.key === 'remaining_quantity'">
              <v-list density="compact" class="remaining_quantity_list">
                <v-list-item
                  v-for="product in props.item.distributer_salesrep_order_items"
                  :key="product"
                  class="px-0"
                  min-height="auto"
                >
                  {{ makeUpperCase(product.product_code) }} -
                  {{ makeUpperCase(product.product_name) }}:
                  <span class="remaining_quantity_value">{{
                    product.pivot.uptodate_quantity
                  }}</span>
                  / {{ product.pivot.quantity }}
                </v-list-item>
              </v-list>
            </div>
            <!-- distribution -->
            <div v-if="header.key === 'distribution'">
              <v-row>
                <v-col lg="2">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      this.$router.push({
                        name: 'sendshop',
                        params: {
                          main_order_id: props.item.main_order_id ?? 'null',
                          distributer_id: props.item.distributer_id,
                          distributer_order_id: props.item.disorder_id,
                          sales_rep_id: props.item.salesrep_id,
                          reporder_id: props.item.id,
                          position: 'no',
                        },
                      })
                      // $router.push(
                      //   `/sendshop/${props.item.main_order_id}/${props.item.distributer_id}/${props.item.disorder_id}/${props.item.salesrep_id}/${props.item.id}`
                      // )
                    "
                  >
                    <img src="@/assets/images/plus.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>

            <!-- status -->
            <div v-if="header.key === 'status'">
              <span>
                {{ props.item.status }}
              </span>
            </div>

            <!-- action -->
            <div v-if="header.key === 'action'">
              <v-row>
                <v-col lg="2">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      $router.push(
                        `/ordersummary/salesreporder/${props.item.id}`,
                      )
                    "
                  >
                    <img src="@/assets/images/eye.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>

            <!-- download invoice -->
            <div v-if="header.key === 'download_invoice'">
              <v-btn
                color="primary"
                @click="$router.push(`/salesreporderinvoice/${props.item.id}`)"
                ><span> View Invoice</span>
              </v-btn>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>
          </template>
        </v-data-table-server>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        { title: "Rep Name", align: "start", key: "rep_name" },
        {
          title: "Distributed Order ID",
          align: "start",
          key: "order_reference_id",
        },
        { title: "Distributed Invoice No", align: "start", key: "invoice_no" },
        { title: "Date", align: "start", key: "order_date" },
        { title: "Amount(Rs)", align: "start", key: "order_amount" },
        {
          title: "Remaining Qty",
          align: "start",
          key: "remaining_quantity",
        },
        { title: "Distribute", align: "start", key: "distribution" },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
        { title: "Invoice", align: "start", key: "download_invoice" },
        {
          title: "Distributor Name",
          align: "start",
          key: "distributer_name",
        },

        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
    };
  },

  props: {
    SalesRepOrders: Array,
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
  },
};
</script>
