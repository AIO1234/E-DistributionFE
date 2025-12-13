<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      height="240"
      type="image, list-item-two-line"
      style="background-color: transparent"
    >
      <v-responsive>
        <v-data-table
          :headers="headers"
          :items="shoppayments"
          items-per-page="100"
        >
          <!-- contents -->
          <template
            v-for="header in headers"
            :key="header.value"
            v-slot:[`item.${header.key}`]="props"
          >
            <!-- payment code -->
            <div v-if="header.key === 'payment_code'">
              {{ props.item.payment_code }}
            </div>

            <!-- payment invoice -->
            <div v-if="header.key === 'payment_invoices'">
              <div
                v-for="invoice in props.item.payment_invoices"
                :key="invoice"
              >
                <span>
                  {{ invoice.order_reference_id }} - {{ invoice.pivot.status }}
                </span>
              </div>
            </div>

            <!-- payment date -->
            <div v-if="header.key === 'payment_date'">
              <span> {{ props.item.payment_date }}</span>
            </div>

            <!-- payment amount -->
            <div v-if="header.key === 'payment_amount'">
              <span>
                {{ getPrice(props.item.payment_amount) }}
              </span>
            </div>

            <!-- payment method -->
            <div v-if="header.key === 'payment_method'">
              <span>
                {{ props.item.payment_method }}
              </span>
            </div>

            <!-- payment method -->
            <div v-if="header.key === 'check_no'">
              <span>
                {{ props.item.check_no }}
              </span>
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
                    @click="openUpdateModal(props.item)"
                  >
                    <img src="@/assets/images/edit.png" style="width: 70%" />
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>
          </template>
        </v-data-table>
      </v-responsive>
    </v-skeleton-loader>

    <!--update payment dialog -->

    <v-dialog
      v-model="show"
      max-width="814px"
      min-height="217px"
      persistent
      scrollable=""
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="show = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
              />
            </svg>
          </v-btn>
        </div>

        <v-card-text>
          <UpdateForm
            :shop="shop"
            @close="closeModal"
            :selectedItem="selectedItem"
          /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import UpdateForm from ".//UpdatePayment.vue";
export default {
  data() {
    return {
      show: false,
      selectedItem: {},
      headers: [
        { title: "Payment ID", align: "start", key: "payment_code" },
        { title: "Invoice No/S", align: "start", key: "payment_invoices" },
        { title: "Payment Date", align: "start", key: "payment_date" },
        { title: "Paid Amount(Rs)", align: "start", key: "payment_amount" },
        { title: "Payment Method", align: "start", key: "payment_method" },
        { title: "Check No", align: "start", key: "check_no" },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
    };
  },
  components: {
    UpdateForm,
  },
  props: {
    shop: Object,
    loading: Boolean,
    shoppayments: Array,
  },
  methods: {
    // close modal
    closeModal() {
      this.show = false;
      this.$emit("close");
    },
    // open updte modal

    openUpdateModal(item) {
      this.selectedItem = item;
      this.show = true;
    },
  },
};
</script>
