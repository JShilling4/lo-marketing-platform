/**
 * @fileoverview Manages state and API requests for products.
 */

import Vue from "vue";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";

export default {
    state: {
        products: [],
        productReviews: []
    },

    mutations: {
        UPDATE_PRODUCTS(state, products) {
            state.products = products;
        },
        UPDATE_PRODUCT(state, payload) {
            const { productIndex, product } = payload;
            if (productIndex >= 0) {
                state.products.splice(productIndex, 1, product);
            } else {
                state.products.push(product);
            }
        },
        UPDATE_PRODUCT_REVIEWS(state, reviews) {
            state.productReviews = reviews;
        },
        UPDATE_PRODUCT_REVIEW(state, payload) {
            const { reviewIndex, review } = payload;
            if (reviewIndex >= 0) {
                state.productReviews.splice(reviewIndex, 1, review);
            } else {
                state.productReviews.push(review);
            }
        },
        UPDATE_ASSIGN_TO(state, payload) {
            const { productIndex, newAssignTo } = payload;
            state.products[productIndex].assignTo = newAssignTo;
        },
        UPDATE_CATEGORY(state, payload) {
            const { productIndex, newCategory } = payload;
            state.products[productIndex].category = newCategory;
        },
        UPDATE_IS_ACTIVE(state, payload) {
            const { productIndex, newIsActive } = payload;
            state.products[productIndex].isActive = newIsActive;
        },
        CREATE_PRODUCT(state, product) {
            state.products.push(product);
        },
        EDIT_PRODUCT(state, payload) {
            Vue.set(state.products, payload.productIndex, payload.product);
        },
        DELETE_PRODUCT(state, index) {
            state.products.splice(index, 1);
        },
        DELETE_PRODUCT_REVIEW(state, reviewIndex) {
            state.productReviews.splice(reviewIndex, 1);
        }
    },

    actions: {
        updateProducts: ({ commit }, startSpinner = true) => {
            if (startSpinner) {
                commit("SET_LOADING", true, { root: true });
            } // start loading spinner
            return api.products
                .fetchAllProducts()
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit("UPDATE_PRODUCTS", data.marketingV1GetProduct);
                        // Vue.toasted.success('Products data refreshed!');
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    handleApiError(error);
                });
        },
        updateProduct: ({ commit, state }, id) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.products
                .fetchProduct(id)
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        if (data.marketingV1GetProduct.length > 0) {
                            const productIndex = state.products.findIndex(
                                product => product.id == id
                            );
                            commit("UPDATE_PRODUCT", {
                                productIndex,
                                product: data.marketingV1GetProduct[0]
                            });
                        }
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return data.marketingV1GetProduct;
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateProductReviews: ({ commit }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.products
                .fetchAllProductReviews(payload)
                .then(response => {
                    const { data } = response.data;
                    if (response.status == 200) {
                        if (data.marketingV1GetProductReview.length > 0) {
                            commit(
                                "UPDATE_PRODUCT_REVIEWS",
                                data.marketingV1GetProductReview
                            );
                        }
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    // console.log(error);
                    handleApiError(error);
                });
        },
        updateProductReview: ({ commit, state }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.products
                .fetchProductReview(payload)
                .then(response => {
                    const { data } = response.data;
                    if (response.status == 200) {
                        if (data.marketingV1GetProductReview.length > 0) {
                            const reviewIndex = state.productReviews.findIndex(
                                product => product.id == payload.productId
                            );
                            commit("UPDATE_PRODUCT_REVIEW", {
                                reviewIndex,
                                review: {
                                    product: {
                                        id: payload.productId
                                    },
                                    ...data.marketingV1GetProductReview[0]
                                }
                            });
                            commit("SET_LOADING", false, { root: true }); // close loading spinner
                            return {
                                status: 200,
                                data: data.marketingV1GetProductReview[0]
                            };
                        }
                        return { status: "empty" };
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    // console.log(error);
                    handleApiError(error);
                });
        },
        createProductReview: ({ commit, state }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.products
                .postProductReview(payload)
                .then(response => {
                    if (response.status == "200") {
                        const reviewIndex = state.productReviews.findIndex(
                            review => review.product.id == payload.productId
                        );
                        commit("UPDATE_PRODUCT_REVIEW", {
                            reviewIndex,
                            review: {
                                product: { id: payload.productId },
                                rating: payload.rating,
                                comment: payload.comment
                            }
                        });
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return response;
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        deleteProductReview: ({ commit, state }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.products
                .deleteProductReview(payload)
                .then(response => {
                    const reviewIndex = state.productReviews.findIndex(
                        review =>
                            review.product.id == payload.productId &&
                            review.employee.employeeNumber ==
                                payload.employeeNumber
                    );
                    if (response.status == "200") {
                        commit("DELETE_PRODUCT_REVIEW", reviewIndex);
                        Vue.toasted.success("Review successfully deleted.");
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return response;
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        manageProduct: ({ commit, state }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.products
                .manageProduct(payload)
                .then(response => {
                    // if create product successful, commit to store
                    let productIndex;
                    if (response.status == "200") {
                        productIndex = state.products.findIndex(
                            product => product.id == response.data.id
                        );
                        if (productIndex == -1) {
                            // product doesnt exist, create it
                            commit("CREATE_PRODUCT", response.data);
                            Vue.toasted.success("Product successfully created!");
                        } else {
                            // product exists, update it
                            commit("EDIT_PRODUCT", { product: response.data, productIndex });
                            Vue.toasted.success("Product successfully saved!");
                        }
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, productIndex };
                })
                .catch(error => {
                    commit("SET_LOADING", false, { root: true });
                    handleApiError(error);
                });
        },
        bulkUpdateProducts: ({ commit, state }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.products
                .bulkUpdateProducts(payload)
                .then(response => {
                    if (response.status == "200") {
                        // loop the product IDs and make the necessary mutations
                        payload.productIds.forEach(id => {
                            const productIndex = state.products.findIndex(
                                product => product.id == id
                            );
                            if (payload.category !== null) {
                                commit("UPDATE_CATEGORY", {
                                    productIndex,
                                    newCategory: payload.category
                                });
                            }
                            if (payload.assignTo !== null) {
                                commit("UPDATE_ASSIGN_TO", {
                                    productIndex,
                                    newAssignTo: payload.assignTo
                                });
                            }
                            if (payload.isActive !== null) {
                                commit("UPDATE_IS_ACTIVE", {
                                    productIndex,
                                    newIsActive: payload.isActive
                                });
                            }
                        });
                    }
                    Vue.toasted.success("Bulk order update successful!");
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return response;
                })
                .catch(error => {
                    handleApiError(error);
                });
        }
    },

    getters: {
        productById: state => id =>
            state.products.find(product => product.id == id),
        allProducts: state => state.products,
        allActiveProducts: state =>
            state.products.filter(product => product.isActive === 1),
        allDiscoverProducts: state =>
            state.products.filter(product => product.displayDiscover === 1),
        allCatalogProducts: state =>
            state.products.filter(product => product.displayRealtor === 1),
        productReviewsByProductId: state => productId =>
            state.productReviews.filter(
                review => review.product.id == productId
            )
    }
};
