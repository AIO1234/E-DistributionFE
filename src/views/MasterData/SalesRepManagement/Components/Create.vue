<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Add Sales Rep</h3>

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
              v-model="form.rep_code"
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
              v-model="form.rep_name"
            />
          </VCol>

          <!--mobile -->
          <VCol lg="6" cols="12">
            <label class="label">Mobile</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Mobile"
              class="input"
              :rules="[maxTwoChars]"
              v-model="form.rep_mobile"
            />
          </VCol>

          <!--email -->
          <VCol lg="6" cols="12">
            <label class="label">E-mail*</label>
            <div class="mt-2" />
            <VTextField
              :rules="[email]"
              placeholder="Email"
              class="input"
              v-model="form.rep_email"
            />
          </VCol>

          <!-- password -->
          <VCol lg="6" cols="12">
            <label class="label">Password*</label>
            <div class="mt-2" />
            <AppTextField
              class="input"
              v-model="form.password"
              :rules="[required, password]"
              placeholder="············"
              :type="showPassword ? 'password' : 'text'"
            >
              <template #append-inner>
                <img
                  @click="showPassword = !showPassword"
                  src="@/assets/images/eye.png"
                  style="
                    width: 20px;
                    height: 20px;
                    object-fit: contain;
                    cursor: pointer;
                  "
                />
              </template>
            </AppTextField>
          </VCol>

          <!-- confirm password -->
          <VCol lg="6" cols="12">
            <label class="label">Confirm Password*</label>
            <div class="mt-2" />
            <AppTextField
              class="input"
              v-model="form.password_confirmation"
              :rules="[required, confirm_password]"
              placeholder="············"
              :type="showConfirmPassword ? 'password' : 'text'"
            >
              <template #append-inner>
                <img
                  @click="showConfirmPassword = !showConfirmPassword"
                  src="@/assets/images/eye.png"
                  style="
                    width: 20px;
                    height: 20px;
                    object-fit: contain;
                    cursor: pointer;
                  "
                />
              </template>
            </AppTextField>
          </VCol>

          <!-- address -->
          <VCol lg="6" cols="12">
            <label class="label">Address</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Address"
              class="input"
              v-model="form.rep_address"
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
            :disabled="!isFormValid"
            class="button"
            color="#4340DA"
            @click="addSalesRep()"
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
import SalesRepApi from "@/Api/Modules/salesrep";
import AreasApi from "@/Api/Modules/areas";
import commonmixins from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],
  data() {
    return {
      isFormValid: false,
      form: { rep_address: "", rep_mobile: "" },
      loading: false,
      areas: [],
      showPassword: true,
      showConfirmPassword: true,
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

    // add sales rep
    async addSalesRep() {
      this.loading = true;

      await SalesRepApi.storeSalesRep(this.form)
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
