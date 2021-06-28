import Vue from "vue";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";

export default {
    state: {
        emails: [],
        baseTemplates: [],
        emailTypes: []
    },

    mutations: {
        UPDATE_EMAILS(state, emails) {
            state.emails = emails;
        },
        UPDATE_EMAIL(state, payload) {
            const { emailIndex, email } = payload;
            if (emailIndex >= 0) {
                state.emails.splice(emailIndex, 1, email);
            } else {
                state.emails.push(email);
            }
        },
        UPDATE_TEMPLATES(state, templates) {
            state.baseTemplates = templates;
        },
        UPDATE_EMAIL_TYPES(state, types) {
            state.emailTypes = types;
        },
        CREATE_EMAIL(state, email) {
            state.emails.push(email);
        },
        EDIT_EMAIL(state, payload) {
            Vue.set(state.emails, payload.index, payload.email);
        },
        DELETE_EMAIL(state, index) {
            state.emails.splice(index, 1);
        },
        CREATE_TEMPLATE(state, template) {
            state.baseTemplates.push(template);
        },
        EDIT_TEMPLATE(state, payload) {
            Vue.set(state.baseTemplates, payload.index, payload.template);
        }
    },

    actions: {
        updateEmail: ({ state, commit }, id) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.emails
                .fetchEmailData(id)
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        if (data.marketingV1GetEmailBatch.length > 0) {
                            const emailIndex = state.emails.findIndex(email => email.id == id);
                            commit("UPDATE_EMAIL", {
                                emailIndex,
                                email: data.marketingV1GetEmailBatch[0]
                            });
                        }
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return data.marketingV1GetEmailBatch[0];
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateEmails: ({ commit }) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.emails
                .fetchEmailsData()
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit("UPDATE_EMAILS", data.marketingV1GetEmailBatch);
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateTemplates: ({ commit }) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.emails
                .fetchEmailsTemplateData()
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit("UPDATE_TEMPLATES", data.marketingV1GetEmailTemplate);
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateEmailTypes: ({ commit }) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.emails
                .fetchEmailTypesData()
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit("UPDATE_EMAIL_TYPES", data.marketingV1GetEmailTypes);
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        reserveBatchId: () => api.emails.reserveBatchId(),
        createEmail: ({ commit, state }, data) =>
            api.emails
                .createEmail(data)
                .then(response => {
                    const email = JSON.parse(data.get("payload"));
                    // if create email successful, commit to store
                    if (response.status == "200") {
                        const index = state.emails.findIndex(eml => eml.id == response.data.id);
                        response.data.recipients = email.recipients;
                        if (index == -1) {
                            // email doesnt exist, create it
                            commit("CREATE_EMAIL", response.data);
                            Vue.toasted.success("Email successfully created!");
                        } else {
                            // email exists, update it
                            commit("EDIT_EMAIL", { email: response.data, index });
                            Vue.toasted.success("Email successfully saved!");
                        }
                    }
                    commit("SET_LOADING", false, { root: true });
                    return response;
                })
                .catch(error => {
                    // axios post had an error connecting to server
                    //console.log(error);
                    handleApiError(error);
                }),
        deleteEmail: ({ commit, state }, id) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.emails
                .deleteEmail(id)
                .then(resp => {
                    if (resp.status == "200") {
                        const index = state.emails.findIndex(email => email.id == id);
                        commit("DELETE_EMAIL", index);
                        Vue.toasted.success("Email successfully deleted!");
                    } else {
                        commit("SET_LOADING", false, { root: true });
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        createTemplate: ({ commit, state }, data) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            api.emails
                .createTemplate(data)
                .then(response => {
                    // if create email successful, commit to store
                    if (response.status == "200") {
                        if (data.id == null) {
                            commit("CREATE_TEMPLATE", response.data);
                            Vue.toasted.success("Template successfully created!");
                        } else {
                            const index = state.baseTemplates.findIndex(
                                bt => bt.id == response.data.id
                            );
                            commit("EDIT_TEMPLATE", { template: response.data, index });
                            Vue.toasted.success("Template successfully saved!");
                        }
                        commit("SET_LOADING", false, { root: true });
                    } else {
                        // create email failed, handle error
                        commit("SET_LOADING", false, { root: true });
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        // since this is real time ajax/ui update, we send back to the component
        // to handle the response (AddEditTemplate.vue)
        // eslint-disable-next-line no-unused-vars
        deleteTemplateVariable: ({ commit }, variableId) =>
            api.emails.deleteTemplateVariable(variableId)
    },

    getters: {
        allEmails: state => Object.values(state.emails),
        emailById: state => id => state.emails.find(template => template.id == id),
        baseTemplateById: state => id => state.baseTemplates.find(base => base.id == id)
    }
};
