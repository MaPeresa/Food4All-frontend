<template>
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
            placeholder="Enter the title here" />
        </div>
        <div class="form-group">
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
            required>
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
            placeholder="Write step-by-step instructions"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Ingredients</label>
          <v-btn @click="showIngredientInputPopup">Add Ingredient</v-btn>
          <ul>
            <li v-for="(item, index) in ingredients" :key="index">
              {{ item.ingredient }} - {{ item.quantity }}
            </li>
          </ul>
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
    <ingredient-input-popup
      ref="ingredientInputPopup"
      @add-ingredient="addIngredient"></ingredient-input-popup>
  </div>
</template>

<script>
import { db } from "@/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import IngredientInputPopup from "@/components/IngredientInputPopup.vue";
import { ref } from "vue";

export default {
  name: "NewRecipe",
  components: {
    IngredientInputPopup,
  },
  setup() {
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");
    const newTitle = ref("");
    const newTime = ref("");
    const newMealType = ref("");
    const newInstructions = ref("");
    const newPhoto = ref(null);
    const ingredients = ref([]);

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      newPhoto.value = file;
    };

    const addRecipe = (event) => {
      event.preventDefault();
      const user = firebase.auth().currentUser;
      if (newPhoto.value && user) {
        const storageRef = firebase
          .storage()
          .ref(`recipes/${user.uid}/${newPhoto.value.name}`);
        const uploadTask = storageRef.put(newPhoto.value);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error("Error uploading file:", error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              saveRecipe(downloadURL, user);
            });
          }
        );
      } else {
        console.error("User is not authenticated or photo is not selected.");
      }
    };

    const saveRecipe = (photoUrl, user) => {
      if (
        !newTitle.value ||
        !newInstructions.value ||
        !newTime.value ||
        !newMealType.value ||
        !photoUrl
      ) {
        snackbarText.value = "Please fill all the fields before submitting.";
        snackbarColor.value = "error";
        snackbar.value = true;
        return;
      }

      const recipeData = {
        title: newTitle.value,
        description: newInstructions.value,
        photoUrl,
        userId: user.uid,
        username: user.displayName,
        email: user.email,
        postedAt: new Date(),
        cookingTime: newTime.value,
        mealType: newMealType.value,
        ingredients: ingredients.value,
      };

      db.collection("recipes")
        .add(recipeData)
        .then(() => {
          snackbarText.value = "Recipe successfully added!";
          snackbar.value = true;
          resetForm();
        })
        .catch((error) => {
          snackbarText.value = "Failed to add recipe: " + error.message;
          snackbarColor.value = "error";
          snackbar.value = true;
        });
    };

    const resetForm = () => {
      newTitle.value = "";
      newTime.value = "";
      newMealType.value = "";
      newInstructions.value = "";
      newPhoto.value = null;
      ingredients.value = [];
    };

    const showIngredientInputPopup = () => {
      refs.ingredientInputPopup.openDialog();
    };

    const addIngredient = (ingredient) => {
      ingredients.value.push(ingredient);
    };

    return {
      snackbar,
      snackbarText,
      snackbarColor,
      newTitle,
      newTime,
      newMealType,
      newInstructions,
      newPhoto,
      ingredients,
      handleFileUpload,
      addRecipe,
      resetForm,
      showIngredientInputPopup,
      addIngredient,
    };
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
