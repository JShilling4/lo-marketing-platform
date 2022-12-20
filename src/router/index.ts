import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: { name: "login" },
    },
    {
      path: "/home",
      name: "home-test",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/library",
      name: "library",
      component: () => import("../views/LibraryView.vue"),
    },
    {
      path: "/product/:productId",
      name: "ProductDetail",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "ProductDetail" */ "../views/ProductDetailView.vue"
        ),
    },
  ],
});

export default router;
