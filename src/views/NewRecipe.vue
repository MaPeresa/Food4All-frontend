<template>
  <!-- add ingredients -->

  <!-- add filters vege, ...(https://vue-multiselect.js.org/#sub-getting-started) -->
  <div class="container">
    <h1 class="modal-title fs-5" id="exampleModalLabel">Make a new recipe</h1>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="modal"
      aria-label="Close"></button>

    <div class="modal-body">
      <form @submit.prevent="addRecipe" class="form-inline mb-5">
        <div class="form-group">
          <label for="title" class="form-label">Recipe title</label>
          <input
            v-model="newTitle"
            type="text"
            class="form-control"
            id="title"
            required
            placeholder="Enter the title here"
            title="" />
        </div>
        <div class="form group">
          <label for="photo" class="form-label">Photo</label>
          <input
            type="file"
            class="form-control"
            id="photo"
            @change="handleFileUpload"
            required
            accept="image/*" />
        </div>

        <div class="form-group">
          <label for="mealType" class="form-label">Meal type</label>
          <select
            v-model="newMealType"
            class="form-select"
            id="mealType"
            required
            title="Select">
            <option disabled value="">Select meal type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>

        <div class="form-group">
          <label for="time" class="form-label">Time</label>
          <div class="input-group">
            <input
              v-model="newTime"
              type="number"
              class="form-control"
              placeholder="Cooking time"
              aria-label="Cooking time"
              aria-describedby="basic-addon2" />
            <span class="input-group-text" id="basic-addon2">minutes</span>
          </div>
        </div>

        <div class="form-group">
          <label for="instructions" class="form-label">Instructions</label>
          <textarea
            v-model="newInstructions"
            class="form-control"
            id="instructions"
            required
            style="height: 150px"
            placeholder="Write a step-by-step instructions for preparing"
            title="Write a step-by-step instructions for preparing"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">
          Add Recipe
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import store from "@/store";
import firebase from "firebase/app";
import "firebase/storage";

export default {
  name: "NewRecipe",
  data() {
    return {
      newTitle: "",
      newTime: "",
      newMealType: "",
      newInstructions: "",
      newPhoto: null,
    };
  },
  methods: {
    addRecipe(event) {
      event.preventDefault();
      const user = firebase.auth().currentUser; // Get the current user
      if (this.newPhoto && user) {
        const storageRef = firebase
          .storage()
          .ref(`recipes/${user.uid}/${this.newPhoto.name}`);
        const uploadTask = storageRef.put(this.newPhoto);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optional: Handle progress
          },
          (error) => {
            console.error("Error uploading file:", error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.saveRecipe(downloadURL);
            });
          }
        );
      } else {
        console.error("User is not authenticated or photo is not selected.");
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.newPhoto = file;
    },
    saveRecipe(photoUrl) {
      const recipeData = {
        naslov: this.newTitle,
        opis: this.newInstructions,
        slika: photoUrl,
        mail: store.currentUser,
        postedAt: new Date(),
        vrijeme_kuhanja: this.newTime,
        tip: this.newmealType,
      };

      db.collection("recipes")
        .add(recipeData)
        .then(() => {
          this.resetForm();
          this.$router.push({ name: "MyRecipes" }).then(() => {
            this.$emit("recipeAdded");
          });
        })
        .catch((error) => {
          console.error("Error adding recipe: ", error);
        });
    },
    resetForm() {
      (this.newTitle = ""),
        (this.newTime = ""),
        (this.newMealType = ""),
        (this.newInstructions = ""),
        (this.newPhoto = "");
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
