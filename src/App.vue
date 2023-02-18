<script setup lang="ts">
import AppNavbar from "./components/AppNavbar.vue";
import { computed } from "vue";
import { RouterView } from "vue-router";
import { useUserStore } from "./store";
import { useRoute } from "vue-router";

const route = useRoute();

// import AdminSidebar from "@/components/Layout/AdminSidebar";
// import LoadingScreen from "@/components/Shared/LoadingScreen";
// import LoadingSpinner from "@/components/Shared/LoadingSpinner";
// import SessionExpiringModal from "@/components/Shared/SessionExpiringModal";

// sessionExpiringShowing: false,
// consttimeInterval: undefined,
// sessionTimer: null,
// sessionTimerString: "",

const userStore = useUserStore();

// const userIsAdmin = computed(() => {
//   // try {
//   // 	return this.users.activeUser.userRoles.includes(
//   // 		"ROLE_MARKETING_EMPLOYEE"
//   // 	);
//   // } catch (error) {
//   // 	/* shhhh */
//   // }
//   return true;
// });

const navShouldShow = computed(() => {
  if (route.path !== "/" && route.path !== "/login") {
    return true;
  }
  return false;
});

// const adminBarShouldShow = computed(() => {
//   // if (
//   // 	this.$route.name !== "login" &&
//   // 	this.userIsAdmin &&
//   // 	!this.$route.path.includes("catalog") &&
//   // 	this.$route.name !== "orderProofs" &&
//   // 	this.$route.name !== "orderProof"
//   // ) {
//   // 	return true;
//   // }
//   // return false;
//   return true;
// });
</script>

<template>
  <div class="app">
    <!-- <transition name="fadeInOut">
      <loading-screen v-if="loading"></loading-screen>
    </transition>

    <loading-spinner v-if="$store.state.loading" />

    <admin-side-bar v-if="adminBarShouldShow" /> -->

    <app-navbar v-if="navShouldShow" :activeUser="userStore.user" />

    <div class="view">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
