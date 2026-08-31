<template>
  <div class="payment_management mt-9">
    <v-row>
      <!-- select supplier -->
      <v-col lg="6">
        <label class="label">Select Supplier</label>
        <div class="pt-2"></div>
        <v-autocomplete
          placeholder="Select Supplier"
          v-model="supplier"
          :items="suppliers"
          item-title="suplier_name"
          item-value="id"
          return-object
          @update:model-value="supplierPayment('search')"
          class="shop_select_button"
        ></v-autocomplete>
      </v-col>
      <!-- add supplier payment -->
      <v-col lg="6" cols="12" class="text-right">
        <div class="pt-6"></div>
        <v-btn
          class="payment_create_button"
          variant="none"
          :disabled="!supplier"
          @click="showAddModal = true"
        >
          <template v-slot:prepend>
            <img src="@/assets/images/IconsSolid.png" />
          </template>
          <span class="text">Add Supplier Payment</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- header searches -->
    <div class="pt-15" v-if="supplier">
      <v-row>
        <!-- search reference id -->
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Payment Ref Id.."
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="tabler-search"></v-icon>
            </template>
          </v-text-field>
        </v-col>

        <!-- start paid date -->
        <v-col lg="2" cols="12">
          <AppDateTimePicker
            v-model="startdate"
            placeholder="Start Paid Date"
            class="search_date"
          />
        </v-col>

        <!-- end paid date -->
        <v-col lg="2" cols="12">
          <AppDateTimePicker
            v-model="enddate"
            placeholder="End Paid Date"
            class="search_date"
          />
        </v-col>

        <!-- search button -->
        <v-col lg="3" cols="12">
          <v-btn
            class="search_button"
            variant="none"
            @click="supplierPayment('search')"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="clearFilters"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>

        <!-- select payment status -->
        <v-col lg="3" cols="12">
          <label class="label">Select Payment Status</label>
          <div class="pt-2"></div>
          <v-autocomplete
            placeholder="Select Payment Status.."
            v-model="payment_status"
            :items="['Pending', 'Confirmed']"
            @update:model-value="supplierPayment('search')"
            class="search_input"
          ></v-autocomplete>
        </v-col>

        <!-- export button -->
        <v-col lg="3" cols="12">
          <div class="pt-8"></div>
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="exportPayments"
              :fields="headers"
              worksheet="All supplier payments"
              :name="
                supplier
                  ? `as of ${todaydate} ${supplier.suplier_name} payments.xls`
                  : `as of ${todaydate} all supplier payments.xls`
              "
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="pt-12">
      <!-- table -->
      <v-card>
        <SupplierPaymentTable
          :payments-data="supplierpayments"
          :loading="loading"
          :total-items="totalItems"
          :current-page="page"
          :items-per-page="itemsPerPage"
          @refresh="supplierPayment('search')"
          @pagechange="pageChange"
          @pagesizechange="pageSizeChange"
        />
      </v-card>
    </div>

    <!-- add supplier payment dialog -->
    <v-dialog v-model="showAddModal" max-width="900px" persistent scrollable="">
      <v-card>
        <v-card-text>
          <CreateSupplierPayment
            :supplier="supplier"
            @close-modal="closeModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SupplierPaymentTable from "@/views/PaymentManagement/SupplierPayments/Components/SupplierPaymentTable.vue";
import CreateSupplierPayment from "@/views/PaymentManagement/SupplierPayments/Components/CreateSupplierPayment.vue";
import SupplierPaymentApi from "@/Api/Modules/supplier_payments";
import SupplyChainApi from "@/Api/Modules/supply_chain";
import JsonExcel from "vue-json-excel3";
import mixin from "@/mixins/commonmixins";

export default {
  components: {
    SupplierPaymentTable,
    CreateSupplierPayment,
    downloadExcel: JsonExcel,
  },
  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD",
      ),
      searchdata: "",
      startdate: "",
      enddate: "",
      showAddModal: false,
      suppliers: [],
      supplier: "",
      supplierpayments: [],
      exportPayments: [],
      loading: false,
      payment_status: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
      headers: {
        "Payment Ref": "payment_reference_id",
        Supplier: "suplier.suplier_name",
        Date: "payment_date",
        "Amount(Rs)": "total_amount",
        Method: "payment_method",
        Status: "payment_status",
      },
    };
  },

  async created() {
    await this.getAllSuppliers();
    await this.supplierPayment();
  },
  methods: {
    // get all suppliers
    async getAllSuppliers() {
      this.loading = true;
      const res = await SupplyChainApi.AllSuppliers({ searchdata: "", page: 1, per_page: 1000 });
      this.suppliers = res.data.data.data;
      this.loading = false;
    },

    // get payments for the selected supplier (or every supplier, for
    // admin-facing roles, when none is selected) - resets to page 1 since
    // the previous page may not exist anymore under the new filters
    async supplierPayment(mode = "normal") {
      // reset searches
      if (mode === "normal") {
        this.searchdata = "";
        this.startdate = "";
        this.enddate = "";
        this.payment_status = "";
      }

      this.page = 1;
      await this.getSupplierPayments();
      await this.getExportPayments();
    },

    // fetch the current page of payments using the current filters/page state
    async getSupplierPayments() {
      this.loading = true;

      const payload = {
        suplier_id: this.supplier ? this.supplier.id : "",
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        payment_status: this.payment_status,
        page: this.page,
        per_page: this.itemsPerPage,
      };

      const res = await SupplierPaymentApi.getAllSupplierPayments(payload);
      const pagination = res.data.data;

      this.supplierpayments = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;

      this.loading = false;
    },

    // full filtered dataset (uncapped) for the Export button, since the
    // table itself only ever holds one page of results
    async getExportPayments() {
      const payload = {
        suplier_id: this.supplier ? this.supplier.id : "",
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
        payment_status: this.payment_status,
        page: 1,
        per_page: 100000,
      };

      const res = await SupplierPaymentApi.getAllSupplierPayments(payload);
      this.exportPayments = res.data.data.data;
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getSupplierPayments();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getSupplierPayments();
    },

    // clear search filters but keep the selected supplier
    async clearFilters() {
      await this.supplierPayment("normal");
    },

    // close the add-payment dialog, refreshing the list if a payment was created
    async closeModal(data) {
      this.showAddModal = false;
      if (data === "load") {
        await this.supplierPayment("search");
      }
    },
  },
};
</script>
