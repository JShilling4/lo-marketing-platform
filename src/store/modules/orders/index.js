import Vue from "vue";
import moment from "moment";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";

export default {
    state: {
        orders: [],
        statuses: [
            "Assigned",
            "In Progress",
            "Needs Approval",
            "Needs Information",
            "Delayed",
            "Ordered",
            "Needs Ordered",
            "Needs Revision",
            "Approved",
            "Completed",
            "Commented"
        ],
        areLoading: false
    },

    mutations: {
        UPDATE_ORDERS(state, orders) {
            state.orders = orders;
        },
        UPDATE_ORDER(state, payload) {
            const { orderIndex, order } = payload;
            if (orderIndex >= 0) {
                state.orders.splice(orderIndex, 1, order);
            } else {
                state.orders.push(order);
            }
        },
        UPDATE_ORDER_STATUS(state, payload) {
            const { orderIndex, newStatus } = payload;
            state.orders[orderIndex].status = newStatus;
        },
        UPDATE_DELIVERABLE(state, payload) {
            const { orderIndex, deliverableIndex, deliverable } = payload;
            state.orders[orderIndex].deliverables.splice(
                deliverableIndex,
                1,
                deliverable
            );
        },
        UPDATE_ASSIGNEE(state, payload) {
            const { orderIndex, newAssignee } = payload;
            state.orders[orderIndex].assignedTo = newAssignee;
        },
        UPDATE_DUE_DATE(state, payload) {
            const { orderIndex, newDueDate } = payload;
            state.orders[orderIndex].dueDate = newDueDate;
        },
        CREATE_ORDER(state, order) {
            state.orders.push(order);
        },
        CREATE_ORDER_ACTIVITY(state, payload) {
            const { orderIndex, activity } = payload;
            state.orders[orderIndex].orderActivity.push(activity);
        },
        CREATE_COMMENT(state, payload) {
            const { orderIndex, comment } = payload;
            state.orders[orderIndex].comments.push(comment);
        },
        CREATE_DELIVERABLE(state, payload) {
            const { orderIndex, deliverable } = payload;
            state.orders[orderIndex].deliverables.push(deliverable);
        },
        ADD_FOLLOWER(state, payload) {
            const { orderIndex, follower } = payload;
            state.orders[orderIndex].followers.push(follower);
        },
        DELETE_DELIVERABLE(state, payload) {
            const { orderIndex, deliverableIndex } = payload;
            state.orders[orderIndex].deliverables.splice(deliverableIndex, 1);
        },
        DELETE_ORDER(state, orderIndex) {
            state.orders.splice(orderIndex, 1);
        },
        DELETE_COMMENT(state, payload) {
            const { orderIndex, commentIndex } = payload;
            state.orders[orderIndex].comments.splice(commentIndex, 1);
        },
        REMOVE_FOLLOWER(state, payload) {
            const { orderIndex, followerIndex } = payload;
            state.orders[orderIndex].followers.splice(followerIndex, 1);
        },
        TOGGLE_ORDERS_LOADING(state, payload) {
            state.areLoading = payload;
        }
    },

    actions: {
        bustOrderCache() {
            api.orders.cacheBuster();
        },
        fetchOrders: ({ commit }) => {
            commit("TOGGLE_ORDERS_LOADING", true);
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .fetchAllOrders()
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        commit("UPDATE_ORDERS", data.marketingV1GetOrders);
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    commit("TOGGLE_ORDERS_LOADING", false);
                })
                .catch(error => {
                    handleApiError(error);
                    commit("TOGGLE_ORDERS_LOADING", false);
                });
        },
        bulkUpdateOrders: ({ dispatch, commit, getters, state }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .bulkUpdateOrders(payload)
                .then(response => {
                    if (response.status == "200") {
                        // loop the order IDs and make the necessary mutations
                        let bustCache = false;
                        payload.orderIds.forEach(id => {
                            const orderIndex = state.orders.findIndex(
                                order => order.id == id
                            );
                            if (payload.status !== null) {
                                commit("UPDATE_ORDER_STATUS", {
                                    orderIndex,
                                    newStatus: payload.status
                                });
                            }
                            if (payload.assignedTo !== null) {
                                commit("UPDATE_ASSIGNEE", {
                                    orderIndex,
                                    newAssignee: payload.assignedTo
                                });
                                // dispatch("createOrderActivity", { id, activity: assignmentChange });
                            }
                            if (payload.dueDate !== null) {
                                commit("UPDATE_DUE_DATE", {
                                    orderIndex,
                                    newDueDate: payload.dueDate
                                });
                                // dispatch("createOrderActivity", { id, activity: dueDateChange });
                            }
                            if (
                                bustCache == false &&
                                getters.shouldBeCached(id)
                            ) {
                                bustCache = true;
                            }
                        });
                        if (bustCache) {
                            dispatch("bustOrderCache");
                        }
                    }
                    Vue.toasted.success("Bulk order update successful!");
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return response;
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateOrder: ({ commit, state }, id) => {
            // commit('TOGGLE_ORDERS_LOADING', true);
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .fetchOrder(id)
                .then(response => {
                    const { data } = response.data;
                    if (response.status == "200") {
                        if (data.marketingV1GetOrders.length > 0) {
                            const orderIndex = state.orders.findIndex(
                                order => order.id == id
                            );
                            commit("UPDATE_ORDER", {
                                orderIndex,
                                order: data.marketingV1GetOrders[0]
                            });
                        }
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner

                    return data.marketingV1GetOrders;
                })
                .catch(error => {
                    handleApiError(error);
                    // commit('TOGGLE_ORDERS_LOADING', false);
                });
        },
        updateOrderStatus: ({ dispatch, commit, getters, state }, payload) => {
            const { orderId, statusChange, newStatus } = payload;
            const orderIndex = state.orders.findIndex(
                order => order.id == orderId
            );
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .updateOrderStatus({ orderId, newStatus })
                .then(response => {
                    // if create order successful, commit to store
                    if (response.status == "200") {
                        commit("UPDATE_ORDER_STATUS", {
                            orderIndex,
                            newStatus
                        });
                        dispatch("createOrderActivity", {
                            orderId,
                            activity: statusChange
                        });
                        if (getters.shouldBeCached(orderId)) {
                            dispatch("bustOrderCache");
                        }
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, orderId, statusChange };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateAssignee: ({ dispatch, commit, getters, state }, payload) => {
            const { orderId, assignmentChange, newAssignee } = payload;
            const orderIndex = state.orders.findIndex(o => o.id == orderId);
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .updateAssignee({ orderId, newAssignee })
                .then(response => {
                    // if create order successful, commit to store
                    if (response.status == "200") {
                        commit("UPDATE_ASSIGNEE", { orderIndex, newAssignee });
                        dispatch("createOrderActivity", {
                            orderId,
                            activity: assignmentChange
                        });
                        if (getters.shouldBeCached(orderId)) {
                            dispatch("bustOrderCache");
                        }
                        Vue.toasted.success(
                            "Order assignment has been successfully updated."
                        );
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, orderId, assignmentChange };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        updateDueDate: ({ dispatch, commit, getters, state }, payload) => {
            const { orderId, dueDateChange, newDueDate } = payload;
            const orderIndex = state.orders.findIndex(
                order => order.id == orderId
            );
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .updateDueDate({ orderId, newDueDate })
                .then(response => {
                    // if create order successful, commit to store
                    if (response.status == "200") {
                        commit("UPDATE_DUE_DATE", { orderIndex, newDueDate });
                        dispatch("createOrderActivity", {
                            orderId,
                            activity: dueDateChange
                        });
                        if (getters.shouldBeCached(orderId)) {
                            dispatch("bustOrderCache");
                        }
                        Vue.toasted.success(
                            `Order due date changed to "${moment(
                                newDueDate
                            ).format("MM-DD-YY")}"`
                        );
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, orderId, dueDateChange };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        createOrder: ({ commit }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .placeOrder(payload)
                .then(response => {
                    // if create order successful, commit to store
                    if (response.status == "200") {
                        commit("CREATE_ORDER", response.data);
                        Vue.toasted.success("Your order has been received.");
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        createOrderActivity: ({ commit, state }, payload) => {
            const { orderId, activity } = payload;
            const orderIndex = state.orders.findIndex(
                order => order.id == orderId
            );
            return api.orders
                .createOrderActivity({ orderId, activity })
                .then(response => {
                    if (response.status == "200") {
                        commit("CREATE_ORDER_ACTIVITY", {
                            orderIndex,
                            activity: response.data
                        });
                    }
                    return { response, orderId, activity };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        createComment: ({ commit, getters }, payload) => {
            const { orderId, comment } = payload;
            const orderIndex = getters.orderIndexById(orderId);

            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .manageComment({ orderId, comment })
                .then(response => {
                    // if create order successful, commit to store
                    if (response.status == "200") {
                        commit("CREATE_COMMENT", {
                            orderIndex,
                            comment: response.data
                        });
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, orderId };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        addOrderFollower: ({ commit, getters }, payload) => {
            const { orderId, follower } = payload;
            const orderIndex = getters.orderIndexById(orderId);

            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .addOrderFollower({
                    orderId,
                    employeeNumber: follower.employeeNumber
                })
                .then(response => {
                    // if create order successful, commit to store
                    if (response.status == "200") {
                        commit("ADD_FOLLOWER", { orderIndex, follower });
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, orderId };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        manageDeliverable: ({ commit, state }, payload) => {
            const { orderId, deliverableId, data } = payload;
            const orderIndex = state.orders.findIndex(
                order => order.id == orderId
            );

            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .manageDeliverable(data)
                .then(response => {
                    // if create order successful, commit to store
                    let deliverableIndex;
                    if (response.status == "200") {
                        deliverableIndex = state.orders[
                            orderIndex
                        ].deliverables.findIndex(
                            del => del.id == response.data.id
                        );
                        if (deliverableIndex == -1) {
                            // deliverable doesnt exist, create it
                            commit("CREATE_DELIVERABLE", {
                                orderIndex,
                                deliverable: response.data
                            });
                        } else {
                            // deliverable exists, update it
                            commit("UPDATE_DELIVERABLE", {
                                orderIndex,
                                deliverableIndex,
                                deliverable: response.data
                            });
                        }
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, orderId, deliverableId };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        replaceDeliverable: ({ commit, state }, payload) => {
            const { orderId, data } = payload;
            const orderIndex = state.orders.findIndex(
                order => order.id == orderId
            );

            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .replaceDeliverable(data)
                .then(response => {
                    // if create order successful, commit to store
                    let deliverableIndex;
                    if (response.status == "200") {
                        deliverableIndex = state.orders[
                            orderIndex
                        ].deliverables.findIndex(
                            del => del.id == response.data.id
                        );
                        commit("UPDATE_DELIVERABLE", {
                            orderIndex,
                            deliverableIndex,
                            deliverable: response.data
                        });
                    }
                    commit("SET_LOADING", false, { root: true });
                    return { response, orderId };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        deleteDeliverable: ({ commit, state }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { orderId, deliverableId } = payload;
            const orderIndex = state.orders.findIndex(
                order => order.id == orderId
            );
            const deliverableIndex = state.orders[
                orderIndex
            ].deliverables.findIndex(del => del.id == deliverableId);
            return api.orders
                .deleteDeliverable(deliverableId)
                .then(response => {
                    if (response.status == "200") {
                        commit("DELETE_DELIVERABLE", {
                            orderIndex,
                            deliverableIndex
                        });
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return { response, orderIndex, deliverableIndex };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        deleteComment: ({ commit, getters }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { orderId, commentId } = payload;
            const orderIndex = getters.orderIndexById(orderId);
            const commentIndex = getters.commentIndexById(
                orderIndex,
                commentId
            );

            return api.orders
                .deleteComment(commentId)
                .then(response => {
                    if (response.status == "200") {
                        commit("DELETE_COMMENT", { orderIndex, commentIndex });
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return { response, orderId, commentId };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        deleteOrder: ({ dispatch, commit, getters, state }, orderId) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            return api.orders
                .deleteOrder(orderId)
                .then(response => {
                    const orderIndex = state.orders.findIndex(
                        order => order.id == orderId
                    );
                    if (response.status == "200") {
                        commit("DELETE_ORDER", { orderIndex });
                        if (getters.shouldBeCached(orderId)) {
                            dispatch("bustOrderCache");
                        }
                        Vue.toasted.success("Order successfully deleted.");
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return response;
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        removeOrderFollower: ({ commit, getters }, payload) => {
            commit("SET_LOADING", true, { root: true }); // start loading spinner
            const { orderId, employeeNumber } = payload;
            const orderIndex = getters.orderIndexById(orderId);

            return api.orders
                .deleteOrderFollower(orderId, employeeNumber)
                .then(response => {
                    const followerIndex = getters.followerIndexById(
                        orderIndex,
                        employeeNumber
                    );

                    if (response.status == "200") {
                        commit("REMOVE_FOLLOWER", {
                            orderIndex,
                            followerIndex
                        });
                    }
                    commit("SET_LOADING", false, { root: true }); // close loading spinner
                    return { response, orderId, employeeNumber };
                })
                .catch(error => {
                    handleApiError(error);
                });
        },
        downloadDeliverable: ({ context }, url) =>
            api.orders
                .fetchDownloadBlob(url)
                .then(response => response)
                .catch(() => {})
    },

    getters: {
        // ORDER OBJECTS
        orderById: state => id => state.orders.find(order => order.id == id),
        allOrders: state => state.orders,
        // FILTERS
        ordersByActiveUser: state => activeUser => {
            if (activeUser.userRoles.includes("ROLE_MARKETING_EMPLOYEE")) {
                const matches = state.orders.filter(
                    order =>
                        order.assignedTo.employeeNumber ==
                            activeUser.employeeNumber ||
                        order.orderedFor.employeeNumber ==
                            activeUser.employeeNumber ||
                        order.orderedBy.employeeNumber ==
                            activeUser.employeeNumber
                );
                return matches;
            }
            const matches = state.orders.filter(
                order =>
                    order.orderedFor == activeUser.employeeNumber ||
                    order.orderedBy == activeUser.employeeNumber
            );
            return matches;
        },
        // ORDER HISTORY
        orderActivityById: state => id => {
            const order = state.orders.find(ord => ord.id == id);
            const orderEvents = order.orderActivity.concat(order.comments);
            return orderEvents.sort((a, b) =>
                a.datetime > b.datetime ? 1 : -1
            );
        },
        allOrderActivity: state => {
            const results = [];
            state.orders.forEach(order => {
                const concatted = order.orderActivity.concat(order.comments);
                concatted.forEach(item => {
                    item.orderId = order.id;
                    results.push(item);
                });
            });
            return results.sort((a, b) => (b.datetime > a.datetime ? 1 : -1));
        },
        // ORDER COUNTS
        ordersPlaced: state => daterange => {
            let count = 0;
            const today = new Date();
            Object.keys(state.orders).forEach(id => {
                const orderDate = new Date(state.orders[id].orderedDatetime);
                if (moment(orderDate, daterange).isSame(today, daterange)) {
                    count++;
                }
            });
            return count.toString();
        },
        ordersCompleted: state => daterange => {
            let count = 0;
            const today = new Date();
            Object.keys(state.orders).forEach(id => {
                const order = state.orders[id];
                if (order.orderStatus == "Completed") {
                    const orderDate = new Date(
                        state.orders[id].completedDatetime
                    );
                    if (moment(orderDate, daterange).isSame(today, daterange)) {
                        count++;
                    }
                }
            });
            return count.toString();
        },
        openOrderCount: state => {
            let count = 0;
            state.orders.forEach(order => {
                if (order.status !== "Completed") {
                    count++;
                }
            });
            return count.toString();
        },
        // STATUS COUNTS
        statusCount: state => status => {
            const matches = state.orders.filter(
                order => order.status == status
            );
            return matches.length;
        },

        // INDEXES
        orderIndexById: state => id =>
            state.orders.findIndex(order => order.id == id),
        commentIndexById: state => (orderIndex, commentId) =>
            state.orders[orderIndex].comments.findIndex(
                comment => comment.id == commentId
            ),
        followerIndexById: state => (orderIndex, employeeNumber) =>
            state.orders[orderIndex].followers.findIndex(
                follower => follower.employeeNumber == employeeNumber
            ),
        deliverableIndexById: state => (orderIndex, deliverableId) =>
            state.orders[orderIndex].deliverables.findIndex(
                deliverable => deliverable.id == deliverableId
            ),

        // HELPERS
        shouldBeCached: state => id => {
            const order = state.orders.find(ord => ord.id == id);
            return moment() > moment(order.orderedDatetime).add(29, "days");
        }
    }
};
