<template>
    <div
        class="sidebar"
        v-on-clickaway="clickedAway"
    >
        <i
            class="sidebar__toggle fas fa-bars"
            @click="toggleSidebar"
        />
        <transition
            name="slide"
            appear
        >
            <ul
                v-if="sidebarShowing"
                class="nav"
            >
                <router-link
                    to="/admin/product-management"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/product-management') }"
                >Products
                </router-link>
                <router-link
                    to="/admin/categories-topics"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/categories-topics') }"
                >Categories & Topics
                </router-link>
                <router-link
                    to="/admin/user-management"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/user-management') }"
                >User Management
                </router-link>
                <router-link
                    to="/admin/team-management"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/team-management') }"
                >Team Management
                </router-link>
                <router-link
                    to="/admin/reports"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/reports') }"
                >Reports
                </router-link>
                <router-link
                    to="/admin/magazine-program"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/magazine-program') }"
                >Magazine Program
                </router-link>
                <router-link
                    to="/admin/referral-partners"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/referral-partners') }"
                >Referral Partners
                </router-link>
                <router-link
                    to="/admin/email-management"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/email-management') }"
                >Email Management
                </router-link>
                <!-- <router-link
          to="/admin/testimonials"
          class="nav__link"
          :class="{ active: activeRoute('/admin/testimonials') }">Testimonials
        </router-link> -->
                <!-- <router-link
          to="/admin/add-resources"
          class="nav__link"
          :class="{ active: activeRoute('/admin/add-resources') }">Add Resources
        </router-link> -->
                <router-link
                    to="/admin/cobrand-invoice"
                    class="nav__link"
                    :class="{ active: activeRoute('/admin/cobrand-invoice') }"
                >Co-Brand Invoice
                </router-link>
            </ul>
        </transition>
    </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
    name: "AdminSidebar",
    mixins: [clickaway],
    data() {
        return {
            sidebarShowing: false,
            toggleText: "Admin",
        };
    },
    computed: {},
    methods: {
        toggleSidebar() {
            this.sidebarShowing = !this.sidebarShowing;
            this.toggleText = this.sidebarShowing ? "X" : "Admin";
        },
        activeRoute(route) {
            if (this.$route.path == route) {
                return true;
            }
            return false;
        },
        clickedAway() {
            this.sidebarShowing = false;
            this.toggleText = "Admin";
        },
    },
};
</script>

<style lang="scss" scoped>
.sidebar {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 101;
    &__toggle {
        position: absolute;
        color: $orange;
        top: 4rem;
        right: 2rem;
        font-size: 28px;
        cursor: pointer;
        z-index: 102;
        @media screen and (max-width: 1674px) {
            top: 4rem;
        }
    }
    .nav {
        position: absolute;
        top: 0;
        right: 0;
        padding: 10rem 0 9rem;
        background-color: rgba(0, 0, 0, 0.85);
        width: 27rem;
        min-height: 100vh;
        overflow: hidden;
        transition: transform 0.3s ease-in-out;
        transform-origin: right;
        z-index: 10;
        // box-shadow: 0 1rem 2rem rgba(0,0,0,.3);
        &__link {
            display: list-item;
            position: relative;
            padding: 4rem 3rem 1rem 0;
            letter-spacing: 0.7px;
            text-align: right;
            color: #fff;
            cursor: pointer;
            transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out,
                padding 0.3s ease-in-out;
            &:hover {
                color: $teal-light;
                text-shadow: 0 1px 1px $teal-light;
            }
            &:after {
                position: absolute;
                content: "";
                right: 0;
                bottom: 0;
                height: 2px;
                background-color: $gray;
                width: 7rem;
                transition: width 0.3s ease-in-out;
            }
            &.active {
                color: $teal-light;
                text-shadow: 0 1px 1px $teal-light;
                padding-right: 7rem;
                &:after {
                    width: 14rem;
                    background-color: $teal-light;
                }
            }
        }
    }
}

// TRANSITIONS
.slide-enter,
.slide-leave-to {
    transform: scaleX(0);
}
</style>
