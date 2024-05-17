<template>
  <div>
    <h1>My Recipes</h1>
    <recipe-card></recipe-card>
  </div>
</template>

<script>
//todo: klikom se otvara kartica s receptom
import RecipeCard from "@/components/RecipeCard.vue";

export default {
  components: {
    RecipeCard,
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
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetail", params: { id } });
    },
  },
};
</script>
