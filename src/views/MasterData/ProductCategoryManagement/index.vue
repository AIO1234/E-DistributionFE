<template>
  <!-- main view of catagory -->
  <div class="pt-5" />

  <div class="category_management">
    <div class="pt-7" />
    <div class="pt-16" />

    <!-- Initial section -->
    <VRow>
      <VCol
        lg="6"
        cols="12"
        md="6"
        sm="6"
      />

      <VCol
        lg="6"
        cols="12"
        md="6"
        sm="6"
      >
        <VRow>
          <VCol
            lg="8"
            cols="12"
            md="8"
            sm="6"
          />

          <!-- Add Category -->
          <VRow>
            <VCol
              lg="1"
              class="text-right"
              cols="12"
            >
              <VBtn
                class="create_btn"
                variant="none"
                @click="openCreateModal"
              >
                <template #prepend>
                  <img src="@images/IconsSolid.png">
                </template>

                <span class="text">Add Category</span>
              </VBtn>
            </VCol>
          </VRow>
        </VRow>
      </VCol>
    </VRow>

    <div class="pt-10" />

  
    <!-- SEARCH SECTION -->
  

    <VRow>
      <!-- Search input -->
      <VCol
        lg="4"
        cols="12"
        md="4"
        sm="12"
      >
        <VTextField
          v-model="searchdata"
          class="search_button"
          placeholder="Search category code or name..."
          clearable
          @keyup.enter="searchCategories"
        />
      </VCol>

      <!-- Search button -->
      <VCol
        lg="4"
        cols="12"
        md="4"
        sm="12"
      >
        <VBtn
          class="search_button"
          color="#4340DA"
          :loading="loading"
          @click="searchCategories"
        >
          <span class="search_text">Search</span>
        </VBtn>
      </VCol>

      <!-- Clear button -->
      <VCol
        lg="4"
        cols="12"
        md="4"
        sm="12"
      >
        <VBtn
          class="search_button"
          color="#4340DA"
          :disabled="loading"
          @click="clearSearch"
        >
          <span class="search_text">Clear</span>
        </VBtn>
      </VCol>
    </VRow>

    <div class="pt-10" />

  
    <!-- TABLE -->
    

    <CategoryTable
      :category-data="allcategories"
      :loading="loading"
      :total-items="totalItems"
      :current-page="page"
      :items-per-page="itemsPerPage"
      @refresh="refresh"
      @pagechange="pageChange"
      @pagesizechange="pageSizeChange"
    />
  </div>

  
  <!-- ADD CATEGORY DIALOG -->


  <VDialog
    v-model="showModal"
    width="900px"
    class="category_management"
    scrollable
  >
    <VCard>
      <VCardText class="add_category">
        <AddCategory @close-modal="closeModal" />
      </VCardText>
    </VCard>
  </VDialog>
</template>


<script>
import CategoryTable from "./Components/Table.vue"
import AddCategory from "./Components/AddCategory.vue"
import CategoryApi from "@/Api/Modules/product_categories"

export default {
  components: {
    CategoryTable,
    AddCategory,
  },

  data() {
    return {
      showModal: false,
      pageTitle: {},


      loading: false,


      allcategories: [],


      searchdata: "",


      searchQuery: "",

      // Pagination
      page: 1,
      itemsPerPage: 50,
      totalItems: 0,
    }
  },

  async created() {
    await this.allCategories()
  },

  methods: {

    // LOAD ALL CATEGORIES

    async allCategories() {
      this.loading = true

      try {

        const payload = {
          seacrh_data: this.searchQuery,
          page: this.page,
          per_page: this.itemsPerPage,
        }

        const res = await CategoryApi.AllCategory(payload)
        const pagination = res?.data?.data

        this.allcategories = pagination?.data || []
        this.totalItems = pagination?.total || 0
        this.page = pagination?.current_page || 1
        this.itemsPerPage = pagination?.per_page || this.itemsPerPage
      } catch (error) {
        console.error(
          "Error loading categories:",
          error,
        )

        this.allcategories = []
      } finally {
        this.loading = false
      }
    },


    // SEARCH BUTTON - reset to page 1 since the previous page may not
    // exist anymore under the new search text
    async searchCategories() {
      this.searchQuery = this.searchdata.trim()
      this.page = 1

      await this.allCategories()
    },


    // CLEAR BUTTON

    async clearSearch() {
      // Clear input
      this.searchdata = ""

      // Clear actual search
      this.searchQuery = ""
      this.page = 1

      await this.allCategories()
    },

    // page change
    async pageChange(data) {
      this.page = data.page
      await this.allCategories()
    },

    // items-per-page change
    async pageSizeChange(data) {
      this.page = data.page
      this.itemsPerPage = data.per_page
      await this.allCategories()
    },

   
    // OPEN CREATE MODAL

    openCreateModal() {
      this.showModal = true
    },


    // CLOSE CREATE MODAL
   
    async closeModal(data) {
      this.showModal = false

      if (data === "load") {
        await this.allCategories()
      }
    },


    // REFRESH TABLE
  
    async refresh() {
      await this.allCategories()
    },
  },
}
</script>


<style lang="scss">
.small_margin {
  margin-top: -4px;
}
</style>
