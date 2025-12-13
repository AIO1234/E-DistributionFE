<template>
  <div class="order_management mt-9">
    <div>
      <!-- create button -->
      <div class="text-right">
        <v-btn class="order_create_button" variant="none" @click="show = true">
          <template v-slot:prepend>
            <img src="@/assets/images/IconsSolid.png" />
          </template>
          <span class="text">Create Order</span>
        </v-btn>
      </div>
      <!-- search section -->
      <div class="pt-15">
        <v-row>
          <!-- search data -->
          <v-col lg="3" cols="12">
            <v-text-field
              v-model="searchdata"
              placeholder="Order Or Invoice Number.."
              class="search_input"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="tabler-search"></v-icon>
              </template>
            </v-text-field>
          </v-col>

          <!-- start order date -->
          <v-col lg="2" cols="12">
            <AppDateTimePicker
              v-model="startdate"
              placeholder="Start Order Date"
              class="search_date"
            >
            </AppDateTimePicker>
          </v-col>

          <!-- end order date -->
          <v-col lg="2" cols="12">
            <AppDateTimePicker
              v-model="enddate"
              placeholder="End Order Date"
              class="search_date"
            >
            </AppDateTimePicker>
          </v-col>

          <!-- search button -->
          <v-col lg="3" cols="12">
            <v-btn class="search_button" variant="none" @click="getAlOrders()"
              ><span class="text">Search</span></v-btn
            >
          </v-col>

          <!-- clear button -->
          <v-col lg="2" cols="12">
            <v-btn class="clear_button" variant="none" @click="clear()"
              ><span class="text">Clear</span></v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <!-- exfort button -->
          <v-col lg="3" cols="12">
            <v-btn class="exfort_button" variant="none">
              <download-excel
                :data="factoryOrders"
                :fields="headers"
                worksheet="All Factory Orders"
                :name="`as of ${todaydate} allfactoryorders.xls`"
              >
                <span class="text">Export</span>
              </download-excel>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="pt-12">
      <!-- table -->
      <v-card>
        <Table
          :FactryOrders="factoryOrders"
          :loading="loading"
          @close="closeModal"
        />
      </v-card>
    </div>

    <!-- create dialog -->

    <v-dialog
      v-model="show"
      max-width="808.3px"
      min-height="216.97px"
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

        <v-card-text> <CreateOrder @close="closeModal" /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import Table from "./Components/OrderTable.vue";
import CreateOrder from "./Components/CreateOrder.vue";
import OrderApi from "@/Api/Modules/master_order";
import JsonExcel from "vue-json-excel3";
import mixin from "@/mixins/commonmixins";

export default {
  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD"
      ),
      searchdata: "",
      startdate: "",
      enddate: "",
      show: false,
      factoryOrders: [],
      loading: false,
      headers: {
        "Order Id": "order_reference_id",
        "Invoice No": "invoice_no",
        Amount: "amount",
        Date: "date",
        Status: "status",
        "Last Updated By": "last_updated_by",
      },
    };
  },
  components: {
    Table,
    CreateOrder,
    downloadExcel: JsonExcel,
  },

  async created() {
    await this.getAlOrders();
  },

  methods: {
    // get all factory orders
    async getAlOrders() {
      const payload = {
        searchdata: this.searchdata,
        startdate: this.startdate,
        enddate: this.enddate,
      };

      this.loading = true;
      const res = await OrderApi.allFactoryOrders(payload);
      this.factoryOrders = res.data.data;
      this.loading = false;
    },
    // close order create
    async closeModal() {
      this.show = false;
      // call orders
      await this.getAlOrders();
    },

    // clear searches

    async clear() {
      // reset searches
      this.searchdata = "";
      this.startdate = "";
      this.enddate = "";
      await this.getAlOrders();
    },
  },
};
</script>
