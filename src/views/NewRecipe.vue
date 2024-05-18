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
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :color="snackbarColor"
      closeable>
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
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
              this.saveRecipe(downloadURL, user);
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
    saveRecipe(photoUrl, user) {
      if (
        !this.newTitle ||
        !this.newInstructions ||
        !this.newTime ||
        !this.newMealType ||
        !photoUrl
      ) {
        this.snackbarText = "Please fill all the fields before submitting.";
        this.snackbarColor = "error";
        this.snackbar = true;
        return;
      }

      const recipeData = {
        title: this.newTitle,
        description: this.newInstructions,
        photoUrl: photoUrl,
        userId: user.uid, // Save user ID
        username: user.displayName, // Save username
        email: user.email,
        postedAt: new Date(),
        cookingTime: this.newTime,
        mealType: this.newMealType,
      };

      db.collection("recipes")
        .add(recipeData)
        .then(() => {
          this.snackbarText = "Recipe successfully added!";
          this.snackbar = true;
          this.resetForm();
        })
        .catch((error) => {
          this.snackbarText = "Failed to add recipe: " + error.message;
          this.snackbarColor = "error";
          this.snackbar = true;
        });
    },
    resetForm() {
      this.newTitle = "";
      this.newTime = "";
      this.newMealType = "";
      this.newInstructions = "";
      this.newPhoto = null;
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
