import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import store from "@/store";

const vuetify = createVuetify({
  components,
  directives,
});

store.checkAuth().then(() => {
  createApp(App).use(router).use(vuetify).mount("#app");
});

/* ili za više plugina const app = createApp(App)
[vuetify, router].forEach((p) => app.use(p));
app.mount('#app); */
