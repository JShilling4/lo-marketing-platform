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

// const loading = computed(() => {
//   // if (this.auth.status == "loading") {
//   // 	return true;
//   // }
//   return false;
// });

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
  if (
    route.name !== "login" &&
    route.name !== "catalogLogin" &&
    route.name !== "orderProofs" &&
    route.name !== "orderProof" &&
    route.name !== "magazineSelection" &&
    route.name !== "mobileHandoff"
  ) {
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

// tokenExpiry() {
// 	return this.auth.tokenExpiry;
// },
// sessionMinutes() {
// 	return Math.floor((this.sessionTimer / 60) % 60);
// },
// sessionSeconds() {
// 	const seconds = Math.floor(this.sessionTimer % 60);
// 	if (seconds < 10) {
// 		return `0${seconds}`;
// 	}
// 	return seconds;
// },
// sessionString() {
// 	return `${this.sessionMinutes}:${this.sessionSeconds}`;
// },

// watch: {
// 	tokenExpiry(value) {
// 		if (value !== null) {
// 			this.startTimer();
// 		}
// 	},
// 	sessionTimer(value) {
// 		if (value == 300 || value == 150 || value == 45) {
// 			this.sessionExpiringShowing = true;
// 		}
// 		if (value <= 0) {
// 			this.redirectToLogin();
// 		}
// 	},
// },

// function startTimer() {
// 	clearInterval(this.timeInterval);
// 	const expirationTime = Math.trunc(
// 		new Date(this.tokenExpiry).getTime() / 1000
// 	);
// 	const now = Math.trunc(new Date().getTime() / 1000);
// 	this.sessionTimer = expirationTime - now;
// 	this.timeInterval = setInterval(() => {
// 		this.sessionTimer -= 1;
// 	}, 1000);
// }

// function closeSessionExpiring() {
// 	this.sessionExpiringShowing = false;
// }

// function redirectToLogin() {
// 	this.sessionExpiringShowing = false;
// 	if (this.$router.currentRoute.path !== "/login") {
// 		this.$router.push({
// 			path: "/login",
// 			query: {
// 				...this.$route.query,
// 				returnUrl: this.$router.currentRoute.path,
// 			},
// 		});
// 	}
// }

// async beforeCreate() {
// 	if (
// 		this.$route.name !== "login" &&
// 		this.$route.name !== "magazineSelection" &&
// 		this.$route.name !== "catalogLogin" &&
// 		this.$route.name !== "mobileHandoff"
// 	) {
// 		const user = JSON.parse(localStorage.getItem("mv3"));
// 		if (user) {
// 			await this.$store.dispatch("validateToken");
// 			await this.$store.dispatch("setActiveUser", user);
// 			this.updateActiveUser(user.employeeNumber);
// 			this.startSession();
// 			this.startTimer();
// 		} else {
// 			this.$router.push("/login");
// 		}
// 	}
// },

// created() {},

// beforeDestroy() {
// 	clearInterval(this.timeInterval);
// },
</script>

<template>
  <div class="app">
    <!-- <transition name="fadeInOut">
      <loading-screen v-if="loading"></loading-screen>
    </transition>

    <loading-spinner v-if="$store.state.loading" />

    <admin-side-bar v-if="adminBarShouldShow" /> -->

    <app-navbar v-if="navShouldShow" :activeUser="userStore.user" />

    <!-- <session-expiring-modal
      v-if="
        sessionExpiringShowing &&
        !loading &&
        auth.tokenExpiry !== null &&
        $router.currentRoute.path !== '/login'
      "
      :session-timer="sessionString"
      @close="sessionExpiringShowing = false"
    /> -->

    <div class="view">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
@import "./assets/scss/vendor/multiselect.scss";
</style>

<style lang="scss" scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
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
