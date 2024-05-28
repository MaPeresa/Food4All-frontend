<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2" class="sticky-tabs">
        <v-tabs v-model="tab" bg-color="#780000" direction="vertical">
          <v-tab value="myRecipes">My Recipes</v-tab>
          <v-tab value="newRecipe">New Recipe</v-tab>
          <v-tab value="favorites">Favorites</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="10">
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="myRecipes">
              <my-recipes />
            </v-tabs-window-item>

            <v-tabs-window-item value="newRecipe">
              <new-recipe />
            </v-tabs-window-item>

            <v-tabs-window-item value="favorites">
              <v-progress-circular
                v-if="loadingFavorites"
                indeterminate></v-progress-circular>
              <recipe-card v-else :recipes="favoriteRecipes"></recipe-card>
              <v-alert v-if="errorFavorites" type="error">{{
                errorFavorites
              }}</v-alert>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MyRecipes from "@/components/MyRecipes.vue";
import NewRecipe from "@/components/NewRecipe.vue";
import RecipeCard from "@/components/RecipeCard.vue";
import { db, auth } from "@/firebase";
import { ref, onMounted } from "vue";

export default {
  name: "MyAccount",
  components: {
    MyRecipes,
    NewRecipe,
    RecipeCard,
  },
  data() {
    return {
      tab: "myRecipes",
      favoriteRecipes: [],
      errorFavorites: null,
      loadingFavorites: true,
    };
  },
  methods: {
    fetchFavoriteRecipes() {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        this.errorFavorites =
          "You need to be logged in to see your favorite recipes.";
        this.loadingFavorites = false;
        return;
      }

      db.collection("recipes")
        .where("favoritedBy", "array-contains", currentUser.uid)
        .get()
        .then((querySnapshot) => {
          this.favoriteRecipes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.loadingFavorites = false;
        })
        .catch((err) => {
          console.error("Error fetching favorite recipes:", err);
          this.errorFavorites =
            "Failed to load favorite recipes. Please try again later.";
          this.loadingFavorites = false;
        });
    },
  },
  mounted() {
    this.fetchFavoriteRecipes();
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.sticky-tabs {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
</style>
