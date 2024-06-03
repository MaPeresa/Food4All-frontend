<template>
  <v-container v-if="isLoggedIn">
    <h1>Add a new recipe</h1>

    <v-form @submit.prevent="addRecipe">
      <v-text-field
        v-model="newTitle"
        label="Recipe title"
        required
        outlined
        class="mb-4"></v-text-field>

      <v-file-input
        v-model="newPhoto"
        label="Photo"
        required
        outlined
        accept="image/*"
        class="mb-4"></v-file-input>

      <v-autocomplete
        v-model="newMealType"
        label="Meal type"
        class="mb-4"
        :items="['Breakfast', 'Lunch', 'Dinner', 'Snack']"></v-autocomplete>

      <v-text-field
        v-model="newTime"
        label="Cooking time (minutes)"
        type="number"
        required
        outlined
        class="mb-4"></v-text-field>

      <v-btn @click="showIngredientInputPopup" class="mb-4"
        >Add Ingredient</v-btn
      >

      <ul class="ingredients-list">
        <li v-for="(item, index) in ingredients" :key="index">
          {{ item.ingredient }} - {{ item.quantity }}
        </li>
      </ul>
      <v-textarea
        v-model="newInstructions"
        label="Instructions"
        required
        outlined
        class="mb-4"></v-textarea>

      <v-autocomplete
        v-model="filters"
        :items="filterOptions"
        label="Add filters"
        chips
        closable-chips
        multiple
        class="mb-4"></v-autocomplete>

      <v-btn type="submit" color="#780000" class="mt-4">Add Recipe</v-btn>
    </v-form>

    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :color="snackbarColor"
      closeable>
      {{ snackbarText }}
      <template v-slot:actions="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>

    <ingredient-input-popup
      ref="ingredientInputPopup"
      @add-ingredient="addIngredient"></ingredient-input-popup>
  </v-container>
  <v-alert v-else type="error"
    >You need to be logged in to add a recipe.</v-alert
  >
</template>

<script>
import { db } from "@/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import IngredientInputPopup from "@/components/IngredientInputPopup.vue";
import { ref, onMounted } from "vue";

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
    const filters = ref([]);
    const isLoggedIn = ref(false);
    const ingredientInputPopup = ref(null);
    const filterOptions = [
      "Vegetarian",
      "Vegan",
      "Nut Free",
      "Gluten Free",
      "Dairy Free",
      "Soy Free",
      "Under 15 minutes",
    ];

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      newPhoto.value = file;
    };

    const addRecipe = () => {
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
        filters: filters.value,
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
      filters.value = [];
    };

    const showIngredientInputPopup = () => {
      if (ingredientInputPopup.value) {
        ingredientInputPopup.value.openDialog();
      }
    };

    const addIngredient = (ingredient) => {
      ingredients.value.push(ingredient);
    };

    const checkUserStatus = () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      });
    };

    onMounted(() => {
      checkUserStatus();
    });

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
      filters,
      filterOptions,
      handleFileUpload,
      addRecipe,
      resetForm,
      showIngredientInputPopup,
      addIngredient,
      isLoggedIn,
      ingredientInputPopup,
    };
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.ingredients-list {
  list-style-type: none;
  padding-left: 20px;
  text-align: left;
}
</style>
