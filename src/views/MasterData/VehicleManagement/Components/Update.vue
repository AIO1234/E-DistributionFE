<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Update Vehicle</h3>

    <div class="form">
      <!-- update form -->
      <VForm>
        <VRow>
          <!-- Vehicle No -->
          <v-col lg="6" cols="12">
            <label class="label">Vehicle No</label>
            <div class="mt-2" />
            <v-text-field
              placeholder="Vehicle No"
              class="input"
              v-model="form.vehicle_no"
              :rules="[required]"
            />
          </v-col>

          <!-- Vehicle Model -->
          <v-col lg="6" cols="12">
            <label class="label">Vehicle Model</label>
            <div class="mt-2" />
            <v-text-field
              placeholder="Vehicle Model"
              class="input"
              :rules="[required]"
              v-model="form.vehicle_model"
            />
          </v-col>
        </VRow>

        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="updateVehicle()"
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
import { vehicleMethods } from "@/globals/vehicles";
import VehiclesApi from "@/Api/Modules/vehicles";

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

    // close vehicle add modal
    close(data) {
      this.$emit("closemodal", data);
    },
    // update vehicle
    async updateVehicle() {
      this.loading = true;

      await VehiclesApi.updateVehicle(this.form)
        .then(() => {
          this.loading = false;
          // call global vehicles clear (because want load full )
          vehicleMethods.clearVehicles();
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
