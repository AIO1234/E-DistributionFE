<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Update Distributor</h3>

    <div class="form">
      <!-- add form -->
      <VForm ref="form" v-model="isFormValid">
        <v-row>
          <!-- User Name -->
          <v-col lg="12" cols="12">
            <label class="label">User Name*</label>
            <div class="mt-2"></div>
            <v-text-field
              placeholder="User Name"
              class="input"
              :rules="[required]"
              v-model="form.name"
            ></v-text-field>
          </v-col>

          <!-- Email -->
          <v-col lg="12" cols="12">
            <label class="label">Email*</label>
            <div class="mt-2"></div>
            <v-text-field
              placeholder="Email"
              :rules="[required, email]"
              class="input"
              v-model="form.email"
            ></v-text-field>
          </v-col>

          <!-- Mobile -->
          <v-col lg="12" cols="12">
            <label class="label">Mobile*</label>
            <div class="mt-2"></div>
            <v-text-field
              placeholder="Mobile"
              class="input"
              v-model="form.contact_no"
            ></v-text-field>
          </v-col>

          <!-- Address -->
          <v-col lg="12" cols="12">
            <label class="label">Address*</label>
            <div class="mt-2"></div>
            <v-text-field
              placeholder="Address"
              class="input"
              v-model="form.address"
            ></v-text-field>
          </v-col>

          <!-- role -->
          <v-col lg="12" cols="12">
            <label class="label">Select Role*</label>
            <div class="mt-2"></div>
            <v-autocomplete
              :items="roles"
              class="input"
              v-model="form.user_type"
              item-value="name"
              :rules="[required]"
              item-title="name"
              placeholder="Select Role"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            :disabled="!isFormValid"
            class="button"
            color="#4340DA"
            @click="updateUser()"
            :loading="loading"
          >
            <span class="btn_text">Update</span>
          </VBtn>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script>
import usersApi from "@/Api/Modules/users";
export default {
  data() {
    return {
      isFormValid: false,
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
    initiaizeData() {
      this.form = this.formData;
      this.form.user_type = this.formData.user_with_roles[0].name;
    },

    // update user
    async updateUser() {
      this.loading = true;

      await usersApi
        .updateUser(this.form)
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
