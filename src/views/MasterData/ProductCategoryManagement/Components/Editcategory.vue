<template>
  <!-- edit catagory -->
  <div>
    <div class="text-end">
      <VBtn
        icon="tabler-x"
        variant="none"
        color="#000000"
        @click="closeModal('neverload')"
      />
    </div>

    <!-- title -->
    <h3 class="category_title">
      Update Category
    </h3>

    <div class="form">
      <!-- feilds -->

      <VCard class="content">
        <VForm>
          <VRow>
            <!-- Product Name -->
            <VCol
              lg="12"
              cols="12"
            >
              <label class="label">Category Name*</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.category_name"
                placeholder="Category Name"
                :rules="[required]"
                class="input"
              />
            </VCol>
          </VRow>
        </VForm>

        <div class="pt-15" />
        <div class="pt-5" />
        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="submit"
            variant="none"
            :loading="loading"
            @click="UpdateCategory"
          >
            <span class="text">Update</span>
          </VBtn>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script>
import CategoryApi from "@/Api/Modules/product_categories"

export default {
  props: {
    selectedItem: Object,
  },
  data() {
    return {
      form: {},
      loading: false,
    }
  },
  created() {
    this.form = this.selectedItem
  },
  methods: {
    // close modal
    closeModal(data) {
      this.$emit("closeModal", data)
    },

    //update category
    async UpdateCategory() {
      this.loading = true
      await CategoryApi.UpdateCategory(this.form.id, this.form)
        .then(() => {
          this.loading = false
          this.closeModal("load")
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>
