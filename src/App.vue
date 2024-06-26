<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <a class="navbar-brand">
          <img src="@/assets/logo1.png" width="50" height="50" alt="" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li v-if="!store.currentUser" class="nav-item">
              <router-link to="/Login" class="nav-link">Login</router-link>
            </li>
            <li v-if="!store.currentUser" class="nav-item">
              <router-link to="/SignUp" class="nav-link">Sign up</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/MyAccount" class="nav-link"
                >My Account</router-link
              >
            </li>
            <li v-if="store.currentUser" class="nav-item">
              <a @click.prevent="logout" class="nav-link">Log out</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import store from "@/store";
import { firebase } from "@/firebase";
import router from "@/router";
import { onMounted } from "vue";

export default {
  name: "App",
  setup() {
    onMounted(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log("User is logged in", user.email);
          store.currentUser = user.email;
        } else {
          console.log("User is not logged in");
          store.currentUser = null;
        }
      });
    });

    const logout = () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("User logged out");
          store.currentUser = null;
          router.push("/Login");
        })
        .catch((error) => {
          console.error("An error occurred", error);
        });
    };

    return {
      store,
      logout,
    };
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap");

* {
  font-family: "Nunito", sans-serif;
}

.v-col {
  padding: 0;
}

#app {
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2b2d42 !important;
  min-height: 1024px;
  background-size: 100%;
}

.btn-primary {
  --bs-btn-color: #8d99ae !important;
  --bs-btn-bg: rgba(237, 242, 244, 0.18);
  --bs-btn-border-color: #8d99ae;
  --bs-btn-hover-color: #8d99ae;
  --bs-btn-hover-bg: rgba(237, 242, 244, 0.18);
  --bs-btn-hover-border-color: rgba(237, 242, 244, 0.18);
  --bs-btn-focus-shadow-rgb: 49, 132, 253;
  --bs-btn-active-color: rgba(237, 242, 244, 0.18);
  --bs-btn-active-bg: rgba(237, 242, 244, 0.18);
  --bs-btn-active-border-color: #8d99ae;
  --bs-btn-active-shadow: inset 8 8px 10px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: rgba(254, 216, 80, 0.01);
  --bs-btn-disabled-bg: rgba(237, 242, 244, 0.18);
  --bs-btn-disabled-border-color: #8d99ae;
  position: static;
  background-color: #8d99ae;
  border-radius: 8px;
  box-shadow: 8px 8px 10px #00000040;
  height: 64px;
  width: 400px;
  margin-top: 2rem;
}

.btn-secondary {
  --bs-btn-color: #8d99ae;
  --bs-btn-bg: #8d99ae14;
  --bs-btn-border-color: #8d99ae;
  --bs-btn-hover-color: #8d99ae;
  --bs-btn-hover-bg: transparent;
  --bs-btn-hover-border-color: transparent;
  --bs-btn-focus-shadow-rgb: 49, 132, 253;
  --bs-btn-active-color: #8d99ae;
  --bs-btn-active-bg: rgba(237, 242, 244, 0.18);
  --bs-btn-active-border-color: #8d99ae;
  --bs-btn-active-shadow: inset 8 8px 10px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #8d99ae;
  --bs-btn-disabled-bg: rgba(237, 242, 244, 0.18);
  --bs-btn-disabled-border-color: #8d99ae;
  position: static;
  background-color: #8d99ae14;
  border-radius: 8px;
  box-shadow: 8px 8px 10px #00000040;
  height: 64px;
  width: 400px;
}

.listings-screen {
  margin-bottom: 1rem;
  background-color: #8d99ae14;
  border: 1px solid;
  border-color: #8d99ae;
  border-radius: 8px;
  height: auto;
  overflow: hidden;
  position: relative;
  width: 914px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
}

.mb-3 {
  margin: 1rem !important;
  border: 1px solid;
  border-radius: 8px;
  border-color: #8d99ae;
  color: #8d99ae;
  padding: 10px;
}

.img-fluid {
  max-width: 100%;
  height: 100%;
  object-fit: cover;
}

nav {
  padding: 30px;
  background-color: #780000 !important;
  color: #ffffff;
  font-weight: bold;

  a {
    color: #ffffff !important;
    &.router-link-exact-active {
      text-transform: uppercase;
      font-weight: extra-light;
      color: #ffffff;
      background: rgba(237, 242, 244, 0.28);
      border-radius: 8px;
    }
  }
}
</style>
