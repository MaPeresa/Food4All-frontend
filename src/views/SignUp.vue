<template>
  <div class="signup">
    <h1>Signup Page</h1>
    <div class="container">
      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
          <form @submit.prevent="signup">
            <div class="form-group">
              <label for="email">Email address</label>
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="Enter email"
                required />
            </div>
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="username"
                v-model="username"
                class="form-control"
                placeholder="Pick a unique username"
                required />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                v-model="password"
                class="form-control"
                placeholder="Password"
                required />
            </div>
            <div class="form-group">
              <label for="passwordRepeat">Repeat Password</label>
              <input
                type="password"
                v-model="passwordRepeat"
                class="form-control"
                placeholder="Retype your Password"
                required />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
        <div class="col-sm"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from "@/firebase";

export default {
  name: "Signup",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
    };
  },
  methods: {
    signup() {
      if (this.password !== this.passwordRepeat) {
        console.error("Passwords do not match");
        return;
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          console.log("User signed up", userCredential.user);
          return userCredential.user.updateProfile({
            displayName: this.username,
          });
        })
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch((error) => {
          console.error("Error signing up", error);
        });
    },
  },
};
</script>
