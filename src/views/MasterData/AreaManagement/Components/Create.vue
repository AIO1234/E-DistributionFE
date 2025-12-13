<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Add Area</h3>

    <div class="form">
      <!-- add form -->
      <v-form>
        <v-row>
          <!-- AreaCode -->
          <v-col lg="6" cols="12">
            <label class="label">Area Code</label>
            <div class="mt-2" />
            <v-text-field
              placeholder="Area Code"
              class="input"
              v-model="form.area_code"
              :rules="[required]"
            />
          </v-col>

          <!-- Area Name -->
          <v-col lg="6" cols="12">
            <label class="label">Area Name</label>
            <div class="mt-2" />
            <v-text-field
              placeholder="Area Name"
              class="input"
              :rules="[required]"
              v-model="form.area_name"
            />
          </v-col>
        </v-row>

        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="addArea()"
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
import { areaMethods } from "@/globals/areas";
import AreaApi from "@/Api/Modules/areas";

export default {
  data() {
    return {
      form: {},
      loading: false,
      areas: [],
    };
  },

  methods: {
    // add Area
    async addArea() {
      this.loading = true;

      await AreaApi.storeArea(this.form)
        .then((res) => {
          this.loading = false;
          // call global areas add function
          areaMethods.addNewArea(res.data.data);
          this.$emit("close");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
