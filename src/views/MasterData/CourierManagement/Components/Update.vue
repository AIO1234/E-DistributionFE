<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Update Transport</h3>

    <div class="form">
      <!-- update form -->
      <VForm>
        <!-- general details -->
        <VRow>
          <!-- Courier Compny Name-->
          <VCol lg="6" cols="12">
            <label class="label">Courier Name</label>
            <div class="pt-2"></div>

            <VTextField
              variant="outlined"
              class="input"
              v-model="form.company_name"
              :rules="[required]"
              placeholder="Courier Name"
            >
            </VTextField>
          </VCol>

          <!-- Mobile Number-->
          <VCol lg="6" cols="12">
            <label class="label">Mobile Number</label>
            <div class="pt-2"></div>

            <VTextField
              variant="outlined"
              class="input"
              :rules="[required]"
              placeholder="Mobile Number"
              v-model="form.contact_no"
            >
            </VTextField>
          </VCol>

          <!-- Courier Address-->
          <VCol lg="6" cols="12">
            <label class="label">Courier Address</label>
            <div class="pt-2"></div>

            <VTextField
              variant="outlined"
              class="input"
              placeholder="Courier Address"
              v-model="form.address"
            >
            </VTextField>
          </VCol>
        </VRow>

        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="updateCourier()"
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
import { courierMethods } from "@/globals/couriers";
import CouriersApi from "@/Api/Modules/couriers";

export default {
  data() {
    return {
      form: {},
      loading: false,
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
      this.form = this.formData;
    },

    // close courier add modal
    close(data) {
      this.$emit("closemodal", data);
    },
    // update courier
    async updateCourier() {
      this.loading = true;

      await CouriersApi.updateCourier(this.form)
        .then(() => {
          this.loading = false;
          // call global vehicles clear (because want load full )
          courierMethods.clearcouriers();
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
