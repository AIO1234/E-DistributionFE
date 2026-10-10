<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Add Customer</h3>

    <div class="form">
      <!-- add form -->
      <VForm>
        <VRow>
          <!-- Code -->
          <VCol lg="6" cols="12">
            <label class="label">Code</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Code"
              class="input"
              v-model="form.shop_code"
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
              v-model="form.shop_name"
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
              v-model="form.shop_mobile"
            />
          </VCol>

          <!-- address -->
          <VCol lg="6" cols="12">
            <label class="label">Address</label>
            <div class="mt-2" />
            <VTextField
              placeholder="Address"
              class="input"
              v-model="form.shop_address"
            />
          </VCol>

          <!-- payment term -->
          <VCol lg="6" cols="12">
            <label class="label">Payment Term</label>
            <div class="mt-2" />
            <VSelect
              v-model="form.payment_term_days"
              :items="paymentTermOptions"
              item-title="title"
              item-value="value"
              class="input"
            />
          </VCol>

        </VRow>
        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            color="#4340DA"
            @click="addShop()"
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
import ShopsApi from "@/Api/Modules/shop";
import AreasApi from "@/Api/Modules/areas";
import commonmixins from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],
  data() {
    return {
      form: { shop_address: "", payment_term_days: 30 },
      loading: false,
      areas: [],
      paymentTermOptions: [
        { title: "30 Days", value: 30 },
        { title: "60 Days", value: 60 },
        { title: "90 Days", value: 90 },
        { title: "100 Days", value: 100 },
      ],
    };
  },
  async created() {
    await this.init();
  },
  methods: {
    // initialize component data
    async init() {
      await this.getAreas();
      await this.getNextShopCode();
    },

    // get areas - /areas/index is paginated, request a large per_page to
    // effectively get everything in one page for the dropdown
    async getAreas() {
      const res = await AreasApi.allAreas({ page: 1, per_page: 1000 });
      this.areas = res.data.data.data;
    },

    // prefill the shop code with the next auto-generated value that
    // continues the existing "Shop<n>" numbering; the field stays editable
    // so the user can still override it
    async getNextShopCode() {
      try {
        const res = await ShopsApi.nextShopCode();

        this.form.shop_code = res.data.data;
      } catch (error) {
        console.error("Fetch Next Shop Code Error:", error);
      }
    },
    // add Shop
    async addShop() {
      this.loading = true;
      //  console.log(this.form);
      await ShopsApi.storeShop(this.form)
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
