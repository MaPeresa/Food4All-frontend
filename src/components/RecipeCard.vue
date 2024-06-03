<template>
  <v-container class="mx-auto pa-4" style="max-width: 1200px">
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="recipe in recipes" :key="recipe.id">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            class="cursor-pointer d-flex flex-column justify-end"
            v-bind="props"
            height="300px"
            @click="openRecipePopup(recipe)">
            <v-img
              :src="recipe.photoUrl"
              height="300"
              width="100%"
              cover></v-img>
            <v-card-text class="position-relative mt-auto text-background p-0">
              <div class="gradient-div">
                <div class="text-content">
                  <div>{{ recipe.title }}</div>
                  <div>{{ recipe.username }}</div>
                </div>
              </div>
            </v-card-text>

            <v-overlay
              :model-value="isHovering"
              class="align-center justify-center"
              scrim="rgba(255, 255, 255, 0.9)"
              contained>
              <div class="hover-content pa-4">
                <div><strong>Meal Type:</strong> {{ recipe.mealType }}</div>
                <div>
                  <svg-icon
                    type="mdi"
                    :path="mdiClockTimeFourOutline"></svg-icon>
                  {{ recipe.cookingTime }} minutes
                </div>
                <v-rating
                  v-model="recipe.userRating"
                  size="x-small"
                  active-color="yellow"
                  color="grey"
                  density="comfortable"
                  readonly
                  half-increments
                  @change="rateRecipe(recipe, $event)"></v-rating>
                <div></div>
              </div>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-dialog v-model="showRecipePopup" max-width="1000px">
      <v-card>
        <v-card-title class="headline popup-title">{{
          selectedRecipe.title
        }}</v-card-title>
        <v-card-text class="popup-content">
          <v-container>
            <v-row>
              <v-col cols="4">
                <div class="top-left">
                  <div>
                    <strong>Meal Type:</strong> {{ selectedRecipe.mealType }}
                  </div>
                  <div>
                    <svg-icon
                      type="mdi"
                      :path="mdiClockTimeFourOutline"></svg-icon>
                    {{ selectedRecipe.cookingTime }} minutes
                  </div>
                  <div>
                    <v-rating
                      v-model="selectedRecipe.userRating"
                      density="compact"
                      size="small"
                      half-increments
                      hover></v-rating>
                  </div>
                  <div>
                    Added by
                    {{ selectedRecipe.username }}
                  </div>
                </div>
              </v-col>
              <v-col cols="8">
                <div class="top-right image-container">
                  <v-img
                    v-if="selectedRecipe.photoUrl"
                    :src="selectedRecipe.photoUrl"
                    height="300"
                    cover></v-img>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <div class="bottom-left">
                  <strong>Ingredients:</strong>
                  <ul>
                    <li
                      v-for="(ingredient, index) in selectedRecipe.ingredients"
                      :key="index">
                      {{ ingredient.ingredient }} - {{ ingredient.quantity }}
                    </li>
                  </ul>
                </div>
              </v-col>
              <v-col cols="8">
                <div class="bottom-right">
                  <strong>Description:</strong>
                  <pre>{{ selectedRecipe.description }}</pre>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#780000" @click="showRecipePopup = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { db, auth } from "@/firebase";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClockTimeFourOutline } from "@mdi/js";
import firebase from "firebase/app";

export default {
  name: "Recipes",
  props: {
    recipes: {
      type: Array,
      required: true,
    },
  },
  components: {
    SvgIcon,
  },
  data() {
    return {
      showRecipePopup: false,
      selectedRecipe: {},
      mdiClockTimeFourOutline,
    };
  },
  methods: {
    openRecipePopup(recipe) {
      this.selectedRecipe = recipe;
      this.showRecipePopup = true;
    },
    async rateRecipe(recipe, rating) {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to be logged in to rate recipes.");
        return;
      }

      try {
        const recipeRef = db.collection("recipes").doc(recipe.id);
        await recipeRef.update({
          ratings: firebase.firestore.FieldValue.arrayUnion({
            userId: user.uid,
            rating,
          }),
        });

        // Recalculate average rating
        const doc = await recipeRef.get();
        const ratings = doc.data().ratings || [];
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / ratings.length;

        await recipeRef.update({ averageRating });

        // Update local state
        recipe.userRating = rating;
        recipe.averageRating = averageRating;
      } catch (error) {
        console.error("Error rating recipe: ", error);
      }
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.gradient-div {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgb(120, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(120, 0, 0, 0.01) 0%,
    rgba(120, 0, 0, 0.01) 23%,
    rgba(120, 0, 0, 1) 53%
  );
  padding: 10px;
}

.text-content {
  color: white;
  font-weight: bold;
  text-align: right;
}

.pre {
  font-family: Nunito;
}

.pa-4 {
  padding: 16px;
}

.hover-content {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
}

.image-container {
  position: relative;
  width: 100%;
}

.overlay-text {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
}

.top-left,
.top-right,
.bottom-left,
.bottom-right {
  padding: 10px;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  text-align: left;
}

.popup-title {
  background-color: #780000;
  color: white;
  text-align: center;
  width: 100%;
  height: 60px;
  font-size: x-large;
}

.popup-content {
  max-height: 80vh;
  overflow-y: auto;
}

.popup-content::-webkit-scrollbar {
  width: 7px;
}

.popup-content::-webkit-scrollbar-thumb {
  background-color: #780000;
  border-radius: 5px;
  border: 2px solid #ffffff;
}

.bottom-right pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: "Nunito", sans-serif;
}
</style>
