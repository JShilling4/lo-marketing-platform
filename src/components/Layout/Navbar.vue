<template>
    <div :class="['navbar', { hasAdminBar: userIsAdmin }]">
        <router-link :to="$route.path.includes('catalog') ? '/catalog/library' : '/'">
            <!-- <img src="https://webresources.ruoff.com/logo-horizontal-color/png/0/70" alt="Ruoff Logo"> -->
            <img
                class="logo"
                src="https://webresources.ruoff.com/ruoff-marketing-logo-color/png/0/70"
                height="70"
                alt="Ruoff Logo"
            />
        </router-link>

        <i
            v-if="!mobileMenuShowing"
            class="fas fa-bars mobileToggle"
            @click="mobileMenuShowing = true"
        ></i>
        <i
            v-else
            class="fas fa-times mobileToggle"
            @click="mobileMenuShowing = false"
        ></i>
        <div class="navbar__rightBlock">
            <ul
                v-if="!$route.path.includes('catalog')"
                :class="['nav', { 'nav--showing': mobileMenuShowing }]"
            >
                <li
                    class="nav__item"
                    @click="mobileMenuShowing = false"
                >
                    <router-link
                        to="/library"
                        class="nav__link"
                    >Library</router-link>
                </li>
                <!-- <li class="nav__item">
            <router-link to="/discover" class="nav__link">Discover</router-link>
          </li> -->
                <li
                    class="nav__item"
                    @click="mobileMenuShowing = false"
                >
                    <router-link
                        to="/orders"
                        class="nav__link"
                    >Orders</router-link>
                </li>
                <li
                    class="nav__item"
                    @click="mobileMenuShowing = false"
                >
                    <router-link
                        to="/resources"
                        class="nav__link"
                    >Resources</router-link>
                </li>
            </ul>
            <div class="nav__avatar-wrapper">
                <app-avatar
                    :avatar-url="buildAvatarUrl(activeUser.email, '100', 'ShortcutIcon')"
                    alt="User Avatar"
                    size="large"
                    @click.native="toggleUserMenu"
                />
                <div
                    v-if="activeUser.notifications && unreadNotifications > 0"
                    class="notificationAnchor"
                >
                    <span class="number">{{ unreadNotifications }}</span>
                </div>
            </div>
            <transition name="profile-menu">
                <user-menu
                    v-if="userMenuOpen"
                    @close="userMenuOpen = false"
                    :unread-notifications="unreadNotifications"
                />
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { avatars } from "@/mixins";
import UserMenu from "@/components/Layout/UserMenu";
import AppAvatar from "@/components/Shared/AppAvatar";

export default {
    name: "navbar",
    mixins: [avatars],
    components: {
        "user-menu": UserMenu,
        "app-avatar": AppAvatar,
    },
    props: {
        activeUser: Object,
    },
    data() {
        return {
            userMenuOpen: false,
            mobileMenuShowing: false,
        };
    },
    computed: {
        ...mapState(["users", "auth"]),
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
        unreadNotifications() {
            try {
                const unreadNotifications = this.activeUser.notifications.filter(
                    (notification) => notification.isRead == 0
                );
                return unreadNotifications.length;
            } catch {
                return 0;
            }
        },
    },
    methods: {
        toggleUserMenu() {
            this.userMenuOpen = !this.userMenuOpen;
        },
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 12rem 2rem;
    @media screen and (max-width: 1674px) {
        padding: 2rem 4rem;
    }
    @include breakpoint(tablet-port) {
        padding: 2rem 2rem;
    }
    .mobileToggle {
        position: absolute;
        top: 11rem;
        left: 4rem;
        z-index: 11;
        display: none;
        font-size: 2.5rem;
        color: $teal-light;
        @include breakpoint(tablet-land) {
            display: block;
        }
        @include breakpoint(tablet-port) {
            top: 10rem;
            left: 2rem;
        }
    }
    .logo {
        @include breakpoint(tablet-port) {
            height: 50px;
        }
    }
    &__rightBlock {
        display: flex;
        align-items: center;
    }
}
.navbar.hasAdminBar {
    @media screen and (max-width: 1674px) {
        padding: 2rem 6rem 2rem 4rem;
    }
    @include breakpoint(tablet-port) {
        padding: 2rem 6rem 2rem 2rem;
    }
}
.nav {
    position: relative;
    display: flex;
    justify-content: flex-end;
    margin-right: 3rem;
    @include breakpoint(tablet-land) {
        position: absolute;
        top: 10rem;
        left: 0;
        z-index: 10;
        display: block;
        width: 23rem;
        padding: 6rem 0 2rem;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s;
        background-color: rgba(0, 0, 0, 0.85);
    }
    @include breakpoint(tablet-port) {
        top: 9rem;
    }
    &--showing {
        transform: scaleX(1);
    }

    &__item {
        margin-left: 4rem;
        @include breakpoint(tablet-land) {
            padding: 1rem 0;
        }
    }
    &__link {
        color: $gray-dark;
        font-weight: 500;
        @include breakpoint(tablet-land) {
            color: #fff;
        }
        .order-notifier {
            display: inline-block;
            height: 1rem;
            width: 1rem;
            border-radius: 50%;
            background-color: $gold;
        }
    }
    &__avatar-wrapper {
        position: relative;
        .avatar {
            cursor: pointer;
        }
        .notificationAnchor {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            right: 0;
            color: #fff;
            background-color: $red;
            border-radius: 50%;
            height: 20px;
            width: 20px;
            .number {
                font-size: 10px;
            }
        }
    }
}

// TRANSITIONS
.slide-enter,
.slide-leave-to {
    transform: scaleX(0);
}

@include slideDownEnter("profile-menu", 8rem, 10rem);
</style>
