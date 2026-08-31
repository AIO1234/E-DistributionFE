<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Add Vehicle</h3>

    <div class="form">
      <!-- add form -->
      <v-form>
        <v-row>
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
        </v-row>

        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="addVehicle()"
            :loading="loading"
          >
            <span class="btn_text">Submit</span>
          </VBtn>
        </div>
      </v-form>
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

  methods: {
    // add Vehicle
    async addVehicle() {
      this.loading = true;

      await VehiclesApi.storeVehicle(this.form)
        .then((res) => {
          this.loading = false;
          // call global vehicles add function
          vehicleMethods.addNewVehicle(res.data.data);
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
