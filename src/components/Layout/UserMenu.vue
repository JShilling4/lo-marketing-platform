<template>
    <ul
        class="userMenu"
        v-on-clickaway="closeMenu"
    >
        <li
            v-if="menuOptionIsAvailable"
            class="userMenu__menuItem"
            @click="closeMenu()"
        >
            <router-link :to="!$route.path.includes('catalog') ? '/profile' : '/catalog/profile'">Profile</router-link>
        </li>
        <li
            v-if="menuOptionIsAvailable"
            class="userMenu__menuItem"
            @click="closeMenu()"
        >
            <router-link to="/notifications">
                Notifications <span
                    v-if="unreadNotifications > 0"
                    class="notificationCount"
                >{{ unreadNotifications }}</span>
            </router-link>
        </li>
        <!-- <li class="userMenu__menuItem">
      <router-link to="/testimonials">Testimonials</router-link>
    </li> -->
        <li
            v-if="menuOptionIsAvailable"
            class="userMenu__menuItem"
            @click="closeMenu()"
        >
            <router-link to="/referral-partners">Referral Partners</router-link>
        </li>
        <li
            v-if="menuOptionIsAvailable"
            class="userMenu__menuItem"
            @click="closeMenu()"
        >
            <router-link to="/magazine-gift-program">Magazine Gift</router-link>
        </li>
        <!-- <li class="userMenu__menuItem">
      <router-link to="/">Reports</router-link>
    </li> -->
        <li
            class="userMenu__menuItem"
            @click="logOut"
        >
            <app-button
                classes="btn btn-red"
                text="Log Out"
            />
        </li>
    </ul>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
    name: "user-menu",
    components: {
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    mixins: [clickaway],
    props: {
        unreadNotifications: Number,
    },
    computed: {
        menuOptionIsAvailable() {
            // restrict user menu options
            if (!this.$route.path.includes("catalog")) {
                return true;
            }
            return false;
        },
    },
    methods: {
        logOut() {
            localStorage.removeItem("mv3");
            localStorage.removeItem("exp");
            if (this.$route.path.includes("catalog")) {
                this.$router.push("/catalog/login");
            } else {
                this.$router.push("/login");
            }
        },
        closeMenu() {
            this.$emit("close");
        },
    },
};
</script>

<style lang="scss" scoped>
.userMenu {
    position: absolute;
    top: 10rem;
    right: 6.5rem;
    z-index: 100;
    width: 17rem;
    padding: 1rem 0;
    text-align: center;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    @media screen and (max-width: 1674px) {
        right: 0;
    }
    &__menuItem {
        padding: 1rem 2rem;

        cursor: pointer;
        a {
            color: $gray-dark;
        }
        &:hover a {
            color: $teal-light;
            text-decoration: underline;
        }
        .notificationCount {
            position: absolute;
            left: 13.75rem;
            color: $red;
            font-weight: 600;
        }
    }
}
</style>
