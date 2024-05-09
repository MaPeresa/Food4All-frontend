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
              <label for="phone">Phone number</label>
              <input
                type="tel"
                v-model="phone"
                class="form-control"
                placeholder="e.g. +385 91 234 5678"
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
/* import { ref } from "vue";
import { firebase } from "@/firebase"; */

export default {
  name: "Signup",
  data() {
    return {
      email: "",
      phone: "",
      password: "",
      passwordRepeat: "",
    };
  },
  /* methods: {
    signup() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          console.log("User signed up", userCredential.user);
          this.$router.push({ name: "FindaDog" });
        })
        .catch(function (error) {
          console.error("Error signing up", error);
        });
    },
  }, */
};
</script>
