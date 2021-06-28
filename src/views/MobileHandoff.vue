<template>
  <div>
    <loading-screen v-if="!showError" />
    <h1 v-if="showError">There was a problem loading <span>marketing.ruoff.com</span>.  Please try again or contact support.</h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import LoadingScreen from '@/components/Shared/LoadingScreen';
// import api from '@/store/api';

export default {
  name: 'MobileHandoff',
  components: {
    'loading-screen': LoadingScreen,
  },
  data() {
    return {
      showError: false,
    };
  },
  methods: {
    ...mapActions(['logInWithToken', 'getMobileHandoffRoute']),
  },
  async mounted() {
    const sourceApp = this.$route.query.source;
    const response = await this.logInWithToken(this.$route.query.token);

    if (response) {
      const targetRoute = await this.getMobileHandoffRoute(sourceApp);
      if (targetRoute !== null) {
        this.$router.push(targetRoute);
      }
    } else {
      this.showError = true;
    }
  },
};
</script>

<style lang="scss" scoped>
  h1 {
    margin: 4rem 0 0;
    padding: 0 2rem;
    text-align: center;
    color: $blue-green;
    line-height: 1.5;
    span {
      color: $teal-light;
    }
  }
</style>
