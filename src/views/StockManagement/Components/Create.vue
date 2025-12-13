<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Add Product</h3>

    <div class="form">
      <!-- add form -->
      <VForm v-model="isFormValid">
        <VRow>
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

          <!--Product Type -->
          <VCol lg="6" cols="12">
            <label class="label">Product Type *</label>
            <div class="mt-2" />
            <v-autocomplete
              :items="product_types"
              placeholder="Select Product Type"
              v-model="form.product_type"
              class="input"
            >
            </v-autocomplete>
          </VCol>

          <!-- Product Weight -->
          <VCol lg="6" cols="12" v-if="form.product_type === 'Solid'">
            <label class="label">Product Weight(Kg)</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Product Weight"
              class="input"
              v-model="form.product_weight"
            />
          </VCol>

          <!-- Product Volume -->
          <VCol lg="6" cols="12" v-if="form.product_type === 'Liquid'">
            <label class="label">Product Volume(L)</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Product Volume"
              class="input"
              v-model="form.product_volume"
            />
          </VCol>

          <!-- Product Amount -->
          <VCol lg="6" cols="12">
            <label class="label">Product Amount(Rs) *</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Product Amount"
              class="input"
              v-model="form.product_amount"
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
              placeholder="Expire Date"
              class="input"
              v-model="form.manufacture_date"
            >
            </AppDateTimePicker>
          </VCol>

          <!-- Distributor Commision -->
          <VCol lg="6" cols="12">
            <label class="label">Distributor Commision(Rs)</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Distributor Commision"
              class="input"
              v-model="form.distributer_commision"
            />
          </VCol>

          <!-- Salesrep Commision -->
          <VCol lg="6" cols="12">
            <label class="label">Salesrep Commision(Rs)</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Salesrep Commision"
              class="input"
              v-model="form.salesrep_commision"
            />
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
            :disabled="!isFormValid"
            @click="addProduct()"
            :loading="loading"
          >
            <span class="btn_text">Submit</span>
          </VBtn>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script>
import ProductsApi from "@/Api/Modules/products";
export default {
  data() {
    return {
      isFormValid: false,
      form: {},
      product_types: ["Solid", "Liquid"],
      loading: false,
    };
  },
  methods: {
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

        // Set desired width and height

        canvas.width = 1280;
        canvas.height = 794;
        ctx.drawImage(img, 0, 0, 1280, 794);

        canvas.toBlob((blob) => {
          this.form.product_image[0] = new File([blob], file.name, {
            type: file.type,
          });
        }, file.type);
      };

      reader.readAsDataURL(file);
    },

    // add Product
    async addProduct() {
      const formData = new FormData();

      // append all for data to fordata object

      formData.append("product_code", this.form.product_code);
      formData.append("product_name", this.form.product_name);
      formData.append("product_type", this.form.product_type);

      formData.append("product_amount", this.form.product_amount);

      // check availability
      if (this.form.product_weight) {
        formData.append("product_weight", this.form.product_weight);
      }

      // check availability
      if (this.form.product_volume) {
        formData.append("product_volume", this.form.product_volume);
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
      if (this.form.distributer_commision) {
        formData.append(
          "distributer_commision",
          this.form.distributer_commision
        );
      }

      // check availability
      if (this.form.salesrep_commision) {
        formData.append("salesrep_commision", this.form.salesrep_commision);
      }

      // check availability
      if (this.form.product_image) {
        formData.append("product_image", this.form.product_image[0]);
      }
      this.loading = true;

      await ProductsApi.storeProduct(formData)
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
