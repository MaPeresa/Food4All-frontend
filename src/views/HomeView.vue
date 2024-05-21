<template>
  <v-container>
    <h1>All Recipes</h1>
    <recipe-card :recipes="recipes"></recipe-card>
  </v-container>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import { db } from "@/firebase";

export default {
  name: "Homeview",
  components: {
    RecipeCard,
  },
  data() {
    return {
      recipes: [],
      error: null,
    };
  },
  methods: {
    fetchRecipes() {
      db.collection("recipes")
        .get()
        .then((querySnapshot) => {
          this.recipes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        })
        .catch((error) => {
          console.error("Error fetching recipes:", error);
          this.error = "Failed to load recipes. Please try again later.";
        });
    },
  },
  mounted() {
    this.fetchRecipes();
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
