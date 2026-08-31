<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Add ShowRoom</h3>

    <div class="form">
      <!-- add form -->
      <VForm ref="form" v-model="isFormValid">
        <VRow>
          <!-- Code -->
          <VCol lg="6" cols="12">
            <label class="label">Code*</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Code"
              class="input"
              v-model="form.distributer_code"
              :rules="[required]"
            />
          </VCol>

          <!-- Name -->
          <VCol lg="6" cols="12">
            <label class="label">Name*</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Name"
              class="input"
              :rules="[required]"
              v-model="form.distributer_name"
            />
          </VCol>

          <!--mobile -->
          <VCol lg="6" cols="12">
            <label class="label">Mobile</label>
            <div class="mt-2" />
            <VTextField
              :rules="[maxTwoChars]"
              placeholder="Mobile"
              class="input"
              v-model="form.distributer_mobile"
            />
          </VCol>

          <!--email -->
          <VCol lg="6" cols="12">
            <label class="label">E-mail</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Email"
              class="input"
              v-model="form.distributer_email"
            />
          </VCol>

          <!-- address -->
          <VCol lg="6" cols="12">
            <label class="label">Address</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Address"
              class="input"
              v-model="form.distributer_address"
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
            :disabled="!isFormValid"
            color="#4340DA"
            @click="addDistributer()"
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
import DistributerApi from "@/Api/Modules/distributer";
import AreasApi from "@/Api/Modules/areas";
import commonmixins from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],
  data() {
    return {
      form: {
        distributer_address: "",
        distributer_mobile: "",
        distributer_email: "",
      },
      loading: false,
      isFormValid: false,
      areas: [],
    };
  },
  async created() {
    await this.getAreas();
  },
  methods: {
    // get areas - /areas/index is paginated, request a large per_page to
    // effectively get everything in one page for the dropdown
    async getAreas() {
      const res = await AreasApi.allAreas({ page: 1, per_page: 1000 });
      this.areas = res.data.data.data;
    },
    // add distributor
    async addDistributer() {
      this.loading = true;
      //  console.log(this.form);
      await DistributerApi.storeDistributer(this.form)
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
