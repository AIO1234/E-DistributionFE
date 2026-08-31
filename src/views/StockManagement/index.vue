<template>
  <div class="mt-9 masterdata">
    <!-- seach boxes -->
    <div>
      <v-row>
        <v-col lg="6" class="text-right" cols="12"> </v-col>
        <!-- create Product - Super Admin / Admin only -->
        <v-col lg="6" class="text-right" cols="12" v-if="canManageStock">
          <v-btn class="create_btn" variant="none" @click="show = true">
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Create Product</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <!-- search product number orname -->
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Product Code Or Name.."
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="tabler-search"></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <!-- search button -->
        <v-col lg="3" cols="12">
          <v-btn class="search_button" variant="none" @click="search()"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="clear()"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>
        <!-- exfort button - Super Admin only -->
        <v-col lg="4" cols="12" v-if="isSuperAdmin">
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="Products"
              :fields="collumns"
              worksheet="Stock Report"
              :name="`as of ${todaydate} stockreport.xls`"
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <!-- content -->
    <div class="pt-7">
      <div class="pt-12"></div>
      <!-- table -->
      <v-card>
        <Table
          :Products="Products"
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
import ProductsApi from "@/Api/Modules/products";
import mixin from "@/mixins/commonmixins";

export default {
  data() {
    return {
      todaydate: mixin.methods.momentFormat(
        new Date(new Date().setDate(new Date().getDate())),
        "YYYY-MM-DD"
      ),
      show: false,
      authRole: "",
      Products: [],
      loading: false,
      searchdata: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
      // export columns map to the actual product fields shown in the table -
      // the previous map referenced sales-report fields that don't exist on
      // a product row, so the export came out with only code + name filled
      collumns: {
        "Product Code": "product_code",
        "Product Name": "product_name",
        "Model Number": "model_number",
        "Category": "category.category_name",
        "Product Cost(Rs)": "product_cost",
        "Minimum Selling Price(Rs)": "min_selling_price",
        "Maximum Selling Price(Rs)": "max_selling_price",
        "Product Stock": "stock_count",
        "Damage Stock": "damaged_stock_count",
        "Expire Date": "expire_date",
        "Manufacture Date": "manufacture_date",
        "Last Updated By": "last_updated_by",
      },
    };
  },
  components: {
    Table,
    Create,
    downloadExcel: JsonExcel,
  },

  computed: {
    // only Super Admin may add or edit stock - Admin, Staff and Data
    // Operator are view-only here (Admin/Data Operator can replace a
    // product image via the row action), matching the backend Add Stock /
    // Edit Stock permission which only Super Admin now holds
    canManageStock() {
      return this.authRole === "Super Admin";
    },

    // the stock export is Super Admin only
    isSuperAdmin() {
      return this.authRole === "Super Admin";
    },
  },

  async created() {
    this.getAuthUser();
    await this.getAllProducts();
  },

  methods: {
    // get all  Products
    async getAllProducts() {
      // initialize payload
      const payload = {
        searchdata: this.searchdata,
        page: this.page,
        per_page: this.itemsPerPage,
      };
      this.loading = true;
      const res = await ProductsApi.allProducts(payload);
      const pagination = res.data.data;

      this.Products = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;
      this.loading = false;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getAllProducts();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getAllProducts();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getAllProducts();
    },

    // close
    async closeModal() {
      this.show = false;
      // call Products
      await this.getAllProducts();
    },

    // clear search
    async clear() {
      this.searchdata = "";
      this.page = 1;
      await this.getAllProducts();
    },
  },
};
</script>
