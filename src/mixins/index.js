import moment from "moment";
import md5 from "md5";

export const parse = {
    methods: {
        parseFilenameFromUrl(url) {
            if (url instanceof File) {
                return url.name;
            }
            return url.split("/").pop();
        },
        parseOrderStatus(str) {
            if (str == null) {
                str = "";
            }
            return str.split(" ").join("_");
        },
        parseStatusFromBool(status) {
            return status == 1 ? "Active" : "Inactive";
        }
    }
};

export const format = {
    methods: {
        formatDate(date, formatMap) {
            return moment(date).format(formatMap);
        }
    }
};

export const avatars = {
    methods: {
        buildAvatarUrl(email, size, type) {
            if (!email) {
                return "";
            }
            return `https://a.ruoff.com/image/${md5(
                email.toLowerCase()
            )}/size/${size}/type/${type}`;
        }
    }
};

export const renderByFileType = {
    methods: {
        renderByFileType(filepath) {
            if (filepath !== null) {
                const fileExt = filepath.split(".").pop();
                if (fileExt == "zip") {
                    const img = require("@/assets/images/zipFolder_icon.png");
                    return img;
                }
                if (fileExt == "doc" || fileExt == "docx") {
                    const img = require("@/assets/images/wordFile_icon.png");
                    return img;
                }
                if (fileExt == "csv" || fileExt == "xls" || fileExt == "xlsx") {
                    const img = require("@/assets/images/excelFile_icon.png");
                    return img;
                }
                if (fileExt == "pdf") {
                    // const img = require('@/assets/images/pdf_icon.png');
                    return null;
                }
                if (fileExt.startsWith("data")) {
                    return null;
                }
                return filepath;
            }
            return null;
        }
    }
};

