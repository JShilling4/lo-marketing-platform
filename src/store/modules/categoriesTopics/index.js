import Vue from "vue";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";

export default {
    state: {
        categories: [],
        topics: []
    },

    mutations: {
        // categories
        UPDATE_CATEGORIES(state, categories) {
            state.categories = categories;
        },
        CREATE_CATEGORY(state, category) {
            state.categories.push(category);
        },
        EDIT_CATEGORY(state, payload) {
            Vue.set(state.categories, payload.categoryIndex, payload.category);
        },
        DELETE_CATEGORY(state, index) {
            state.categories.splice(index, 1);
        },
        // topics
        UPDATE_TOPICS(state, topics) {
            state.topics = topics;
        },
        CREATE_TOPIC(state, topic) {
            state.topics.push(topic);
        },
        EDIT_TOPIC(state, payload) {
            Vue.set(state.topics, payload.topicIndex, payload.topic);
        },
        DELETE_TOPIC(state, index) {
            state.topics.splice(index, 1);
        }
    },

    actions: {
        // CATEGORIES
        fetchCategoriesTopics: ({ commit }, startSpinner = true) => {
            if (startSpinner) {
                commit("SET_LOADING", true, { root: true });
            } // start loading spinner
            return api.categoriesTopics
                .fetchCategoriesTopics()
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit(
                            "UPDATE_CATEGORIES",
                            data.marketingV1GetCategory
                        );
                        commit("UPDATE_TOPICS", data.marketingV1GetTopic);
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchCategories: ({ commit }) => {
            commit("SET_LOADING", true, { root: true });
            return api.categoriesTopics
                .fetchCategories()
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit(
                            "UPDATE_CATEGORIES",
                            data.marketingV1GetCategory
                        );
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        manageCategory: ({ commit, dispatch, state }, data) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.categoriesTopics
                .manageCategory(data)
                .then(response => {
                    // if create email successful, commit to store
                    let categoryIndex;
                    if (response.status == "200") {
                        categoryIndex = state.categories.findIndex(
                            cat => cat.id == response.data.id
                        );
                        if (categoryIndex == -1) {
                            commit("CREATE_CATEGORY", response.data);
                            dispatch("categoryTopic_cacheBust");
                            Vue.toasted.success(
                                "Category successfully created!"
                            );
                        } else {
                            // email exists, update it
                            commit("EDIT_CATEGORY", {
                                category: response.data,
                                categoryIndex
                            });
                            dispatch("categoryTopic_cacheBust");
                            Vue.toasted.success("Category successfully saved!");
                        }
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, categoryIndex };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        categoryTopic_cacheBust: () => {
            api.categoriesTopics.cacheBuster();
        },
        // TOPICS
        manageTopic: ({ commit, state }, data) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.categoriesTopics
                .manageTopic(data)
                .then(response => {
                    let topicIndex;
                    if (response.status == "200") {
                        topicIndex = state.topics.findIndex(
                            topic =>
                                topic.name.toLowerCase() ==
                                response.data.name.toLowerCase()
                        );
                        if (topicIndex == -1) {
                            // topic doesnt exist, create it
                            commit("CREATE_TOPIC", response.data);
                            Vue.toasted.success("Topic successfully created!");
                        } else {
                            // topic exists, update it
                            commit("EDIT_TOPIC", {
                                topic: response.data,
                                topicIndex
                            });
                            Vue.toasted.success("Topic successfully saved!");
                        }
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, topicIndex };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        deleteTopic: ({ commit, state }, name) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.categoriesTopics
                .deleteTopic(name)
                .then(response => {
                    let topicIndex;
                    if (response.status == "200") {
                        topicIndex = state.topics.findIndex(
                            topic => topic.name == name
                        );
                        commit("DELETE_TOPIC", topicIndex);
                        Vue.toasted.success("Topic successfully deleted!");
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return { response, topicIndex }; // return this data to component for extra handling
                })
                .catch(error => {
                    handleApiError(error);
                });
        }
    },

    getters: {
        allTopics: state => Object.values(state.topics),
        topicByName: state => name =>
            state.topics.find(topic => topic.name == name),
        allCategories: state => Object.values(state.categories),
        allCategories_short: state =>
            state.categories.map(category => ({
                id: category.id,
                name: category.name
            })),
        categoryById: state => id =>
            state.categories.find(category => category.id == id),
        categoryByName: state => name =>
            state.categories.find(category => category.name == name)
    }
};
