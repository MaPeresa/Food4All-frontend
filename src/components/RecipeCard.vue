<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="recipe in recipes" :key="recipe.id">
        <v-card
          @click="viewRecipe(recipe.id)"
          class="cursor-pointer d-flex flex-column justify-end"
          ripple
          height="300px">
          <v-img
            :src="recipe.photoUrl"
            height="100%"
            width="100%"
            cover
            class="position-absolute"></v-img>
          <v-card-text class="position-relative mt-auto text-background p-0">
            <div class="gradient-div">
              <div class="text-content">
                <div>{{ recipe.title }}</div>
                <div>{{ recipe.username }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "@/firebase";

export default {
  name: "Recipes",
  data() {
    return {
      recipes: [],
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
</style>