export const orderUtility = {
    data() {
        return {
            selectedId: null,
            comment: "",
            commentIsPosting: false,
            commentIsAdmin: false
        };
    },
    computed: {
        userIsAdmin() {
            try {
                return this.activeUser.userRoles.includes(
                    "ROLE_MARKETING_EMPLOYEE"
                );
            } catch (error) {
                return undefined;
            }
        }
    },
    methods: {
        async changeOrderStatus(activeUser, order, newStatus) {
            const oldStatus = order.status;
            const { employeeNumber, email, fullName } = this.users.activeUser;
            const statusChangeObj = {
                id: null,
                note: `${fullName} changed the status from "${oldStatus}" to "${newStatus}".`,
                datetime: moment().format(),
                employee: {
                    employeeNumber,
                    email,
                    fullName
                }
            };
            // check this is a new status & post if true
            if (order.status !== newStatus) {
                const {
                    response,
                    orderId,
                    statusChange
                } = await this.updateOrderStatus({
                    orderId: order.id,
                    statusChange: statusChangeObj,
                    newStatus
                });
                if (response.status == "200") {
                    if (this.$socket) {
                        this.$socket.emit("updateOrderStatus", {
                            orderId,
                            newStatus,
                            statusChange
                        });
                    }
                    this.buildNotification(activeUser, order, "status");
                }
            }
        },
        async changeAssignedTo(activeUser, order, newAssignee) {
            const assignmentChangeObj = {
                id: Math.round(Math.random() * 100000),
                note: `${activeUser.fullName} assigned the order to ${newAssignee.fullName}.`,
                datetime: moment().format(),
                employee: {
                    employeeNumber: activeUser.employeeNumber,
                    email: activeUser.email,
                    fullName: activeUser.fullName
                }
            };
            if (order.assignedTo.fullName !== newAssignee.fullName) {
                const {
                    response,
                    orderId,
                    assignmentChange
                } = await this.updateAssignee({
                    orderId: order.id,
                    assignmentChange: assignmentChangeObj,
                    newAssignee
                });
                // wait on a good response before broadcasting the socket event
                if (response.status == "200") {
                    if (this.$socket) {
                        this.$socket.emit("updateAssignee", {
                            orderId,
                            newAssignee,
                            assignmentChange
                        });
                    }
                    this.buildNotification(activeUser, order, "assign");
                    // the API added assignee as follower, post it to the store
                    if (
                        !order.followers.some(
                            follower =>
                                follower.employeeNumber ==
                                order.assignedTo.employeeNumber
                        )
                    ) {
                        const followerObj = {
                            fullName: order.assignedTo.fullName,
                            email: order.assignedTo.email,
                            employeeNumber: order.assignedTo.employeeNumber
                        };
                        const orderIndex = this.orderIndexById(orderId);
                        this.ADD_FOLLOWER({
                            orderIndex,
                            follower: followerObj
                        });
                    }
                }
            }
        },
        async changeDueDate(activeUser, order, newDueDate) {
            const dueDateChangeObj = {
                id: Math.round(Math.random() * 100000),
                note: `${activeUser.fullName} changed the due date to ${moment(
                    newDueDate
                ).format("MM-DD-YY")}.`,
                datetime: moment().format(),
                employee: {
                    employeeNumber: activeUser.employeeNumber,
                    email: activeUser.email,
                    fullName: activeUser.fullName
                }
            };
            // check this is a new due date & post if true
            if (
                moment(order.dueDate).format("MM-DD-YY") !=
                moment(newDueDate).format("MM-DD-YY")
            ) {
                const {
                    response,
                    orderId,
                    dueDateChange
                } = await this.updateDueDate({
                    orderId: order.id,
                    dueDateChange: dueDateChangeObj,
                    newDueDate: newDueDate
                });
                if (response.status == "200") {
                    // update was successful, push to connected clients
                    if (this.$socket) {
                        this.$socket.emit("updateDueDate", {
                            orderId,
                            newDueDate: moment(newDueDate).format(),
                            dueDateChange
                        });
                    }
                    this.buildNotification(activeUser, order, "dueDate");
                }
            }
        },
        async editDeliverableStatus(activeUser, order, newStatus) {
            const localSelected = JSON.parse(
                JSON.stringify({ ...this.selectedProof })
            );
            localSelected.status = newStatus;
            const formData = new FormData();
            Object.keys(localSelected).forEach(key => {
                if (key == "id" || key == "status") {
                    // filepath not needed by back end (large base64 string)
                    formData.append(key, localSelected[key]);
                }
            });
            const { response } = await this.manageDeliverable({
                orderId: order.id,
                deliverable: localSelected,
                data: formData // key formData as 'data' inside object
            });
            if (response.status == "200") {
                if (newStatus == "approved") {
                    if (this.allProofsApproved) {
                        // the new order status depends on if this order needs a 3rd party
                        if (order.product.requires3rdParty == 1) {
                            this.changeOrderStatus(
                                activeUser,
                                order,
                                "Needs Ordered"
                            );
                        } else {
                            this.changeOrderStatus(
                                activeUser,
                                order,
                                "Approved"
                            );
                        }
                    }
                }
                if (newStatus == "underReview") {
                    if (order.status !== "Needs Approval") {
                        this.changeOrderStatus(
                            activeUser,
                            order,
                            "Needs Approval"
                        );
                    }
                    this.buildNotification(activeUser, order, "proof");
                }

                if (this.$socket) {
                    this.$socket.emit("updateDeliverableStatus", {
                        orderId: this.order.id,
                        deliverable: localSelected
                    });
                }
            }
        },
        async postComment(activeUser, order, validate = true) {
            let validated = true;
            if (validate) {
                const validationResult = await this.$refs.commentInput.validate();
                validated = validationResult.valid;
            }

            if (!this.commentIsPosting && validated) {
                this.commentIsPosting = true;
                const comment = {
                    id: null,
                    employee: {
                        employeeNumber: activeUser.employeeNumber
                    },
                    comment: `${
                        this.commentIsAdmin == 1
                            ? '<span class="adminFlag">[ADMIN]&nbsp;</span>'
                            : ""
                    }${this.comment}`,
                    isAdmin: this.commentIsAdmin ? 1 : 0,
                    datetime: null,
                    filepath: null,
                    filename: null,
                    ideaId: null
                };

                const { response, orderId } = await this.createComment({
                    orderId: order.id,
                    comment
                });
                if (response.status == "200") {
                    // update connected clients via sockets
                    if (this.$socket) {
                        this.$socket.emit("manageComment", {
                            orderId,
                            comment: response.data
                        });
                    }
                    // if comment passes conditions, change order status to 'commented'
                    if (
                        this.userIsAdmin == false &&
                        statusCanChangeToCommented()
                    ) {
                        this.changeOrderStatus(activeUser, order, "Commented");
                    }
                    // dont send notification if admin comment
                    if (this.commentIsAdmin != 1) {
                        this.buildNotification(activeUser, order, "comment");
                    }
                }
                this.comment = "";
                this.commentIsPosting = false;
            }

            function statusCanChangeToCommented() {
                if (
                    order.status != "Commented" &&
                    order.status != "Delayed" &&
                    order.status != "Needs Revision" &&
                    order.status != "Needs Approval" &&
                    order.status != "Approved" &&
                    order.status != "Completed"
                ) {
                    return true;
                }
                return false;
            }
        }
    }
};

