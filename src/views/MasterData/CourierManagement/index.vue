<template>
  <div class="mt-5 masterdata">
    <!-- first section -->
    <div>
      <VRow>
        <!-- search courier -->
        <VCol lg="3" cols="12">
          <VTextField
            v-model="searchdata"
            placeholder="Search Courier"
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <VIcon icon="tabler-search"></VIcon>
            </template>
          </VTextField>
        </VCol>

        <!-- courier create -->
        <VCol lg="9" class="text-right" cols="12">
          <VBtn class="create_btn" variant="none" @click="show = true">
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Create Transport</span>
          </VBtn>
        </VCol>
      </VRow>
    </div>

    <div class="pt-15"></div>

    <!-- table -->
    <v-card>
      <Table
        :Couriers="couriers"
        :loading="loading"
        :totalItems="totalItems"
        :currentPage="page"
        :itemsPerPage="itemsPerPage"
        @close="closeModal"
        @pagechange="pageChange"
        @pagesizechange="pageSizeChange"
      />
    </v-card>

    <!-- create courier dialog -->

    <VDialog
      v-model="show"
      max-width="830.3px"
      min-height="216.97px"
      persistent
      scrollable=""
    >
      <VCard>
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

        <VCardText> <Create @close="closeModal" /> </VCardText
      ></VCard>
    </VDialog>
  </div>
</template>
<script>
import Create from "./Components/Create.vue";
import Table from "./Components/Table.vue";
import CouriersApi from "@/Api/Modules/couriers";
export default {
  data() {
    return {
      show: false,
      couriers: [],
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
    await this.getCouriers();
  },

  methods: {
    // get couriers for this listing page - paginated, unlike the shared
    // commonmixins.getCouriers() cache which other forms use for dropdowns
    async getCouriers() {
      this.loading = true;

      const payload = {
        searchdata: this.searchdata,
        page: this.page,
        per_page: this.itemsPerPage,
      };
      const res = await CouriersApi.allCouriers(payload);
      const pagination = res.data.data;

      this.couriers = pagination.data;
      this.totalItems = pagination.total;
      this.page = pagination.current_page;
      this.itemsPerPage = pagination.per_page;
      this.loading = false;
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getCouriers();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getCouriers();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getCouriers();
    },

    // close
    async closeModal() {
      this.show = false;
      // call couriers
      await this.getCouriers();
    },
  },
};
</script>
