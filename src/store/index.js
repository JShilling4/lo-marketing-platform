import Vue from "vue";
import Vuex from "vuex";

import users from "./modules/users";
import teams from "./modules/teams";
import orders from "./modules/orders";
import products from "./modules/products";
// import ideas from './modules/ideas';
import auth from "./modules/auth";
import templates from "./modules/templates";
import referralPartners from "./modules/referralPartners";
// import testimonials from './modules/testimonials';
import categoriesAndTopics from "./modules/categoriesTopics";
import resources from "./modules/resources";
import magazines from "./modules/magazines";
import cobrandInvoices from "./modules/cobrandInvoices";
import reports from "./modules/reports";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    state() {
        return {
            loading: false
        };
    },
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading;
        }
    },
    modules: {
        users,
        teams,
        orders,
        products,
        // ideas,
        auth,
        templates,
        referralPartners,
        // testimonials,
        categoriesAndTopics,
        resources,
        magazines,
        cobrandInvoices,
        reports
    }
});
