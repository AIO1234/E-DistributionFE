<template>
  <div class="masterdata">
    <!-- title -->
    <h3 class="form_title">Add User</h3>

    <div class="form">
      <!-- add form -->
      <VForm v-model="isFormValid">
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

          <!-- password -->
          <v-col lg="12" cols="12">
            <label class="label">Password*</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              v-model="form.password"
              :rules="[required, password]"
              label="Password"
              placeholder="Enter Password"
              type="password"
            ></v-text-field>
          </v-col>

          <!-- confirm password -->
          <v-col lg="12" cols="12">
            <label class="label">Confirm Password*</label>
            <div class="mt-2"></div>
            <v-text-field
              class="input"
              v-model="form.password_confirmation"
              :rules="[required, confirm_password]"
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="pt-15" />

        <!-- submit button -->
        <div class="text-center">
          <VBtn
            class="button"
            :disabled="!isFormValid"
            color="#4340DA"
            @click="addUser()"
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
import usersApi from "@/Api/Modules/users";
export default {
  data() {
    return {
      form: {
        address: "",
        contact_no: "",
      },
      loading: false,
      isFormValid: false,
      roles: [],
    };
  },
  async created() {
    await this.getRoles();
  },
  methods: {
    // get user roles
    async getRoles() {
      const res = await usersApi.userRoles();
      this.roles = res.data.data;
    },

    // add User
    async addUser() {
      this.loading = true;
      //  console.log(this.form);
      await usersApi
        .storeUser(this.form)
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
