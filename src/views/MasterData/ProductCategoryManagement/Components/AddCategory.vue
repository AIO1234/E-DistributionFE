<template>
  <!-- add catagory -->
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
      Add Category
    </h3>

    <div class="form">
      <!-- feilds -->

      <VCard class="content">
        <VForm>
          <VRow>
            <!-- Category Name -->
            <VCol
              lg="12"
              cols="12"
            >
              <label class="label">Category Name*</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.category_name"
                :rules="[required]"
                placeholder="Category Name"
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
            @click="addCategory"
          >
            <span class="text">Create</span>
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

  methods: {
    // close modal
    closeModal(data) {
      this.$emit("closeModal", data)
    },

    // add category

    async addCategory() {
      this.loading = true

      //  console.log(this.form);
      await CategoryApi.AddCategory(this.form)
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
