<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Update Product</h3>

    <div class="form">
      <!-- add form -->
      <VForm v-model="isFormValid">
        <VRow>
          <!-- Select Categories -->
          <VCol lg="6" cols="12">
            <label class="label">Select Category</label>
            <div class="mt-2" />
            <VAutocomplete
              v-model="selectedCategory"
              :items="categories"
              class="input"
              item-text="category_name"
              item-title="category_name"
              item-value="id"
              return-object
              @update:model-value="openCategorymodel(selectedCategory)"
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
          <VCol lg="6" cols="12">
            <label class="label">Product Code *</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Code"
              class="input"
              v-model="form.product_code"
              :rules="[required]"
            />
          </VCol>

          <!--Product Name-->
          <VCol lg="6" cols="12">
            <label class="label">Product Name *</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Name"
              class="input"
              :rules="[required]"
              v-model="form.product_name"
            />
          </VCol>

          <!-- Model Number-->
          <VCol lg="6" cols="12">
            <label class="label">Model Number</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Model Number"
              class="input"
              v-model="form.model_number"
            />
          </VCol>

          <!-- Product Cost -->
          <VCol lg="6" cols="12">
            <label class="label">Product Cost(Rs) *</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Product Cost"
              class="input"
              v-model="form.product_cost"
              :rules="[required]"
            />
          </VCol>

          <!-- Minimum Selling Price -->
          <VCol lg="6" cols="12">
            <label class="label">Minimum Selling Price(Rs) *</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Minimum Selling Price"
              class="input"
              v-model="form.min_selling_price"
              :rules="[required]"
            />
          </VCol>

          <!-- Maximum Selling Price -->
          <VCol lg="6" cols="12">
            <label class="label">Maximum Selling Price(Rs) *</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Maximum Selling Price"
              class="input"
              v-model="form.max_selling_price"
              :rules="[required]"
            />
          </VCol>

          <!--Expire Date-->
          <VCol lg="6" cols="12">
            <label class="label">Expire Date</label>
            <div class="mt-2" />
            <AppDateTimePicker
              placeholder="Expire Date"
              class="input"
              v-model="form.expire_date"
            >
            </AppDateTimePicker>
          </VCol>

          <!-- Manufacture Date -->
          <VCol lg="6" cols="12">
            <label class="label">Manufacture Date</label>
            <div class="mt-2" />

            <AppDateTimePicker
              placeholder="Manufacture Date"
              class="input"
              v-model="form.manufacture_date"
            >
            </AppDateTimePicker>
          </VCol>

          <!-- Stock Count -->
          <VCol lg="6" cols="12">
            <label class="label">Stock Count</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Stock Count"
              class="input"
              v-model="form.stock_count"
            />
          </VCol>

          <!-- Product Image -->
          <VCol lg="12" cols="12">
            <label class="label">Product Image</label>
            <div class="mt-2" />
            <v-file-input
              v-model="form.product_image"
              label="Drag Product Image..."
              @change="handleFileChange"
              variant="outlined"
              class="input"
            ></v-file-input>
          </VCol>
        </VRow>
        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="updateProduct()"
            :loading="loading"
            :disabled="!isFormValid"
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
import ProductsApi from "@/Api/Modules/products";
import CategoryApi from "@/Api/Modules/product_categories";
import AddCategory from "@/views/MasterData/ProductCategoryManagement/Components/AddCategory.vue";
import commonmixins from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],
  components: {
    AddCategory,
  },
  data() {
    return {
      isFormValid: false,
      showCategoryModal: false,
      selectedCategory: null,
      categories: [],
      form: {},
      product_types: ["Solid", "Liquid"],
      loading: false,
      product_image: "",
    };
  },

  props: {
    formData: Object,
  },

  created() {
    this.initiaizeData();
  },

  methods: {
    // initialize data
    async initiaizeData() {
      this.form = { ...this.formData };
      await this.getCategories();
      if (this.form.category_id) {
        this.selectedCategory = this.categories.find(c => c.id === this.form.category_id) || this.form.category;
      } else if (this.form.category) {
        this.selectedCategory = this.form.category;
        this.form.category_id = this.form.category.id;
      }
    },

    // get categories
    async getCategories() {
      try {
        const res = await CategoryApi.AllCategory({ page: 1, per_page: 1000 });
        const rawList = Array.isArray(res?.data?.data?.data) ? [...res.data.data.data] : [];
        rawList.push({
          id: "",
          category_code: "Add New",
          category_name: "Add New",
        });
        this.categories = rawList.reverse();
      } catch (error) {
        console.error("Fetch Categories Error:", error);
      }
    },

    // open category modal if 'Add New' selected
    async openCategorymodel(value) {
      if (value && value.category_code === "Add New") {
        this.showCategoryModal = true;
        this.selectedCategory = null;
        this.form.category_id = "";
      } else if (value) {
        this.form.category_id = value.id;
      }
    },

    // close category modal
    async closeCategoryModal() {
      this.showCategoryModal = false;
      await this.getCategories();
    },

    // hande image change
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.resizeImage(file);
      }
    },
    // resize image
    resizeImage(file) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 1280;
        canvas.height = 794;
        ctx.drawImage(img, 0, 0, 1280, 794);

        canvas.toBlob((blob) => {
          this.product_image[0] = new File([blob], file.name, {
            type: file.type,
          });
        }, file.type);
      };

      reader.readAsDataURL(file);
    },

    // update Product
    async updateProduct() {
      const formData = new FormData();

      // append form data
      formData.append("id", this.form.id);
      formData.append("product_code", this.form.product_code);
      formData.append("product_name", this.form.product_name);
      formData.append("product_cost", this.form.product_cost);
      formData.append("min_selling_price", this.form.min_selling_price);
      formData.append("max_selling_price", this.form.max_selling_price);

      // check category
      if (this.form.category_id) {
        formData.append("category_id", this.form.category_id);
      } else if (this.selectedCategory && this.selectedCategory.id) {
        formData.append("category_id", this.selectedCategory.id);
      }

      // check availability
      if (this.form.model_number) {
        formData.append("model_number", this.form.model_number);
      }

      // check availability
      if (this.form.expire_date) {
        formData.append("expire_date", this.form.expire_date);
      }

      // check availability
      if (this.form.manufacture_date) {
        formData.append("manufacture_date", this.form.manufacture_date);
      }

      // check availability
      if (this.form.stock_count) {
        formData.append("stock_count", this.form.stock_count);
      }

      // check availability
      if (this.product_image) {
        formData.append("product_image", this.product_image[0]);
      }
      this.loading = true;

      await ProductsApi.updateProduct(formData)
        .then(() => {
          this.loading = false;
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
