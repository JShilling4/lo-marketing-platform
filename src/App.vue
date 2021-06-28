<template>
    <div class="app">
        <transition name="fadeInOut">
            <loading-screen v-if="loading"></loading-screen>
        </transition>

        <loading-spinner v-if="$store.state.loading" />

        <admin-side-bar v-if="adminBarShouldShow" />

        <nav-bar
            v-if="navShouldShow"
            :activeUser="users.activeUser"
        />

        <session-expiring-modal
            v-if="sessionExpiringShowing && !loading && auth.tokenExpiry !== null && $router.currentRoute.path !== '/login'"
            :session-timer="sessionString"
            @close="sessionExpiringShowing = false"
        />

        <div class="view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import Navbar from "@/components/Layout/Navbar";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import LoadingScreen from "@/components/Shared/LoadingScreen";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import SessionExpiringModal from "@/components/Shared/SessionExpiringModal";

export default {
	name: "app",
	components: {
		"nav-bar": Navbar,
		"admin-side-bar": AdminSidebar,
		"loading-screen": LoadingScreen,
		"loading-spinner": LoadingSpinner,
		"session-expiring-modal": SessionExpiringModal,
	},
	data() {
		return {
			sessionExpiringShowing: false,
			timeInterval: undefined,
			sessionTimer: null,
			sessionTimerString: "",
		};
	},
	computed: {
		...mapState(["users", "auth"]),
		loading() {
			if (this.auth.status == "loading") {
				return true;
			}
			return false;
		},
		userIsAdmin() {
			try {
				return this.users.activeUser.userRoles.includes(
					"ROLE_MARKETING_EMPLOYEE"
				);
			} catch (error) {
				/* shhhh */
			}
			return false;
		},
		navShouldShow() {
			if (
				this.$route.name !== "login" &&
				this.$route.name !== "catalogLogin" &&
				this.$route.name !== "orderProofs" &&
				this.$route.name !== "orderProof" &&
				this.$route.name !== "magazineSelection" &&
				this.$route.name !== "mobileHandoff"
			) {
				return true;
			}
			return false;
		},
		adminBarShouldShow() {
			if (
				this.$route.name !== "login" &&
				this.userIsAdmin &&
				!this.$route.path.includes("catalog") &&
				this.$route.name !== "orderProofs" &&
				this.$route.name !== "orderProof"
			) {
				return true;
			}
			return false;
		},
		tokenExpiry() {
			return this.auth.tokenExpiry;
		},
		sessionMinutes() {
			return Math.floor((this.sessionTimer / 60) % 60);
		},
		sessionSeconds() {
			const seconds = Math.floor(this.sessionTimer % 60);
			if (seconds < 10) {
				return `0${seconds}`;
			}
			return seconds;
		},
		sessionString() {
			return `${this.sessionMinutes}:${this.sessionSeconds}`;
		},
	},
	watch: {
		tokenExpiry(value) {
			if (value !== null) {
				this.startTimer();
			}
		},
		sessionTimer(value) {
			if (value == 300 || value == 150 || value == 45) {
				this.sessionExpiringShowing = true;
			}
			if (value <= 0) {
				this.redirectToLogin();
			}
		},
	},
	methods: {
		...mapActions(["updateActiveUser", "startSession"]),
		...mapMutations(["CREATE_NOTIFICATION"]),
		startTimer() {
			clearInterval(this.timeInterval);
			const expirationTime = Math.trunc(
				new Date(this.tokenExpiry).getTime() / 1000
			);
			const now = Math.trunc(new Date().getTime() / 1000);
			this.sessionTimer = expirationTime - now;
			this.timeInterval = setInterval(() => {
				this.sessionTimer -= 1;
			}, 1000);
		},
		closeSessionExpiring() {
			this.sessionExpiringShowing = false;
		},
		redirectToLogin() {
			this.sessionExpiringShowing = false;
			if (this.$router.currentRoute.path !== "/login") {
				this.$router.push({
					path: "/login",
					query: {
						...this.$route.query,
						returnUrl: this.$router.currentRoute.path,
					},
				});
			}
		},
	},

	async beforeCreate() {
		if (
			this.$route.name !== "login" &&
			this.$route.name !== "magazineSelection" &&
			this.$route.name !== "catalogLogin" &&
			this.$route.name !== "mobileHandoff"
		) {
			const user = JSON.parse(localStorage.getItem("mv3"));
			if (user) {
				await this.$store.dispatch("validateToken");
				await this.$store.dispatch("setActiveUser", user);
				this.updateActiveUser(user.employeeNumber);
				this.startSession();
				this.startTimer();
			} else {
				this.$router.push("/login");
			}
		}
	},

	created() {},

	beforeDestroy() {
		clearInterval(this.timeInterval);
	},

	sockets: {
		createNotification(data) {
			const { activeUser } = this.users;
			if (data.recipients.includes(activeUser.employeeNumber)) {
				this.CREATE_NOTIFICATION(data);
			}
		},
	},
};
</script>

<style lang="scss">
@import "./scss/base/base";
@import "./scss/base/typography";
@import "./scss/components/forms";
@import "./scss/components/tables";
@import "./scss/vendor/vuetoastify";
@import "./scss/vendor/vue-ctk-date-time-picker.scss";
@import "@/scss/vendor/multiselect.scss";
@import "./scss/utility/helpers";
@import "./scss/vendor/vue-ctk-date-time-picker";

.avatar {
    width: 3.5rem;
    border: 2px solid lightgray;
    border-radius: 50%;
}
</style>
