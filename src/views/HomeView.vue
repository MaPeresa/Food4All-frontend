<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2" class="sticky-tabs">
        <v-tabs v-model="tab" bg-color="#780000" direction="vertical">
          <v-tab value="allRecipes">All Recipes</v-tab>
          <v-tab value="myRecipes">My Recipes</v-tab>
          <v-tab value="favorites">Favorites</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="10">
        <v-card-text>
          <v-row class="mb-4">
            <v-col cols="6">
              <v-text-field
                v-model="searchQuery"
                label="Search Recipes"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="selectedFilters"
                :items="filterOptions"
                label="Filter Recipes"
                chips
                closable-chips
                multiple></v-autocomplete>
            </v-col>
          </v-row>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="allRecipes">
              <h1>All Recipes</h1>
              <v-progress-circular
                v-if="loading"
                indeterminate></v-progress-circular>
              <div v-else>
                <recipe-card :recipes="paginatedRecipes"></recipe-card>
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  class="mt-4"></v-pagination>
              </div>
              <v-alert v-if="error" type="error">{{ error }}</v-alert>
            </v-tabs-window-item>

            <v-tabs-window-item value="myRecipes">
              <my-recipes />
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
import RecipeCard from "@/components/RecipeCard.vue";
import MyRecipes from "@/components/MyRecipes.vue";
import { db, auth } from "@/firebase";
import { ref, computed, onMounted } from "vue";

export default {
  name: "HomeView",
  components: {
    RecipeCard,
    MyRecipes,
  },
  setup() {
    const tab = ref("allRecipes");
    const recipes = ref([]);
    const error = ref(null);
    const loading = ref(true);
    const page = ref(1);
    const itemsPerPage = 15;
    const searchQuery = ref("");
    const selectedFilters = ref([]);
    const filterOptions = [
      "Vegetarian",
      "Vegan",
      "Nut Free",
      "Gluten Free",
      "Dairy Free",
      "Soy Free",
      "Under 15 minutes",
    ];

    const favoriteRecipes = ref([]);
    const errorFavorites = ref(null);
    const loadingFavorites = ref(true);

    const fetchRecipes = async () => {
      try {
        const querySnapshot = await db.collection("recipes").get();
        recipes.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (err) {
        console.error("Error fetching recipes:", err);
        error.value = "Failed to load recipes. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const fetchFavoriteRecipes = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        errorFavorites.value =
          "You need to be logged in to see your favorite recipes.";
        loadingFavorites.value = false;
        return;
      }

      db.collection("recipes")
        .where("favoritedBy", "array-contains", currentUser.uid)
        .get()
        .then((querySnapshot) => {
          favoriteRecipes.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          loadingFavorites.value = false;
        })
        .catch((err) => {
          console.error("Error fetching favorite recipes:", err);
          errorFavorites.value =
            "Failed to load favorite recipes. Please try again later.";
          loadingFavorites.value = false;
        });
    };

    onMounted(() => {
      fetchRecipes();
      fetchFavoriteRecipes();
    });

    const filteredRecipes = computed(() => {
      return recipes.value.filter((recipe) => {
        const matchesSearch = recipe.title
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());
        const matchesFilters =
          selectedFilters.value.length === 0 ||
          selectedFilters.value.every((filter) =>
            (recipe.filters || []).includes(filter)
          );
        return matchesSearch && matchesFilters;
      });
    });

    const paginatedRecipes = computed(() => {
      const start = (page.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredRecipes.value.slice(start, end);
    });

    const pageCount = computed(() => {
      return Math.ceil(filteredRecipes.value.length / itemsPerPage);
    });

    return {
      tab,
      recipes,
      error,
      loading,
      favoriteRecipes,
      errorFavorites,
      loadingFavorites,
      page,
      searchQuery,
      selectedFilters,
      filterOptions,
      filteredRecipes,
      paginatedRecipes,
      pageCount,
    };
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
