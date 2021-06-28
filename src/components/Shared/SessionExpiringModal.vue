<template>
  <div class="sessionExpiringModal">
    <div class="dialog">
      <i class="fas fa-times close" @click="$emit('close')"></i>
      <p class="message">Your session will expire in <span class="timer">{{ sessionTimer }}</span></p>
      <ValidationObserver ref="observer" tag="div" class="refreshForm">
        <ValidationProvider name="password" rules="required" v-slot="{ errors }" class="form-group">
          <label>Password</label>
          <text-input v-model="password" type="password" name="password" />
          <span class="errorMessage">{{ errors[0] }}</span>
        </ValidationProvider>
      </ValidationObserver>
      <div class="button-container">

        <app-button classes="btn btn-green" @click.native="login" text="Refresh" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'SessionExpiringModal',
  components: {
    'app-button': () => import('@/components/Shared/AppButton'),
    'text-input': () => import('@/components/Shared/Inputs/TextInput'),
  },
  props: {
    sessionTimer: {
      type: String,
    },
  },
  data() {
    return {
      password: '',
    };
  },
  computed: {
    ...mapState(['auth']),
    username() {
      return JSON.parse(localStorage.getItem('mv3')).username;
    },
  },
  methods: {
    ...mapActions(['logIn']),
    async login() {
      const isValid = await this.$refs.observer.validate();
      if (isValid) {
        this.$emit('close');
        const creds = {
          username: this.username,
          password: this.password,
        };
        this.$emit('close');
        this.logIn(creds);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.sessionExpiringModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  background-color: transparent;
  z-index: 100;
}
.dialog {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem 2rem 3rem;
  background-color: #fff;
  box-shadow: 0 1rem 2rem rgba(0,0,0,.3);
  border-radius: 5px;
  @include breakpoint(tablet-land) {
    width: 85%;
  }
  .close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: $gray;
    cursor: pointer;
    &:hover {
      color: $orange;
    }
  }
  .message {
    text-align: center;
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 2rem;
    @include breakpoint(tablet-port) {
      font-size: 1.5rem;
    }
    @include breakpoint(mobile) {
      font-size: 1.25rem;
    }
    .timer {
      color: $orange;
    }
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    button {
      min-width: 12rem;
      margin: 0 4rem;
      @include breakpoint(mobile) {
        min-width: 9rem;
        font-size: 10px;
      }
      @include breakpoint(mobile-small) {
        margin: 0 2rem;
      }
    }
  }

  .refreshForm {
    width: 30rem;
    margin: 0 auto;
  }
}

</style>
