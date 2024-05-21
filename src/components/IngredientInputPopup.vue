<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="headline">Add Ingredients</v-card-title>
      <v-card-text>
        <v-form ref="form" class="d-flex">
          <v-text-field
            v-model="newIngredient"
            label="Ingredient"
            required
            class="mr-2"></v-text-field>
          <v-text-field
            v-model="newQuantity"
            label="Quantity"
            required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addIngredient">Add</v-btn>
        <v-btn color="secondary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "IngredientInputPopup",
  data() {
    return {
      dialog: false,
      newIngredient: "",
      newQuantity: "",
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },
    addIngredient() {
      if (this.newIngredient && this.newQuantity) {
        this.$emit("add-ingredient", {
          ingredient: this.newIngredient,
          quantity: this.newQuantity,
        });
        this.resetForm();
      }
    },
    resetForm() {
      this.newIngredient = "";
      this.newQuantity = "";
    },
  },
};
</script>

<style scoped>
.d-flex {
  display: flex;
}
.mr-2 {
  margin-right: 8px;
}
</style>
