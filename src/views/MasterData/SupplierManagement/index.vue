<template>
  <!-- supplier main view -->
  <div class="mt-9 supplier_chain masterdata">
    <div>
      <!-- search supplier -->
      <v-row>
        <v-col lg="3" cols="12">
          <v-text-field
            v-model="searchdata"
            placeholder="Search supplier name or mobile..."
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="tabler-search"></v-icon>
            </template>
          </v-text-field>
        </v-col>

        <!-- add supplier - not for Data Operator (view supplier names only) -->
        <v-col
          lg="9"
          class="text-right"
          cols="12"
          v-if="authRole !== 'Data Operator'"
        >
          <v-btn class="create_btn" variant="none" @click="showSupplierModal">
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Add Supplier</span>
          </v-btn>
        </v-col>
      </v-row>

      <div class="mt-8" />

      <!-- SUPPLIER TABLE -->
      <VCard>
        <SupplierTable
          :tabledata="allsuppliers"
          :loading="loading"
          :totalItems="totalItems"
          :currentPage="page"
          :itemsPerPage="itemsPerPage"
          @edit-supplier="openEditSupplier"
          @pagechange="pageChange"
          @pagesizechange="pageSizeChange"
        />
      </VCard>
    </div>

    <!-- ADD SUPPLIER DIALOG -->

    <VDialog v-model="show" width="900px" height="715px" class="supplier_chain">
      <VCard class="supplier_processing">
        <VCardText>
          <div class="add_supplier">
            <AddSuplier @closemodal="closeAddModal" />
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- EDIT SUPPLIER DIALOG -->

    <VDialog
      v-model="showEdit"
      width="900px"
      height="715px"
      class="supplier_chain"
    >
      <VCard class="supplier_processing">
        <VCardText>
          <div class="add_supplier">
            <EditSuplier
              :suplier-data="selectedSupplier"
              @closemodal="closeEditModal"
            />
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import SupplierTable from "@/views/MasterData/SupplierManagement/Components/SupplierTable.vue";
import AddSuplier from "@/views/MasterData/SupplierManagement/Components/AddSuplier.vue";
import EditSuplier from "@/views/MasterData/SupplierManagement/Components/EditSuplier.vue";
import SupplierApi from "@/Api/Modules/supply_chain";

export default {
  components: {
    SupplierTable,
    AddSuplier,
    EditSuplier,
  },

  data() {
    return {
      // logged-in role - Data Operator sees supplier names only
      authRole: "",

      // Search
      searchdata: "",

      // Add supplier dialog
      show: false,

      // Edit supplier dialog
      showEdit: false,

      // Selected supplier for editing
      selectedSupplier: {},

      // Page
      pageTitle: {},

      // Supplier data
      allsuppliers: [],

      // Loading
      loading: false,

      // Pagination
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
    };
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
    this.getAuthUser();
    this.pageTitle.page = "suppliers";

    await this.getAllSupplierData();
  },

  methods: {
    // allsuppliers
    async getAllSupplierData() {
      this.loading = true;

      try {
        const res = await SupplierApi.AllSuppliers({
          searchdata: this.searchdata,
          page: this.page,
          per_page: this.itemsPerPage,
        });
        const pagination = res?.data?.data;

        this.allsuppliers = pagination?.data || [];
        this.totalItems = pagination?.total || 0;
        this.page = pagination?.current_page || 1;
        this.itemsPerPage = pagination?.per_page || this.itemsPerPage;
      } catch (error) {
        console.error("Error loading suppliers:", error);

        this.allsuppliers = [];
      } finally {
        this.loading = false;
      }
    },

    // search - reset to page 1 since the previous page may not exist
    // anymore under the new search text
    async search() {
      this.page = 1;
      await this.getAllSupplierData();
    },

    // page change
    async pageChange(data) {
      this.page = data.page;
      await this.getAllSupplierData();
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page;
      this.itemsPerPage = data.per_page;
      await this.getAllSupplierData();
    },

    // SHOW ADD SUPPLIER

    showSupplierModal() {
      this.show = true;
    },

    // CLOSE ADD SUPPLIER
    async closeAddModal(data) {
      this.show = false;

      if (data === "load") {
        await this.getAllSupplierData();
      }
    },

    // OPEN EDIT SUPPLIER

    openEditSupplier(supplier) {
      // Keep the selected supplier
      this.selectedSupplier = {
        ...supplier,
      };

      // Open edit dialog
      this.showEdit = true;
    },

    // CLOSE EDIT SUPPLIER

    async closeEditModal(data) {
      this.showEdit = false;

      if (data === "load") {
        await this.getAllSupplierData();
      }

      // Clear selected supplier
      this.selectedSupplier = {};
    },
  },
};
</script>
