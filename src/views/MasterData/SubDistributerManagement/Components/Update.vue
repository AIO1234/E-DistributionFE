<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Update SubDistributor</h3>

    <div class="form">
      <!-- update form -->
      <VForm>
        <VRow>
          <!-- Code -->
          <VCol lg="6" cols="12">
            <label class="label">Code</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Code"
              class="input"
              v-model="form.subdistributer_code"
              :rules="[required]"
            />
          </VCol>

          <!-- Name -->
          <VCol lg="6" cols="12">
            <label class="label">Name</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Name"
              class="input"
              :rules="[required]"
              v-model="form.subdistributer_name"
            />
          </VCol>
        </VRow>

        <VRow>
          <!--mobile -->
          <VCol lg="6" cols="12">
            <label class="label">Mobile</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Mobile"
              class="input"
              :rules="[maxTwoChars]"
              v-model="form.subdistributer_mobile"
            />
          </VCol>

          <!-- address -->
          <VCol lg="6" cols="12">
            <label class="label">Address</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Address"
              class="input"
              v-model="form.subdistributer_address"
            />
          </VCol>

          <!-- Area -->
          <VCol lg="6" cols="12">
            <label class="label">Area *</label>
            <div class="mt-2" />

            <v-autocomplete
              placeholder="Select Area"
              class="input"
              v-model="form.area"
              item-title="area_name"
              item-value="id"
              :items="areas"
              return-object=""
            >
              <template v-slot:item="{ props, item }">
                <div>
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.area_code"
                    :subtitle="item.raw.area_name"
                  >
                  </v-list-item>
                </div>
              </template>
            </v-autocomplete>
          </VCol>
        </VRow>
        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="updateSubDistributer()"
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
import SubDistributerApi from "@/Api/Modules/sub_distributer";
import commonmixins from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],
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
      await this.getAreas();
    },

    // get areas from the globals
    async getAreas() {
      this.areas = await commonmixins.methods.getAreas();
    },
    // close shop add modal
    close(data) {
      this.$emit("closemodal", data);
    },
    // update shop
    async updateSubDistributer() {
      this.loading = true;

      await SubDistributerApi.updateSubDistributer(this.form)
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
