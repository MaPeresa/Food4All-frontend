<template>
  <div>
    <h1>My Recipes</h1>
    <recipe-card :recipes="recipes"></recipe-card>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import { db, auth } from "@/firebase";

export default {
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
      const currentUser = auth.currentUser;
      if (!currentUser) {
        this.error = "You need to be logged in to see your recipes.";
        return;
      }
      db.collection("recipes")
        .where("userId", "==", currentUser.uid)
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
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetail", params: { id } });
    },
  },
  mounted() {
    this.fetchRecipes();
  },
};
</script>
