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
export default {
  name: "Recipes",
  props: {
    recipes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetail", params: { id } });
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
</style>

<!-- HTML !-->
<button
  class="button-64"
  role="button"><span class="text">Button 64</span></button>

/* CSS */ .button-64 { align-items: center; background-image:
linear-gradient(144deg,#AF40FF, #5B42F3 50%,#00DDEB); border: 0; border-radius:
8px; box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px; box-sizing:
border-box; color: #FFFFFF; display: flex; font-family: Phantomsans, sans-serif;
font-size: 20px; justify-content: center; line-height: 1em; max-width: 100%;
min-width: 140px; padding: 3px; text-decoration: none; user-select: none;
-webkit-user-select: none; touch-action: manipulation; white-space: nowrap;
cursor: pointer; } .button-64:active, .button-64:hover { outline: 0; }
.button-64 span { background-color: rgb(5, 6, 45); padding: 16px 24px;
border-radius: 6px; width: 100%; height: 100%; transition: 300ms; }
.button-64:hover span { background: none; } @media (min-width: 768px) {
.button-64 { font-size: 24px; min-width: 196px; } }
