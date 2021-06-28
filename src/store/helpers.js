import Vue from "vue";
import router from "@/router";
import store from "@/store";

export const handleApiError = (error, message = undefined) => {
    store.commit("SET_LOADING", false, { root: true }); // close loading spinner
    if (error.response?.status === 401) {
        localStorage.removeItem("mv3");
        if (
            store.state.auth.status !== "error" &&
            router.currentRoute.name !== "login" &&
            router.currentRoute.name !== "catalogLogin"
        ) {
            Vue.toasted.global.fetch_error({
                message: "Your session has expired. Please login."
            });
        }
        store.commit("AUTH_ERROR");
        if (router.currentRoute.path != "/login") {
            router.push({
                path: "/login",
                query: {
                    ...router.currentRoute.query,
                    returnUrl: router.currentRoute.path
                }
            });
        }
    }
    if (error.response?.status !== 401) {
        const message = error.response?.data?.message;
        Vue.toasted.global.fetch_error({
            message: message || error
        });
    }
};
