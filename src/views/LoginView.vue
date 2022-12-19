<script setup lang="ts">
import { ref } from "vue";
import TextInput from "../components/TextInput.vue";
import AppButton from "../components/AppButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

interface IUserLogin {
  username: string;
  password: string;
  error: string;
}

const login = ref<IUserLogin>({
  username: "",
  password: "",
  error: "",
});

async function handleLogin() {
  router.push("/library");
}
</script>

<template>
  <div class="loginPage">
    <!-- <img class="loginLogo" src="" alt="Marketing Logo" /> -->
    <form @submit.prevent="handleLogin" class="loginForm">
      <div class="form-group">
        <label for="username">User Name</label>
        <text-input v-model="login.username" type="text" name="username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <text-input v-model="login.password" type="password" name="password" />
      </div>
      <app-button type="submit" classes="btn btn-green">Log In</app-button>
    </form>
    <!-- <transition name="slide">
      <div class="error" v-if="auth.status == 'error'">
        {{ login.error }}
      </div>
    </transition> -->
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/scss/mixins";

.loginPage {
  height: 100vh;
  width: 100vw;
  background-image: url("@/assets/images/loginPage_bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
.loginLogo {
  display: block;
  margin: 0 auto 4rem;
  max-width: 100%;
}
h2 {
  margin-bottom: 4rem;
}
form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 37rem;
  padding: 2rem 6rem 4rem;
  border-radius: 5px;
  background-color: #fff;
  @include breakpoint(mobile) {
    width: 96%;
  }
  label {
    color: #333;
    font-weight: 700;
  }
  button {
    width: 100%;
    display: block;
    margin: 3rem auto 0;
  }
  .error {
    position: absolute;
    bottom: 0rem;
    padding: 1rem 6rem 1rem 0;
    text-align: center;
    font-size: 1.4rem;
    color: #e83953;
    font-weight: 600;
  }
}

// TRANSITIONS
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-3rem);
  opacity: 0;
}
</style>
