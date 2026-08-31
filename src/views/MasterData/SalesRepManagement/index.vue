<template>
  <div class="mt-9 masterdata">
    <div class="pt-12">
      <v-row>
        <!-- search sales rep -->
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Search Sales Rep"
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="tabler-search"></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <!-- create order -->
        <v-col lg="9" class="text-right" cols="12">
          <v-btn class="create_btn" variant="none" @click="show = true">
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Create Sales Rep</span>
          </v-btn>
        </v-col>
      </v-row>

      <div class="pt-12"></div>
      <!-- table -->
      <v-card>
        <Table
          :SalesReps="SalesReps"
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
import Table from "./Components/Table.vue";
import Create from "./Components/Create.vue";
import SalesRepApi from "@/Api/Modules/salesrep";
export default {
  data() {
    return {
      show: false,
      SalesReps: [],
      loading: false,
      searchdata: "",
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
    };
  },
  components: {
    Table,
    Create,
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
    await this.getAllSalesReps();
  },

  methods: {
    // get all  SalesReps
    async getAllSalesReps() {
      this.loading = true;

      const payload = {
        seacrh_data: this.searchdata,
        page: this.page,
        per_page: this.itemsPerPage,
      };
      const res = await SalesRepApi.allSalesReps(payload);
      const pagination = res.data.data;

      this.SalesReps = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;
      this.loading = false;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getAllSalesReps();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getAllSalesReps();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getAllSalesReps();
    },

    // close
    async closeModal() {
      this.show = false;
      // call SalesReps
      await this.getAllSalesReps();
    },
  },
};
</script>
