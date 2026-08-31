<template>
  <div class="supplier_chain">
    <div class="supplier_processing">
      <div class="add_supplier">
        <!-- close buttons -->
        <div class="text-end">
          <VBtn
            icon="tabler-x"
            variant="none"
            color="#000000"
            @click="close('neverload')"
          />
        </div>

        <!-- title -->
        <h3 class="supplier_title">Add Supplier</h3>

        <div class="form">
          <!-- add form -->
          <VForm>
            <VRow>
              <!-- name -->
              <VCol lg="6" cols="12">
                <label class="label">Name</label>
                <div class="mt-2" />
                <VTextField
                  v-model="form.suplier_name"
                  placeholder="Lindsey Stroud"
                  class="input"
                  :rules="[required]"
                />
              </VCol>

              <!-- address -->
              <VCol lg="6" cols="12">
                <label class="label">Address</label>
                <div class="mt-2" />
                <VTextField
                  v-model="form.suplier_address"
                  placeholder="Lindsey Stroud"
                  class="input"
                />
              </VCol>
            </VRow>

            <VRow>
              <!-- email -->
              <VCol lg="6" cols="12">
                <label class="label">E-mail</label>
                <div class="mt-2" />
                <VTextField
                  v-model="form.email"
                  placeholder="example@gmail.com"
                  class="input"
                  :rules="[email]"
                />
              </VCol>

              <!-- phone number -->
              <VCol lg="6" cols="12">
                <label class="label">Phone Number</label>
                <div class="mt-2" />
                <VTextField
                  v-model="form.contact_no"
                  placeholder="012 345 6789"
                  class="input"
                />
              </VCol>
            </VRow>
            <div class="pt-15" />

            <!-- submit button -->
            <div class="text-right">
              <VBtn
                class="button"
                variant="none"
                :loading="loading"
                @click="addsupplier"
              >
                <span class="btn_text">Add</span>
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
    // close suplier add modal
    close(data) {
      this.$emit("closemodal", data);
    },

    // add suplier
    async addsupplier() {
      this.loading = true;

      //  console.log(this.form);
      await SupplierApi.storeSupplier(this.form)
        .then(() => {
          this.loading = false;
          this.close("load");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
