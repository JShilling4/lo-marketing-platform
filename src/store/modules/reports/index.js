import api from "@/store/api";
import Vue from "vue";
import { handleApiError } from "@/store/helpers";

export default {
    state: {
        orderLeaderboard: [],
        popularProducts: [],
        orderStatusCounts: [],
        popularCategories: [],
        mostActiveEmployees: [],
        mostActiveBranches: [],
    },

    mutations: {
        UPDATE_ORDER_LEADERBOARD(state, leaderboard) {
            state.orderLeaderboard = leaderboard;
        },
        UPDATE_POPULAR_PRODUCTS(state, products) {
            state.popularProducts = products;
        },
        UPDATE_ORDER_STATUS_COUNTS(state, counts) {
            state.orderStatusCounts = counts;
        },
        UPDATE_POPULAR_CATEGORIES(state, categories) {
            state.popularCategories = categories;
        },
        UPDATE_MOST_ACTIVE_EMPLOYEES(state, employees) {
            state.mostActiveEmployees = employees;
        },
        UPDATE_MOST_ACTIVE_BRANCHES(state, branches) {
            state.mostActiveBranches = branches;
        }
    },

    actions: {
        fetchOrderLeaderboard({ commit }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.reports
                .fetchOrderLeaderboard(payload)
                .then(response => {
                    if (response.status == "200") {
                        const { data } = response;
                        commit("UPDATE_ORDER_LEADERBOARD", data);
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchPopularProducts({ commit }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.reports
                .fetchPopularProducts(payload)
                .then(response => {
                    if (response.status == "200") {
                        const { data } = response;
                        commit("UPDATE_POPULAR_PRODUCTS", data);
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchOrderStatusCounts({ commit }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.reports
                .fetchOrderStatusCounts(payload)
                .then(response => {
                    if (response.status == "200") {
                        const { data } = response;
                        commit("UPDATE_ORDER_STATUS_COUNTS", data);
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchPopularCategories({ commit }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.reports
                .fetchPopularCategories(payload)
                .then(response => {
                    if (response.status == "200") {
                        const { data } = response;
                        commit("UPDATE_POPULAR_CATEGORIES", data);
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchMostActiveEmployees({ commit }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.reports
                .fetchMostActiveEmployees(payload)
                .then(response => {
                    if (response.status == "200") {
                        const { data } = response;
                        commit("UPDATE_MOST_ACTIVE_EMPLOYEES", data);
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchMostActiveBranches({ commit }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.reports
                .fetchMostActiveBranches(payload)
                .then(response => {
                    if (response.status == "200") {
                        const { data } = response;
                        commit("UPDATE_MOST_ACTIVE_BRANCHES", data);
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        }
    },

    getters: {
        popularProductsByRating: state => {
            const products = JSON.parse(JSON.stringify(state.popularProducts));
            return products
                .sort((a, b) => (a.averageRating < b.averageRating ? 1 : -1))
                .filter(p => p.averageRating !== null);
        },
        popularProductsByOrderCount: state => {
            const products = JSON.parse(JSON.stringify(state.popularProducts));
            return products.sort((a, b) =>
                a.orderCount < b.orderCount ? 1 : -1
            );
        },
        mostActiveEmployeesByOrderedBy: state => {
            const employees = JSON.parse(
                JSON.stringify(state.mostActiveEmployees)
            );
            return employees
                .sort((a, b) => (a.orderByCount < b.orderByCount ? 1 : -1))
                .filter(emp => emp.orderByCount !== null);
        },
        mostActiveEmployeesByOrderedFor: state => {
            const employees = JSON.parse(
                JSON.stringify(state.mostActiveEmployees)
            );
            return employees
                .sort((a, b) => (a.orderForCount < b.orderForCount ? 1 : -1))
                .filter(emp => emp.orderForCount !== null);
        }
    }
};
