import Vue from "vue";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";

export default {
    state: {
        users: [],
        loanOfficers: [],
        marketingEmployees: [],
        activeUser: {}
    },

    mutations: {
        // user groups
        UPDATE_ACTIVE_USER(state, user) {
            state.activeUser = user;
            const existingUserObject = JSON.parse(localStorage.getItem("mv3"));
            localStorage.setItem("mv3", JSON.stringify({ ...existingUserObject, ...user }));
        },
        UPDATE_EMPLOYEES(state, users) {
            state.users = users;
        },
        UPDATE_EMPLOYEE(state, payload) {
            const { userIndex, user } = payload;
            if (userIndex) {
                state.users.splice(userIndex, 1, user);
            } else {
                state.users.push(user);
            }
        },
        UPDATE_LOAN_OFFICERS(state, loanOfficers) {
            state.loanOfficers = loanOfficers;
        },
        UPDATE_MARKETING_EMPLOYEES(state, marketingEmployees) {
            state.marketingEmployees = marketingEmployees;
        },

        // user data
        UPDATE_AVAILABILITY(state, payload) {
            const { userIndex, availability, awayStartDatetime, awayEndDatetime } = payload;
            const user = state.users[userIndex];
            if (user) {
                state.users[userIndex].availability = availability;
                state.users[userIndex].awayStartDatetime = awayStartDatetime;
                state.users[userIndex].awayEndDatetime = awayEndDatetime;
            }
        },
        UPDATE_USER_MGP(state, payload) {
            const { userIndex, mgpValue } = payload;
            const user = state.users[userIndex];
            if (!user.isMagazineGiftProgramParticipant) {
                Vue.set(user, "isMagazineGiftProgramParticipant", mgpValue);
            }
            state.users[userIndex].isMagazineGiftProgramParticipant = mgpValue;
        },
        UPDATE_USER_ASSISTANTS(state, payload) {
            const { userIndex, assistants } = payload;
            state.users[userIndex].assistants = assistants;
        },
        UPDATE_SIGNATURE_PREFERENCES(state, payload) {
            const { userIndex, emailSignatureOptions } = payload;
            const user = state.users[userIndex];
            if (!user.emailSignatureOptions) {
                Vue.set(user, "emailSignatureOptions", emailSignatureOptions);
            }
            state.users[userIndex].emailSignatureOptions = emailSignatureOptions;
        },
        UPDATE_USER_ACCESS(state, payload) {
            const { userIndex, userRoles } = payload;
            state.users[userIndex].userRoles = userRoles;
        },
        UPDATE_USER_WEBSITE_BIO(state, payload) {
            const { userIndex, websiteBio } = payload;
            const user = state.users[userIndex];
            if (!user.websiteBio) {
                Vue.set(user, "websiteBio", []);
            }
            user.websiteBio = websiteBio;
        },
        UPDATE_USER_RP_CAMPAIGN(state, payload) {
            const { userIndex, referralPartnerCampaign, useAlternateContent } = payload;
            const user = state.users[userIndex];
            if (!user.emailSubscriptions) {
                Vue.set(user, "emailSubscriptions", []);
            }
            if (referralPartnerCampaign == 1) {
                user.emailSubscriptions.push({ type: "Referral Partner" });
            } else {
                const subscriptionIndex = user.emailSubscriptions.findIndex(
                    sub => sub.type == "Referral Partner"
                );
                user.emailSubscriptions.splice(subscriptionIndex, 1);
            }
            user.useAlternateContent = useAlternateContent;
        },
        UPDATE_NOTIFICATION_PREFERENCES(state, payload) {
            const { userIndex, notificationPreferences } = payload;
            const user = state.users[userIndex];
            if (user) {
                state.users[userIndex].notificationPreferences = notificationPreferences;
            }
        },

        // notifications
        UPDATE_NOTIFICATION(state, payload) {
            const { index } = payload;
            state.activeUser.notifications[index].isRead = 1;
        },
        CREATE_NOTIFICATION(state, notification) {
            state.activeUser.notifications.push(notification);
        }
    },

    actions: {
        bustEmployeeCache() {
            api.users.cacheBuster();
        },
        // fetching employee data
        fetchEmployees({ commit }) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.users
                .fetchEmployees()
                .then(response => {
                    if (response.status == "200") {
                        const { data } = response.data;
                        commit("UPDATE_EMPLOYEES", data.marketingV1GetEmployee);
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchEmployee({ commit, state }, id) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const userIndex = state.users.find(user => user.employeeNumber == id);
            return api.users
                .fetchEmployee(id)
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit("UPDATE_EMPLOYEE", { userIndex, user: data.marketingV1GetEmployee[0] });
                    }
                    commit("SET_LOADING", false, { root: true });
                    return data.marketingV1GetEmployee;
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchLoanOfficers({ commit }) {
            api.users
                .fetchLoanOfficers_short()
                .then(response => {
                    const { data } = response.data;
                    commit("UPDATE_LOAN_OFFICERS", data.marketingV1GetLoanOfficers);
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        fetchMarketingEmployees({ commit }) {
            return api.users
                .fetchMarketingEmployees_short()
                .then(response => {
                    const { data } = response.data;
                    commit("UPDATE_MARKETING_EMPLOYEES", data.marketingV1GetMarketingEmployees);
                })
                .catch(error => {
                    handleApiError(error);
                });
        },

        // updating user data
        updateActiveUser({ commit, dispatch }, employeeNumber) {
            dispatch("fetchEmployee", employeeNumber).then(activeUser => {
                commit("UPDATE_ACTIVE_USER", activeUser[0]);
            });
        },
        setActiveUser({ commit }, user) {
            commit("UPDATE_ACTIVE_USER", user);
        },
        updateAvailability({ commit, state, dispatch }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, availability, awayStartDatetime, awayEndDatetime } = payload;
            return api.users
                .updateAvailability({
                    employeeNumber,
                    availability,
                    awayStartDatetime,
                    awayEndDatetime
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_AVAILABILITY", {
                            userIndex,
                            availability,
                            awayStartDatetime,
                            awayEndDatetime
                        });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success("Your availability has been updated.");
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateNotificationPreferences({ commit, state, dispatch }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, notificationPreferences } = payload;
            return api.users
                .updatePreferences({
                    employeeNumber,
                    notificationPreferences
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_NOTIFICATION_PREFERENCES", {
                            userIndex,
                            notificationPreferences
                        });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success("Your notification preferences have been updated.");
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateUserMagazineGiftProgram({ commit, dispatch, state }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, isMagazineGiftProgramParticipant } = payload;
            return api.users
                .updateMagazineGiftProgramParticipation({
                    employeeNumber,
                    mgp: isMagazineGiftProgramParticipant
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_USER_MGP", {
                            userIndex,
                            mgpValue: isMagazineGiftProgramParticipant
                        });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success("Magazine Gift Program preference has been updated.");
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateUserRpCampaign({ commit, dispatch, state }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, referralPartnerCampaign, useAlternateContent } = payload;
            return api.users
                .updateRpEmailCampaign({
                    employeeNumber,
                    referralPartnerCampaign,
                    useAlternateContent
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_USER_RP_CAMPAIGN", {
                            userIndex,
                            referralPartnerCampaign,
                            useAlternateContent
                        });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success("RP campaign preferences have been updated.");
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateUserAssistants({ commit, dispatch, state }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, assistants } = payload;
            return api.users
                .updateAssistants({
                    employeeNumber,
                    assistants
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_USER_ASSISTANTS", { userIndex, assistants });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success("Assistants have been updated.");
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateUserWebsiteBio({ commit, dispatch, state }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, websiteBio } = payload;
            return api.users
                .updateWebsiteBio({
                    employeeNumber,
                    websiteBio
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_USER_MGP", { userIndex, websiteBio });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success("Website bio has been updated.");
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateUserAccess({ commit, dispatch, state }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, userRoles } = payload;
            return api.users
                .updateUserAccessLevel({
                    employeeNumber,
                    userRoles
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_USER_ACCESS", { userIndex, userRoles });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success(
                            "User role has been changed temporarily. Will be changed to AD settings on next sync."
                        );
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateSignaturePreferences({ commit, dispatch, state }, payload) {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { employeeNumber, emailSignatureOptions } = payload;
            return api.users
                .updateSignature({
                    employeeNumber,
                    emailSignatureOptions
                })
                .then(response => {
                    if (response.status === 200) {
                        const userIndex = state.users.findIndex(
                            user => user.employeeNumber == employeeNumber
                        );
                        commit("UPDATE_SIGNATURE_PREFERENCES", {
                            userIndex,
                            emailSignatureOptions
                        });
                        dispatch("bustEmployeeCache");
                        commit("SET_LOADING", false, { root: true });
                        Vue.toasted.success("Signature preferences have been updated.");
                    }
                })
                .catch(error => {
                    handleApiError(error);
                });
        },

        // user notifications
        updateNotifications({ commit, dispatch, state }, payload) {
            const { notificationIds, employeeNumber, isRead } = payload;

            commit("SET_LOADING", true, { root: true }); // start loading spinner
            api.notifications
                .manageNotification({ notificationIds, employeeNumber, isRead })
                .then(response => {
                    if (response.status == "200") {
                        response.data.forEach(notification => {
                            const index = state.activeUser.notifications.findIndex(
                                notif => notif.id == notification.id
                            );
                            commit("UPDATE_NOTIFICATION", { index });
                            dispatch("bustEmployeeCache");
                        });
                    }
                    commit("SET_LOADING", false, { root: true });
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        // eslint-disable-next-line no-unused-vars
        postNotification({ commit }, notification) {
            return api.notifications
                .createNotification(notification)
                .then(response => response)
                .catch(error => {
                    handleApiError(error);
                });
        },
        createNotification({ commit }, notification) {
            commit("CREATE_NOTIFICATION", notification);
        }
    },

    getters: {
        allUsers: state => state.users,
        userByEmployeeNumber: state => employeeNumber =>
            state.users.find(user => user.employeeNumber == employeeNumber),
        allLoanOfficers: state => state.loanOfficers,
        allMarketingEmployees: state => state.marketingEmployees,
        marketingEmployeeById: state => id =>
            state.marketingEmployees.find(employee => employee.employeeNumber == id),
        activeUser: state => state.activeUser
    }
};
