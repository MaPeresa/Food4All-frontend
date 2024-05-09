import { reactive } from "vue";
import { firebase } from "@/firebase";

const store = reactive({
  searchTerm: "",
  currentUser: null,
  checkAuth() {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user.email;
          resolve(true);
        } else {
          this.currentUser = null;
          resolve(false);
        }
      });
    });
  },
});

export default store;