export const buildNotification = {
    methods: {
        async buildNotification(activeUser, order, type) {
            const recipients = [];

            // build the notification object
            const notification = {
                id: null,
                recipients,
                isRead: 0,
                createdDatetime: null,
                message: "",
                destinationUrl: `/orders/${order.id}`,
                preferenceId: null
            };
            switch (type) {
                case "assign": {
                    notification.message = `
                        ${order.assignedTo.fullName} has been assigned to <strong>order #${order.id}</strong>
                    `;
                    notification.preferenceId = 1;
                    break;
                }
                case "comment": {
                    notification.message = `
                        <strong>${activeUser.fullName}</strong> added a comment to <strong>order #${order.id}</strong>: ${this.comment}
                    `;
                    notification.preferenceId = 2;
                    break;
                }
                case "status": {
                    notification.message = `
                        <strong>${
                            activeUser.fullName
                        }</strong> changed the status of <strong>order #${
                        order.id
                    }</strong> to <span class="${this.parseOrderStatus(
                        order.status
                    )}--text"><strong>${order.status}</strong></span>
                    `;
                    notification.preferenceId = 3;
                    break;
                }
                case "dueDate": {
                    notification.message = `
                        <strong>${
                            activeUser.fullName
                        }</strong> changed the estimated delivery date for <strong>order #${
                        order.id
                    }</strong> to ${this.formatDate(order.dueDate, "MM-DD-YY")}
                    `;
                    notification.preferenceId = 5;
                    break;
                }
                case "proof": {
                    notification.message = `
                        <strong>${activeUser.fullName}</strong> has added a new proof to <strong>order #${order.id}</strong>
                    `;
                    notification.preferenceId = 4;
                    break;
                }
                default: {
                    break;
                }
            }
            // figure out who should recieve the notification based on preferences
            order.followers.forEach(follower => {
                // notification not needed for the activeUser
                const preference = follower.notificationPreferences.find(
                    pref => pref.id == notification.preferenceId
                );
                if (
                    follower.employeeNumber != activeUser.employeeNumber &&
                    preference.receiveNotification == 1
                ) {
                    notification.recipients.push(follower.employeeNumber);
                }
            });

            const response = await this.postNotification(notification);
            // after notification successfully posted, update clients immediately via sockets
            if (response.status == 200) {
                if (this.$socket) {
                    notification.id = response.data.id;
                    notification.createdDatetime =
                        response.data.createdDatetime;
                    this.$socket.emit("createNotification", notification);
                }
            }
        }
    }
};
