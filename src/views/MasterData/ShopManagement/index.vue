<template>
  <div class="mt-9 masterdata">
    <div class="pt-12">
      <v-row>
        <!-- search shop -->
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Search Shop"
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="tabler-search"></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <!-- create order + export -->
        <v-col lg="9" class="text-right" cols="12">
          <!-- export only shops with an outstanding due balance ( > 0 );
               pulls every shop (not just the current page) then filters -->
          <download-excel
            class="d-inline-block me-3"
            :fetch="fetchDueCustomers"
            :fields="exportFields"
            worksheet="Customer Due Balances"
            :name="`shop due balances ${today}.xls`"
            :before-generate="() => (exportLoading = true)"
            :before-finish="() => (exportLoading = false)"
          >
            <v-btn class="create_btn" variant="none" :loading="exportLoading">
              <span class="text">Export Due Customers</span>
            </v-btn>
          </download-excel>

          <v-btn class="create_btn" variant="none" @click="show = true">
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Create Shop</span>
          </v-btn>
        </v-col>
      </v-row>

      <div class="pt-12"></div>
      <!-- table -->
      <v-card>
        <Table
          :Shops="Shops"
          :loading="loading"
          :totalItems="totalItems"
          :currentPage="page"
          :itemsPerPage="itemsPerPage"
          @close="closeModal"
          @pagechange="pageChange"
          @pagesizechange="pageSizeChange"
        />
      </v-card>
    </div>

    <!-- create dialog -->

    <v-dialog
      v-model="show"
      max-width="758.3px"
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

        <v-card-text> <Create @close="closeModal" /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import JsonExcel from "vue-json-excel3";
import Table from "./Components/Table.vue";
import Create from "./Components/Create.vue";
import ShopsApi from "@/Api/Modules/shop";
export default {
  data() {
    return {
      show: false,
      Shops: [],
      loading: false,
      searchdata: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
      exportLoading: false,
      today: new Date().toISOString().slice(0, 10),
      // columns for the "due customers" export
      exportFields: {
        "Shop Code": "shop_code",
        "Shop Name": "shop_name",
        Mobile: "shop_mobile",
        Address: "shop_address",
        "Area Code": "area_code",
        "Area Name": "area_name",
        "Due Amount(Rs)": "due_amount",
        "Paid Amount(Rs)": "paid_amount",
      },
    };
  },
  components: {
    Table,
    Create,
    downloadExcel: JsonExcel,
  },

  watch: {
    // re-search server-side as the user types (debounced), same live-filter
    // feel as before but no longer limited to whatever page was loaded
    searchdata() {
      if (!this.debouncedSearch) {
        this.debouncedSearch = this.debounce(() => this.search(), 400);
      }

      this.debouncedSearch();
    },
  },

  async created() {
    await this.getAllShops();
  },

  methods: {
    // get Shops. Default: the current page, stored into the table state.
    // Pass { all: true } to pull every shop in one request and just return
    // the rows without touching the table or its loading state - the export
    // uses that so there's a single place that calls ShopsApi.allShops.
    async getAllShops({ all = false } = {}) {
      if (!all) this.loading = true;

      const res = await ShopsApi.allShops({
        seacrh_data: all ? "" : this.searchdata,
        page: all ? 1 : this.page,
        per_page: all ? 100000 : this.itemsPerPage,
      });
      const pagination = res.data.data;

      if (!all) {
        this.Shops = pagination.data;
        this.totalItems = pagination.total;
        this.page = pagination.current_page;
        this.itemsPerPage = pagination.per_page;
        this.loading = false;
      }

      return pagination.data;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getAllShops();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getAllShops();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getAllShops();
    },

    // close
    async closeModal() {
      this.show = false;
      // call Shops
      await this.getAllShops();
    },

    // rows for the Export button: every shop that currently owes money.
    // getAllShops({ all: true }) does the (single) API call and returns the
    // full list without disturbing the paginated table.
    async fetchDueCustomers() {
      const all = await this.getAllShops({ all: true });

      return (all || [])
        .filter((shop) => Number(shop.Uptodate_due_amounts || 0) > 0)
        .map((shop) => ({
          shop_code: shop.shop_code,
          shop_name: shop.shop_name,
          shop_mobile: shop.shop_mobile || "",
          shop_address: shop.shop_address || "",
          area_code: shop.area ? shop.area.area_code : shop.area_code || "",
          area_name: shop.area ? shop.area.area_name : shop.area_name || "",
          due_amount: Number(shop.Uptodate_due_amounts || 0),
          paid_amount: Number(shop.uptodate_paid_amounts || 0),
        }));
    },
  },
};
</script>
