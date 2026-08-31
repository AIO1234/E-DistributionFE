<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">
      Add Product
    </h3>

    <div class="form">
      <!-- add forms -->
      <VForm v-model="isFormValid">
        <VRow>
          <!-- Select Category  code -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Select Category</label>
            <div class="mt-2" />
            <VAutocomplete
              v-model="selectedCategoryOption"
              :items="categories"
              class="input"
              item-text="category_name"
              item-title="category_name"
              item-value="id"
              return-object
              @update:model-value="openCategorymodel(selectedCategoryOption)"
            >
              <template #item="{ props, item }">
                <div v-if="item.raw.category_code === 'Add New'">
                  <VListItem
                    style="
                      background-color: rgb(255, 255, 255);
                      color: red;
                      font-weight: bold;
                    "
                    v-bind="props"
                    :title="item.raw.category_name"
                  />
                </div>
                <div v-else>
                  <VListItem
                    v-bind="props"
                    :title="item.raw.category_name"
                    :subtitle="item.raw.category_code"
                  />
                </div>
              </template>
            </VAutocomplete>
          </VCol>

          <!-- Product Code -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Product Code *</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.product_code"
              placeholder="Code"
              class="input"
              :rules="[required]"
            />
          </VCol>

          <!-- Model Number -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Model Number</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.model_number"
              placeholder="Model Number"
              class="input"
            />
          </VCol>

          <!-- Product Name -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Product Name *</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.product_name"
              placeholder="Name"
              class="input"
              :rules="[required]"
            />
          </VCol>

          <!-- Product Cost -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Product Cost(Rs) *</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.product_cost"
              placeholder="Product Cost"
              class="input"
              :rules="[required]"
            />
          </VCol>

          <!-- Minimum Selling Price -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Minimum Selling Price(Rs) *</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.min_selling_price"
              placeholder="Minimum Selling Price"
              class="input"
              :rules="[required]"
            />
          </VCol>

          <!-- Maximum Selling Price -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Maximum Selling Price(Rs) *</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.max_selling_price"
              placeholder="Maximum Selling Price"
              class="input"
              :rules="[required]"
            />
          </VCol>

          <!-- Expire Date -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Expire Date</label>
            <div class="mt-2" />
            <AppDateTimePicker
              v-model="form.expire_date"
              placeholder="Expire Date"
              class="input"
            />
          </VCol>

          <!-- Manufacture Date -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Manufacture Date</label>
            <div class="mt-2" />

            <AppDateTimePicker
              v-model="form.manufacture_date"
              placeholder="Manufacture Date"
              class="input"
            />
          </VCol>

          <!-- Stock Count -->
          <VCol
            lg="6"
            cols="12"
          >
            <label class="label">Stock Count</label>
            <div class="mt-2" />
            <VTextField
              v-model="form.stock_count"
              placeholder="Stock Count"
              class="input"
            />
          </VCol>

          <!-- Product Image -->
          <VCol
            lg="12"
            cols="12"
          >
            <label class="label">Product Image</label>
            <div class="mt-2" />
            <VFileInput
              v-model="form.product_image"
              label="Drag Product Image..."
              variant="outlined"
              class="input"
              @change="handleFileChange"
            />
          </VCol>
        </VRow>
        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            :disabled="!isFormValid"
            :loading="loading"
            @click="addProduct"
          >
            <span class="btn_text">Submit</span>
          </VBtn>
        </div>
      </VForm>
    </div>
  </div>

  <!-- category create dialog -->
  <VDialog
    v-model="showCategoryModal"
    width="900px"
    class="category_management"
    scrollable
  >
    <VCard>
      <VCardText class="add_category">
        <div>
          <AddCategory @close-modal="closeCategoryModal" />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import ProductsApi from "@/Api/Modules/products"
import CategoryApi from "@/Api/Modules/product_categories"
import AddCategory from "@/views/MasterData/ProductCategoryManagement/Components/AddCategory.vue"
import commonmixins from "@/mixins/commonmixins"

export default {
  components: {
    AddCategory,
  },
  mixins: [commonmixins],
  props: {
    selectedCategory: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      isFormValid: false,
      showCategoryModal: false,
      selectedCategoryOption: null,
      categories: [],
      form: {},
      loading: false,
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    // initialize component data
    async init() {
      await this.getCategories()
      await this.getNextProductCode()

      // pre-select the category passed in from the caller (e.g. "Add New" product from an order form)
      if (this.selectedCategory && this.selectedCategory.id) {
        const match = this.categories.find(
          category => category.id === this.selectedCategory.id,
        )

        if (match) {
          this.selectedCategoryOption = match
          this.form.category_id = match.id
        }
      }
    },

    // prefill the product code with the next auto-generated value; the
    // field stays editable so the user can override it if needed
    async getNextProductCode() {
      try {
        const res = await ProductsApi.nextProductCode()

        this.form.product_code = res.data.data
      } catch (error) {
        console.error("Fetch Next Product Code Error:", error)
      }
    },

    // get all categories
    async getCategories() {
      try {
        const res = await CategoryApi.AllCategory({ page: 1, per_page: 1000 })

        this.categories = res.data.data.data || []
        this.categories.push({
          id: "",
          category_code: "Add New",
          category_name: "Add New",
        })
        this.categories = this.categories.reverse()
      } catch (error) {
        console.error("Fetch Categories Error:", error)
      }
    },

    // open category modal if 'Add New' is selected
    async openCategorymodel(value) {
      if (value && value.category_code === "Add New") {
        this.showCategoryModal = true
        this.selectedCategoryOption = null
        this.form.category_id = ""
      } else if (value) {
        this.form.category_id = value.id
      }
    },

    // close category modal
    async closeCategoryModal() {
      this.showCategoryModal = false
      await this.getCategories()
    },

    // handle image change
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith("image/")) {
        this.resizeImage(file)
      }
    },

    // resize image
    resizeImage(file) {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = e => {
        img.src = e.target.result
      }

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = 1280
        canvas.height = 794
        ctx.drawImage(img, 0, 0, 1280, 794)

        canvas.toBlob(blob => {
          this.form.product_image[0] = new File([blob], file.name, {
            type: file.type,
          })
        }, file.type)
      }

      reader.readAsDataURL(file)
    },

    // add Product
    async addProduct() {
      const formData = new FormData()

      // append form data - product_code is prefilled automatically but the
      // user may have overridden it, so send whatever is currently in the field
      formData.append("product_code", this.form.product_code)
      formData.append("product_name", this.form.product_name)
      formData.append("product_cost", this.form.product_cost)
      formData.append("min_selling_price", this.form.min_selling_price)
      formData.append("max_selling_price", this.form.max_selling_price)

      // check category
      if (this.form.category_id) {
        formData.append("category_id", this.form.category_id)
      } else if (this.selectedCategoryOption && this.selectedCategoryOption.id) {
        formData.append("category_id", this.selectedCategoryOption.id)
      }

      // check availability
      if (this.form.model_number) {
        formData.append("model_number", this.form.model_number)
      }

      // check availability
      if (this.form.expire_date) {
        formData.append("expire_date", this.form.expire_date)
      }

      // check availability
      if (this.form.manufacture_date) {
        formData.append("manufacture_date", this.form.manufacture_date)
      }

      // check availability
      if (this.form.stock_count) {
        formData.append("stock_count", this.form.stock_count)
      }

      // check availability
      if (this.form.product_image) {
        formData.append("product_image", this.form.product_image[0])
      }
      this.loading = true

      await ProductsApi.storeProduct(formData)
        .then(() => {
          this.loading = false
          this.$emit("close")
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>
