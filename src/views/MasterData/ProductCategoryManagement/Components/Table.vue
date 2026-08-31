<template>
  <!-- table view of catagory -->
  <div>
    <VSkeletonLoader
      :loading="loading"
      height="240"
      type="image, list-item-two-line"
    >
      <VDataTableServer
        :headers="headers"
        :items="categoryData"
        item-selectable="selectable"
        :items-length="totalItems"
        :page="currentPage"
        :items-per-page="itemsPerPage"
        @update:page="onPage"
        @update:items-per-page="onPerPage"
      >
        <!-- contents -->
        <template
          v-for="header in headers"
          :key="header.value"
          #[`item.${header.key}`]="props"
        >
          <div v-if="header.key === 'category_code'">
            {{ makeUpperCase(props.item.category_code) }}
          </div>
          <div v-if="header.key === 'category_name'">
            {{ makeUpperCase(props.item.category_name) }}
          </div>
          <div v-if="header.key === 'product_count'">
            {{ props.item.product_count }}
          </div>
          <div v-if="header.key === 'action'">
            <VRow>
              <VCol lg="3">
                <VBtn
                  color="transparent"
                  @click="openorderModal(props.item)"
                >
                  <img
                    src="@images/edit.png"
                    class="img_styles"
                  >
                </VBtn>
              </VCol>
              <VCol lg="3">
                <!--
                  <v-btn color="transparent" @click="openDeleteModal()">
                  <img src="@images/delete1.png" class="img_styles" />
                  </v-btn> 
                -->
              </VCol>
            </VRow>
          </div>
        </template>
      </VDataTableServer>
    </VSkeletonLoader>
  </div>
  <!-- dialogs -->
  <!-- update category form -->
  <VDialog
    v-model="showModal"
    width="900px"
    class="category_management"
    scrollable=""
  >
    <VCard>
      <VCardText class="edit_category">
        <div>
          <Editcategory
            :selected-item="selectedItem"
            @close-modal="closeModal"
          />
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- delete -->
  <VDialog
    v-model="showDeleteModal"
    width="500px"
    scrollable=""
    persistent=""
  >
    <VCard>
      <VCardText class="delete">
        <div>
          <DeleteBox
            :caption="caption"
            @close-modal="closeDeleteModal"
          />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import Editcategory from "./Editcategory.vue"
import CategoryApi from "@/Api/Modules/product_categories"

export default {
  components: {
    Editcategory,
  },

  props: {
    categoryData: Array,
    loading: Boolean,
    totalItems: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      caption: "Category",
      selectedItem: {},
      showModal: false,
      showDeleteModal: false,
      headers: [
        { title: "Code", align: "start", key: "category_code" },
        { title: "Category Name", align: "start", key: "category_name" },

        //   { title: "Product Count", align: "start", key: "product_count" },
        { title: "Action", align: "start", key: "action" },
      ],
    }
  },

  methods: {
    // page change
    onPage(page) {
      this.$emit("pagechange", { page })
    },

    // items-per-page change
    onPerPage(perPage) {
      this.$emit("pagesizechange", {
        page: 1,
        per_page: perPage == -1 ? 10000 : perPage,
      })
    },

    // open edit modal
    openorderModal(item) {
      this.selectedItem = item
      this.showModal = true
    },

    // cloe edit modal
    closeModal(data) {
      this.showModal = false
      if (data === "load") {
        this.$emit("refresh", true)
      }
    },

    // delete open modal

    openDeleteModal() {
      this.showDeleteModal = true
    },

    // delete close modal
    closeDeleteModal() {
      this.showDeleteModal = false
    },
  },
}
</script>
