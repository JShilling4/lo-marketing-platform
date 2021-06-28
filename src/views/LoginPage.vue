<template>
  <div class="loginPage">
    <ValidationObserver @submit.prevent="login" ref="observer" tag="form" class="loginForm">
      <img
        class="loginLogo"
        src="https://webresources.ruoff.com/ruoff-marketing-logo-color/png/0/70"
        alt="Ruoff Marketing Logo"
      />
      <div class="form-group">
        <label for="username">User Name</label>
        <ValidationProvider name="Username" rules="required" v-slot="{ errors }">
          <text-input v-model="username" type="text" name="username" />
          <span class="errorMessage">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <ValidationProvider name="Password" rules="required" v-slot="{ errors }">
          <text-input v-model="password" type="password" name="password" />
          <span class="errorMessage">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <app-button type="submit" class="btn btn-green" text="Log In" />
      <transition name="slide">
        <div class="error" v-if="auth.status == 'error'">
          {{ authError }}
        </div>
      </transition>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'LoginPage',
  components: {
    'text-input': () => import('@/components/Shared/Inputs/TextInput'),
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  data() {
    return {
      username: '',
      password: '',
      authError: '',
    };
  },
  computed: {
    ...mapState(['auth']),
  },
  methods: {
    ...mapActions(['logIn']),
    async login() {
      const isValid = await this.$refs.observer.validate();
      if (isValid) {
        const creds = {
          username: this.username,
          password: this.password,
        };
        const response = await this.logIn(creds);
        if (response.status == 401) {
          this.authError = response.data.detail;
        }
        // send them to original target url if present, else send to home page
        const returnUrl = this.$router.currentRoute.query.returnUrl || '/';
        this.$router.push({
          path: returnUrl,
          query: { ...this.$route.query },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loginPage {
  height: 100vh;
  width: 100vw;
  background-image: url("~@/assets/images/login/loginPage_bg.jpg");
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
  background-color: #fff;
  @include breakpoint(mobile) {
    width: 96%;
  }
  label {
    color: #333;
      font-weight: 700;
  }
  button {
    width: 10rem;
    display: block;
    margin: 3rem auto 2rem;
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
