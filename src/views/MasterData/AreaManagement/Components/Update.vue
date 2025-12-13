<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Update area</h3>

    <div class="form">
      <!-- update form -->
      <VForm>
        <VRow>
          <!-- Area Code -->
          <VCol lg="6" cols="12">
            <label class="label">Area Code</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Area Code"
              class="input"
              v-model="form.area_code"
              :rules="[required]"
            />
          </VCol>

          <!-- Area Name -->
          <VCol lg="6" cols="12">
            <label class="label">Area Name</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Area Name"
              class="input"
              :rules="[required]"
              v-model="form.area_name"
            />
          </VCol>
        </VRow>

        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="updateArea()"
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
import AreaApi from "@/Api/Modules/areas";
import { areaMethods } from "@/globals/areas";

export default {
  data() {
    return {
      form: {},
      loading: false,
      areas: [],
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

    // close area add modal
    close(data) {
      this.$emit("closemodal", data);
    },
    // update area
    async updateArea() {
      this.loading = true;

      await AreaApi.updateArea(this.form)
        .then(() => {
          this.loading = false;
          // call global araas clear (because want load full )
          areaMethods.clearAreas();
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
