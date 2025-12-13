<template>
  <div>
    <v-container class="login-paddings">
      <div>
        <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
          <VCardText>
            <h4 class="text-h4 mb-1">
              Welcome to
              <span class="text-capitalize">{{ company_name }}</span
              >! 👋🏻
            </h4>
            <p class="mb-0">
              Please sign-in to your account and start the adventure
            </p>
          </VCardText>
          <div class="pt-1"></div>
          <VCardText>
            <VForm @submit.prevent="() => {}" v-model="formValidate">
              <VRow>
                <!-- email -->
                <label class="label"> Email*</label>
                <VCol lg="12" cols="12">
                  <v-text-field
                    v-model="form.email"
                    autofocus
                    :rules="[required, email]"
                    type="email"
                    class="common_input"
                    placeholder="Emaiil.."
                  />
                </VCol>

                <!-- password -->
                <label class="label pt-2"> Password*</label>
                <VCol lg="12" cols="12">
                  <v-text-field
                    class="common_input"
                    v-model="form.password"
                    :rules="[required]"
                    :type="show1 ? 'password' : 'text'"
                    placeholder="············"
                  >
                    <template #append-inner>
                      <img
                        @click="show1 = !show1"
                        src="@/assets/images/eye.png"
                        style="
                          width: 20px;
                          height: 20px;
                          object-fit: contain;
                          cursor: pointer;
                        "
                      />
                    </template>
                  </v-text-field>
                  <div class="mt-5"></div>

                  <VBtn
                    :loading="loading"
                    block
                    :disabled="!formValidate"
                    type="submit"
                    @click="userLogin()"
                  >
                    Login
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </div>
    </v-container>
  </div>
</template>
<script>
import authApi from "@/Api/Modules/auth";
export default {
  data() {
    return {
      formValidate: false,
      form: {},
      loading: false,
      show1: true,
    };
  },

  methods: {
    // user login
    async userLogin() {
      this.loading = true;
      await authApi
        .login(this.form)
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-paddings {
  padding-left: 25%;
  padding-right: 25%;
  @media screen and (max-width: 600px) {
    padding-left: 0%;
    padding-right: 0%;
  }
  @media (min-width: 600px) and (max-width: 1024px) {
    padding-left: 0%;
    padding-right: 0%;
  }
}
</style>
