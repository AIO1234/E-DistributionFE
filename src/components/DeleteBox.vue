<template>
  <div>
    <center>
      <img
        src="@/assets/images/delete-button-vector-3374774.jpg"
        class="delete_img"
      />
      <div class="mt-5"></div>
      <div>
        <h2 class="title">
          Are You Sure You want To <br />Delete This {{ caption }}?
        </h2>
      </div>
      <div class="mt-8"></div>
      <v-row>
        <v-col lg="6">
          <v-btn class="cancel_button" variant="none" @click="closeModal()"
            ><span class="text">Cancel</span></v-btn
          >
        </v-col>

        <v-col lg="6">
          <v-btn class="del_button" variant="none"
            ><span class="text">Delete</span></v-btn
          >
        </v-col>
      </v-row>
    </center>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },

  methods: {
    closeModal() {
      this.$emit("closeModal", false);
    },
  },
  props: {
    caption: String,
  },
};
</script>
