<template>
  <div class="supplier_chain">
    <div class="supplier_processing">
      <!-- close buttons -->
      <div class="text-end">
        <VBtn
          icon="tabler-x"
          variant="none"
          color="#000000"
          @click="close('neverload')"
        />
      </div>

      <div class="add_supplier">
        <!-- title -->
        <h3 class="supplier_title">Update Supplier</h3>

        <div class="form">
          <!-- add form -->
          <VForm>
            <VRow>
              <!-- name -->
              <VCol lg="12" cols="12">
                <label class="label">Name</label>
                <div class="mt-2" />
                <VTextField
                  placeholder="Lindsey Stroud"
                  class="input"
                  v-model="form.suplier_name"
                  :rules="[required]"
                />
              </VCol>
            </VRow>

            <VRow>
              <!-- email -->
              <VCol lg="6" cols="12">
                <label class="label">E-mail</label>
                <div class="mt-2" />
                <VTextField
                  placeholder="example@gmail.com"
                  class="input"
                  v-model="form.email"
                  :rules="[email]"
                />
              </VCol>

              <!-- address -->
              <VCol lg="6" cols="12">
                <label class="label">Address</label>
                <div class="mt-2" />
                <VTextField
                  placeholder="Lindsey Stroud"
                  class="input"
                  v-model="form.suplier_address"
                />
              </VCol>
              <!-- phone number -->
              <VCol lg="6" cols="12">
                <label class="label">Phone Number</label>
                <div class="mt-2" />
                <VTextField
                  placeholder="012 345 6789"
                  class="input"
                  v-model="form.contact_no"
                />
              </VCol>
            </VRow>
            <div class="pt-15" />

            <!-- submit button -->
            <div class="text-right">
              <VBtn
                class="button"
                variant="none"
                @click="updateSuplier()"
                :loading="loading"
              >
                <span class="btn_text">Update</span>
              </VBtn>
            </div>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SupplierApi from "@/Api/Modules/supply_chain";
import commonmixins from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],

  data() {
    return {
      form: {},
      loading: false,
    };
  },
  methods: {
    // close modal
    close(data) {
      this.$emit("closemodal", data);
    },
    // update suplier
    async updateSuplier() {
      this.loading = true;

      await SupplierApi.updateSupplier(this.form, this.form.id)
        .then(() => {
          this.loading = false;
          this.close("load");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },

  props: {
    suplierData: Object,
  },
  created() {
    this.form = { ...this.suplierData };
  },
};
</script>
