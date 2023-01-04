<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { VForm } from "vuetify/components";

const router = useRouter();

interface IUserLogin {
  email: string;
  password: string;
  error: string;
}

const formRef = ref<HTMLFormElement | null>();
const formIsValid = ref<boolean>(true);
const emailRules = [
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];
const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => /.+@.+\..+/.test(v) || "Password must be valid",
];

const login = ref<IUserLogin>({
  email: "",
  password: "",
  error: "",
});

async function handleLogin() {
  if (!formRef.value) return;
  const { formIsValid } = await formRef.value.validate();

  if (formIsValid) {
    router.push("/library");
  }
}
</script>

<template>
  <div class="loginPage">
    <v-form
      ref="formRef"
      v-model="formIsValid"
      class="loginForm"
      lazy-validation
    >
      <div class="form-group">
        <v-text-field
          v-model="login.email"
          label="Email"
          :rules="emailRules"
          required
        />
      </div>
      <div class="form-group">
        <v-text-field
          v-model="login.password"
          type="password"
          label="Password"
          :rules="passwordRules"
          required
        />
      </div>
      <v-btn classes="btn btn-green" rounded="pill" @click="handleLogin"
        >Log In</v-btn
      >
    </v-form>
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
