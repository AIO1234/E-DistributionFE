<template>
  <div class="mt-9 masterdata">
    <!-- seach boxes -->
    <div>
      <v-row>
        <v-col lg="6" class="text-right" cols="12"> </v-col>
        <!-- create Product -->
        <v-col lg="6" class="text-right" cols="12">
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
          <v-btn class="search_button" variant="none" @click="getAllProducts()"
            ><span class="text">Search</span></v-btn
          >
        </v-col>

        <!-- clear button -->
        <v-col lg="2" cols="12">
          <v-btn class="clear_button" variant="none" @click="clear()"
            ><span class="text">Clear</span></v-btn
          >
        </v-col>
        <!-- exfort button -->
        <v-col lg="4" cols="12">
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
        <Table :Products="Products" :loading="loading" @close="closeModal" />
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
      Products: [],
      loading: false,
      searchdata: "",
      collumns: {
        "Product Code": "product_code",
        "Product Name": "product_name",
        "Product Type": "product_type",
        "Product Weight": "product_weight",
        "Product Volume": "product_volume",
        "Expre Date": "expire_date",
        "Manufacture Date": "manufacture_date",
        "Distributor Commision": "distributer_commision",
        "SalesRep Commision": "salesrep_commision",
        "Sales Quantity": "quantity",
        "Product Amount(Rs)": "product_amount",
        "Return Quantity": "return_quantity",
        "Return Quantity": "return_value",
        "Final Quantity": "final_quantity",
        "Final Amount(Rs)": "final_value",
        "Last Updated By": "last_updated_by",
      },
    };
  },
  components: {
    Table,
    Create,
    downloadExcel: JsonExcel,
  },

  async created() {
    await this.getAllProducts();
  },

  methods: {
    // get all  Products
    async getAllProducts() {
      // initialize payload
      const payload = {
        searchdata: this.searchdata,
      };
      this.loading = true;
      const res = await ProductsApi.allProducts(payload);
      this.Products = res.data.data;
      this.loading = false;
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
      await this.getAllProducts();
    },
  },
};
</script>
