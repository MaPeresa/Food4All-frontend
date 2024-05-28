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
                  <strong>Cooking Time:</strong>
                  {{ recipe.cookingTime }} minutes
                </div>
                <v-rating
                  v-model="recipe.rating"
                  size="x-small"
                  active-color="yellow"
                  color="grey"
                  density="comfortable"
                  readonly></v-rating>
              </div>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-dialog v-model="showRecipePopup" max-width="600px">
      <v-card>
        <v-card-title class="headline">{{ selectedRecipe.title }}</v-card-title>
        <div class="image-container">
          <v-img
            v-if="selectedRecipe.photoUrl"
            :src="selectedRecipe.photoUrl"
            height="300"
            cover></v-img>
          <div class="overlay-text">
            <div>
              <strong> {{ selectedRecipe.username }}</strong>
            </div>
          </div>
        </div>
        <v-card-text>
          <div><strong>Meal Type:</strong> {{ selectedRecipe.mealType }}</div>
          <div>
            <strong>Cooking Time:</strong>
            {{ selectedRecipe.cookingTime }} minutes
          </div>
          <div>
            <strong>Description:</strong> {{ selectedRecipe.description }}
          </div>
          <v-rating v-model="selectedRecipe.rating" readonly></v-rating>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showRecipePopup = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Recipes",
  props: {
    recipes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showRecipePopup: false,
      selectedRecipe: {},
    };
  },
  methods: {
    openRecipePopup(recipe) {
      this.selectedRecipe = recipe;
      this.showRecipePopup = true;
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
</style>
