<template>
  <div class="masterdata">
    <!-- form start -->

    <h3 class="form_title">Add Courier</h3>
    <div class="form">
      <!-- form content -->

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

      <div class="pt-12"></div>

      <!-- submit button -->
      <div class="text-center">
        <VBtn
          class="button"
          color="#4340DA"
          @click="addCouriers()"
          :loading="loading"
        >
          <span class="btn_text">Submit</span>
        </VBtn>
      </div>
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

  methods: {
    // add Corier
    async addCouriers() {
      this.loading = true;

      await CouriersApi.storeCourier(this.form)
        .then((res) => {
          this.loading = false;
          // call global courier add function
          courierMethods.addNewCourier(res.data.data);
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
