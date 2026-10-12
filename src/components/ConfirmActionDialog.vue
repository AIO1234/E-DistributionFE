<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440px"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="pa-6 text-center">
      <v-card-text class="text-h6">{{ question }}</v-card-text>
      <v-card-actions class="justify-center ga-3">
        <v-btn variant="outlined" @click="$emit('cancel')">No</v-btn>
        <v-btn color="primary" @click="$emit('confirm')">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmActionDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    question: {
      type: String,
      default: "Do you want to continue?",
    },
  },
  emits: ["update:modelValue", "confirm", "cancel"],
};
</script>
