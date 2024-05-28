<template>
  <div>
    <h1>My Recipes</h1>
    <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
    <recipe-card v-else :recipes="recipes"></recipe-card>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import { db, auth } from "@/firebase";
import { ref, onMounted } from "vue";

export default {
  name: "MyRecipes",
  components: {
    RecipeCard,
  },
  setup() {
    const recipes = ref([]);
    const error = ref(null);
    const loading = ref(true);

    const fetchRecipes = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        error.value = "You need to be logged in to see your recipes.";
        loading.value = false;
        return;
      }

      db.collection("recipes")
        .where("userId", "==", currentUser.uid)
        .get()
        .then((querySnapshot) => {
          recipes.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          loading.value = false;
        })
        .catch((err) => {
          console.error("Error fetching recipes:", err);
          error.value = "Failed to load recipes. Please try again later.";
          loading.value = false;
        });
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      error,
      loading,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
