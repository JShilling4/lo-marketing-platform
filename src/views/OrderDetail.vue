<template>
    <div>
        <transition
            name="fadeInOut"
            mode="out-in"
        >
            <div
                v-if="order && !ordersAreLoading"
                class="order-container"
            >
                <guidance-tip
                    v-if="showGuidanceTip && guidanceShouldDisplay"
                    :title="order.status"
                    :body-text="guidanceBodyText"
                    @close="showGuidanceTip = false"
                />
                <!-- Order Info -->
                <div class="order-container__leftBlock">
                    <!-- Order title -->
                    <div class="header">
                        <a
                            :href="`/product/${order.product.id}`"
                            target="_blank"
                        >
                            <h1 class="header__orderName">{{ order.product.name }}</h1>
                        </a>
                        <h2 class="header__category">{{ order.product.category.name }}</h2>
                    </div>

                    <!-- Headline block -->
                    <div class="assignment">
                        <!-- Assign To -->
                        <div
                            class="assignment__left"
                            @click="assignmentDropdownShowing = !assignmentDropdownShowing"
                        >
                            <app-avatar
                                :avatar-url="assignedToAvatar"
                                alt="Picture of Assignee"
                                :size="windowWidth < 420 ? 'small' : 'large'"
                            />
                            <div class="assignedTo">
                                <label>Assigned To:</label>
                                <span class="assignee">{{ order.assignedTo.fullName }}</span>
                                <div
                                    v-if="assignmentDropdownShowing && order.product.isDownload == 0 && userIsAdmin"
                                    v-on-clickaway="closeAssignmentDropdown"
                                    class="multiselect-wrapper"
                                >
                                    <multi-select
                                        v-focus
                                        :options="allMarketingEmployees"
                                        track-by="employeeNumber"
                                        placeholder=""
                                        label="fullName"
                                        selectLabel=""
                                        deselectLabel=""
                                        class="employeeList"
                                        @close="closeAssignmentDropdown"
                                        @select="assigneeSelected($event)"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- Due date -->
                        <div class="assignment__right">
                            <img src="@/assets/images/dueDate_icon.png" />
                            <div class="dueDate">
                                <label>
                                    <app-tooltip tip-text="If the due date falls on a weekend or holiday, please allow until the following business day for order completion." />Due Date:
                                </label>
                                <date-time-picker
                                    v-if="order.product.isDownload == 0"
                                    :no-value-to-custom-elem="true"
                                    :no-button-now="true"
                                    :no-button="true"
                                    :no-weekends-days="true"
                                    color="#16af8c"
                                    button-color="#16af8c"
                                    v-model="localOrder.dueDate"
                                    :only-date="true"
                                    format="YYYY-MM-DD"
                                    :min-date="minDate"
                                    @input="changeDueDate(activeUser, order, $event)"
                                    :auto-close="true"
                                    :disabled="userIsAdmin ? false : true"
                                >
                                    <button class="pickerTrigger">
                                        {{ formatDate(order.dueDate, "MMM Do, YYYY") }}
                                    </button>
                                </date-time-picker>
                                <button
                                    v-if="order.product.isDownload == 1"
                                    class="pickerTrigger"
                                >
                                    Instant Download
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Order Info -->
                    <div class="orderInfo">
                        <!-- Product details -->

                        <!-- Order Date -->
                        <div class="flex-group">
                            <label>Order Date:</label>
                            <span class="orderInfo__value">{{
                formatDate(order.orderedDatetime, "MMM Do, YYYY")
              }}</span>
                        </div>
                        <!-- Order Number -->
                        <div class="flex-group">
                            <label>Order Number:</label>
                            <span class="orderInfo__value">{{ order.id }}</span>
                        </div>
                        <!-- Ordered By -->
                        <div
                            v-if="order.orderedBy.fullName !== order.orderedFor.fullName"
                            class="flex-group"
                        >
                            <label>Ordered By:</label>
                            <span class="orderInfo__value">{{ order.orderedBy.fullName }}</span>
                        </div>
                        <!-- Ordered For -->
                        <div class="flex-group">
                            <label>Ordered For:</label>
                            <span
                                class="orderInfo__value orderedFor"
                                :style="userIsAdmin ? { cursor: 'pointer', 'text-decoration': 'underline' } : ''"
                                @click="goToUserIfAdmin(order.orderedFor.employeeNumber)"
                            >{{ order.orderedFor.fullName }}</span>
                        </div>

                        <!-- Submitted Information -->
                        <div class="group submittedDetails">
                            <h3 class="label details-label">Submitted Details</h3>
                            <div
                                class="flex-group"
                                v-for="detail in order.details"
                                :key="detail.id"
                            >
                                <label>{{ detail.label }}:</label>
                                <a
                                    v-if="detail.type == 'file'"
                                    :href="detail.value"
                                    class="value"
                                    target="_blank"
                                >
                                    {{ parseFilenameFromUrl(detail.value) }}
                                </a>
                                <span
                                    v-else
                                    class="value"
                                >{{ detail.value }}</span>
                            </div>
                            <span
                                v-if="order.details && order.details.length < 1"
                                class="noValue"
                            >
                                No submitted information.
                            </span>
                        </div>

                        <!-- Proof carousel -->
                        <transition name="fadeInOut">
                            <div
                                v-if="order.product.isDownload == 0 && !ordersAreLoading"
                                class="orderInfo__deliverables"
                            >
                                <h3 class="label deliverables-label">Proofs</h3>
                                <carousel
                                    v-if="proofs.length > 0"
                                    :deliverables="proofs"
                                    @slide-clicked="goToProofDisplay"
                                />
                                <span v-else>No proofs to review</span>
                            </div>
                        </transition>
                    </div>
                </div>

                <!-- Current status / Deliverables -->
                <div class="order-container__rightBlock">
                    <div class="controls">
                        <!-- Status dropdown -->
                        <div
                            class="status-block"
                            @click="statusDropdownShowing = !statusDropdownShowing"
                            v-on-clickaway="closeStatusDropdown"
                        >
                            <label>Status:</label>
                            <span
                                class="status"
                                :class="parseOrderStatus(order.status)"
                            >
                                {{ order.status }}
                            </span>
                            <img
                                v-if="userIsAdmin && order.product.isDownload == 0"
                                src="@/assets/images/dropdown_icon_black.png"
                                class="toggleIcon"
                            />
                            <transition name="orderStatus">
                                <ul
                                    v-if="userIsAdmin && statusDropdownShowing == true && order.product.isDownload == 0"
                                    class="status-block__dropdown"
                                    v-on-clickaway="closeStatusDropdown"
                                >
                                    <li
                                        v-for="status in orders.statuses"
                                        :key="status"
                                        class="status"
                                        :class="parseOrderStatus(status)"
                                        @click="changeOrderStatus(activeUser, order, status)"
                                    >
                                        {{ status }}
                                    </li>
                                </ul>
                            </transition>
                        </div>

                        <!-- Re-order or Delete controls -->
                        <router-link :to="{
                name: 'ProductDetail',
                params: { productId: this.order.product.id, details: this.order.details }
              }">
                            <app-button
                                v-if="!userIsAdmin && order.status == 'Completed'"
                                classes="btn btn-blue"
                                text="Re-order"
                            />
                        </router-link>
                        <app-button
                            v-if="deleteShouldDisplay"
                            classes="btn btn-red deleteBtn"
                            text="Delete"
                            @click.native="onDeleteOrder"
                        />
                    </div>

                    <!-- (Admin) Files Management -->
                    <div
                        v-if="order.product.isDownload == 0 && userIsAdmin"
                        class="deliverables-block"
                    >
                        <h3>
                            Files
                            <app-tooltip
                                tip-text="Drag &amp; drop or click in the box to add a new file to the order. Upload files here that need approved or are ready for download."
                                icon-position="right"
                            />
                        </h3>
                        <div
                            v-cloak
                            @drop.prevent="deliverablesFilesUploaded"
                            @dragover.prevent
                            class="deliverables-container"
                        >
                            <input
                                type="file"
                                ref="deliverablesInput"
                                @input="deliverablesFilesUploaded"
                                multiple
                                class="dragDrop"
                                title=" "
                            />
                            <div
                                v-for="deliverable in order.deliverables"
                                :key="deliverable.id"
                                class="deliverable"
                            >
                                <i
                                    class="fas fa-edit editDeliverable"
                                    :class="{ active: deliverable.id == activeEditIcon }"
                                    @click.stop="openDeliverableMenu(deliverable)"
                                />
                                <a
                                    :href="deliverable.assets[0].filepath"
                                    :class="{
                    deprecated: deliverable.status == 'deprecated',
                    final: deliverable.status == 'final',
                    approved: deliverable.status == 'approved',
                    uploaded: deliverable.status == 'uploaded'
                  }"
                                    target="_blank"
                                >
                                    {{ parseFilenameFromUrl(deliverable.assets[0].filepath) }}
                                </a>
                            </div>
                        </div>
                        <!-- File Menu -->
                        <transition name="fileMenu">
                            <file-menu
                                v-if="deliverableMenuOpen"
                                v-on-clickaway="closeDeliverableMenu"
                                @close="closeDeliverableMenu"
                                @remove="removeDeliverable"
                                @edit="editDeliverableStatus(activeUser, order, $event)"
                                @input="onReplaceDeliverable"
                                :selected-proof="selectedProof"
                            />
                        </transition>
                    </div>

                    <!-- Downloads Box -->
                    <div class="deliverables-block">
                        <h3>
                            Downloads
                            <app-tooltip
                                tip-text="This box represents the finalized version of files that are ready for download."
                                icon-margin-left="0"
                                icon-margin-right="0"
                                icon-position="right"
                            />
                        </h3>
                        <div class="deliverables-container">
                            <div
                                v-for="final in finalDeliverables"
                                :key="final.id"
                                class="deliverable"
                            >
                                <p
                                    @click="onDownloadDeliverable(final.assets[getRawImageIndex(final)].filepath)"
                                    class="final"
                                >
                                    {{ parseFilenameFromUrl(final.assets[getRawImageIndex(final)].filepath) }}
                                </p>
                            </div>
                        </div>
                        <div class="downloadControls">
                            <app-button
                                v-if="order.status == 'Completed' && order.product.isDownload == 0 && !userIsAdmin"
                                classes="btn btn-orange"
                                text="Revise Order"
                                @click.native="revisionBoxShowing = !revisionBoxShowing"
                            />

                            <!-- Revision comment box -->
                            <transition name="reviseBox">
                                <div
                                    v-if="revisionBoxShowing"
                                    class="revisionBox-container"
                                >
                                    <revision-comment-box
                                        v-model="reopenComment"
                                        @close="revisionBoxShowing = false"
                                        @add-revision-comment="reopenOrder"
                                    />
                                </div>
                            </transition>

                            <app-button
                                v-if="finalDeliverables.length != 0"
                                classes="btn btn-green download"
                                @click.native="downloadAllDeliverables"
                                text="Download All"
                            />
                        </div>
                    </div>
                </div>

                <!-- Order Acitivy -->
                <transition name="fadeInOut">
                    <div
                        v-if="order.product.isDownload == 0"
                        class="belowFold"
                    >
                        <h3 class="label activity-label">Order Activity</h3>
                        <!-- Order Activity -->
                        <div class="order-container__underBlock">
                            <!-- Chatbox -->
                            <div class="orderChat">
                                <div
                                    v-chat-scroll
                                    class="orderChat__history"
                                    :class="{ 'orderChat__history--expanded': historyIsExpanded }"
                                >
                                    <span
                                        v-for="activity in orderActivityById(order.id)"
                                        :key="activity.integerDatetime"
                                    >
                                        <app-comment
                                            v-if="activity.hasOwnProperty('comment') && isReadAuthorized(activity.isAdmin)"
                                            :is-admin="activity.isAdmin"
                                            :comment="activity"
                                            :show-menu="users.activeUser.employeeNumber == activity.employee.employeeNumber"
                                            @delete-comment="removeComment"
                                        />
                                        <order-activity
                                            v-if="activity.hasOwnProperty('note')"
                                            :activity="activity"
                                        />
                                    </span>
                                </div>
                                <ValidationProvider
                                    ref="commentInput"
                                    name="comment"
                                    mode="passive"
                                    rules="required"
                                    v-slot="{ errors }"
                                >
                                    <ckeditor
                                        v-model="comment"
                                        :editor="editor"
                                        :config="ckEditorConfig"
                                        class="orderChat__commentBox"
                                        @ready="onEditorReady"
                                    />
                                    <span class="errorMessage commentbox-error">
                                        {{ errors[0] ? "Text or an image is required." : "" }}
                                    </span>
                                </ValidationProvider>

                                <!-- Chat Controls -->
                                <div class="controlBox">
                                    <img
                                        class="expandIcon"
                                        src="@/assets/images/expandHistory_icon.png"
                                        @click="toggleChatHeight"
                                    />

                                    <div class="controlBox__controls">
                                        <app-button
                                            classes="btn btn-blue"
                                            text="Comment"
                                            @click.native="postComment(activeUser, order)"
                                        />
                                        <single-file-input
                                            button-text="Upload File"
                                            :show-file-name="false"
                                            @input="postImageComment"
                                        />
                                        <toggle-switch
                                            v-if="userIsAdmin"
                                            label="Admin Only"
                                            :switch-on="commentIsAdmin"
                                            class="adminSwitch"
                                            @change="toggleAdminComment"
                                        />
                                    </div>

                                    <!-- Followers -->
                                    <div
                                        v-if="order.product.isDownload == 0"
                                        class="controlBox__followers"
                                    >
                                        <label>Followers:</label>
                                        <div
                                            v-for="follower in order.followers"
                                            :key="follower.fullName"
                                            class="follower"
                                        >
                                            <span class="tooltip">{{ follower.fullName }}</span>
                                            <app-avatar
                                                :src="buildAvatarUrl(follower.email, '100', 'ShortcutIcon')"
                                                alt="Picture of follower"
                                                :size="windowWidth < 420 ? 'small' : 'large'"
                                            />
                                        </div>
                                        <div class="follower">
                                            <div class="tooltip --followControl">
                                                <span>
                                                    {{ isFollowing ? "Stop Following" : "Follow order" }}
                                                </span>
                                            </div>
                                            <div
                                                v-if="!isFollowing"
                                                class="addFollowerBtn"
                                                @click="addFollower"
                                            >
                                                <i class="fas fa-plus" />
                                            </div>
                                            <div
                                                v-else
                                                class="removeFollowerBtn"
                                                @click="removeFollower"
                                            >
                                                <i class="fas fa-minus" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <div
                v-else
                class="loading-container"
            >
                <loading-dots loading-text="Loading order details" />
            </div>
        </transition>

    </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import moment from "moment";
// components (statically loaded)
import InlineEditor from "ruoff-ckeditor5-custom-inline/build/ckeditor";
// mixins
import {
    format,
    parse,
    avatars,
    orderUtility,
    buildNotification,
} from "@/mixins";
import { mixin as clickaway } from "vue-clickaway";

export default {
    name: "orderDetail",
    mixins: [
        format,
        parse,
        avatars,
        clickaway,
        orderUtility,
        buildNotification,
    ],
    components: {
        carousel: () => import("@/components/Shared/Carousel"),
        "app-comment": () => import("@/components/Shared/AppComment"),
        "single-file-input": () =>
            import("@/components/Shared/Inputs/SingleFileInput"),
        "toggle-switch": () =>
            import("@/components/Shared/Inputs/ToggleSwitch"),
        "multi-select": () => import("vue-multiselect"),
        "date-time-picker": () => import("vue-ctk-date-time-picker"),
        "order-activity": () => import("@/components/OrdersPage/OrderActivity"),
        "app-button": () => import("@/components/Shared/AppButton"),
        "revision-comment-box": () =>
            import("@/components/OrdersPage/RevisionCommentBox"),
        "app-avatar": () => import("@/components/Shared/AppAvatar"),
        "app-tooltip": () => import("@/components/Shared/AppTooltip"),
        "file-menu": () => import("@/components/OrdersPage/FileMenu"),
        "guidance-tip": () => import("@/components/Shared/GuidanceTip"),
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
    },
    data() {
        return {
            localOrder: {
                deliverables: [],
                dueDate: null,
            },
            minDate: moment().format("YYYY-MM-DD"),
            statusDropdownShowing: false,
            assignmentDropdownShowing: false,
            revisionBoxShowing: false,
            newStatus: null,
            assignedAvatar: "",
            editor: InlineEditor,
            reopenComment: "",
            historyIsExpanded: false,
            activeEditIcon: null,
            ckEditorConfig: {
                toolbar: [
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "fontColor",
                    "fontSize",
                    "|",
                    "link",
                ],
                fontColor: {
                    colors: [
                        {
                            color: "#16af8c",
                        },
                        {
                            color: "#026957",
                        },
                        {
                            color: "#142f42",
                        },
                        {
                            color: "#f38e36",
                        },
                        {
                            color: "#00485c",
                        },
                    ],
                },
                fontSize: {
                    options: [10, 14, 16, "default", 20, 22, 26],
                },
                placeholder: "Type your message...",
            },
            deliverableMenuOpen: false,
            showGuidanceTip: true,
            windowWidth: window.innerWidth,
        };
    },
    computed: {
        ...mapGetters([
            "orderById",
            "orderIndexById",
            "commentIndexById",
            "deliverableIndexById",
            "userByEmployeeNumber",
            "allMarketingEmployees",
            "orderActivityById",
        ]),
        ...mapState(["orders", "auth", "users"]),
        finalDeliverables() {
            try {
                const finals = this.order.deliverables.filter(
                    (del) => del.status == "final"
                );
                return finals;
            } catch (err) {
                return [];
            }
        },
        assignedToAvatar() {
            const email =
                this.order.assignedTo.email == null
                    ? ""
                    : this.order.assignedTo.email;
            return this.buildAvatarUrl(email, "100", "ShortcutIcon");
        },
        isFollowing() {
            return this.order.followers.some(
                (follower) =>
                    follower.employeeNumber == this.activeUser.employeeNumber
            );
        },
        userIsCustomer() {
            return (
                this.activeUser.employeeNumber ==
                    this.order.orderedBy.employeeNumber ||
                this.order.orderedFor.employeeNumber
            );
        },
        activeUser() {
            return this.users.activeUser;
        },
        unreadNotifications() {
            const unreadNotifications = this.activeUser.notifications.filter(
                (notification) => notification.isRead == 0
            );
            return unreadNotifications.length;
        },
        order() {
            try {
                return this.orderById(this.$route.params.orderNumber);
            } catch (err) {
                return undefined;
            }
        },
        orderNeedsCustomerAttention() {
            return (
                this.order.status == "Needs Information" ||
                this.order.status == "Needs Approval"
            );
        },
        guidanceShouldDisplay() {
            return (
                this.userIsAdmin == false && this.orderNeedsCustomerAttention
            );
        },
        guidanceBodyText() {
            if (this.order.status == "Needs Information") {
                return "Provide information by commenting in the order activity feed below.";
            }
            if (this.order.status == "Needs Approval") {
                return "Click on an image in the proofs section below to review proofs for order approval. <br /> If there are no proofs, please review the downloads or refer to the order activity.";
            }
            return "";
        },
        deleteShouldDisplay() {
            if (this.userIsAdmin) {
                if (
                    this.order.status == "Assigned" ||
                    this.order.status == "In Progress" ||
                    this.order.status == "Delayed"
                ) {
                    return true;
                }
            }
            if (this.userIsCustomer) {
                if (
                    this.order.status == "Assigned" ||
                    this.order.status == "Needs Information"
                ) {
                    return true;
                }
            }
            return false;
        },
        ordersAreLoading() {
            return this.orders.areLoading;
        },
        selectedProof: {
            get() {
                try {
                    return this.order.deliverables.find(
                        (proof) => proof.id === this.selectedId
                    );
                } catch (err) {
                    return undefined;
                }
            },
            set(value) {
                return value;
            },
        },
        proofs() {
            try {
                return this.order.deliverables.filter(
                    (del) => del.status !== "final" && del.status !== "uploaded"
                );
            } catch (err) {
                return undefined;
            }
        },
        allProofsApproved() {
            const approvedProofs = this.proofs.filter(
                (del) => del.status == "approved"
            );
            return approvedProofs.length == this.proofs.length;
        },
    },
    watch: {
        activeUser() {
            this.clearOrderNotifications();
        },
        ordersAreLoading(loading) {
            if (!loading) {
                this.updateOrder(this.$route.params.orderNumber);
            }
        },
    },
    methods: {
        ...mapActions([
            "updateOrderStatus",
            "createComment",
            "createOrderActivity",
            "deleteComment",
            "deleteDeliverable",
            "manageDeliverable",
            "replaceDeliverable",
            "updateOrder",
            "fetchOrders",
            "updateAssignee",
            "updateDueDate",
            "deleteOrder",
            "fetchMarketingEmployees",
            "downloadDeliverable",
            "addOrderFollower",
            "removeOrderFollower",
            "createNotification",
            "postNotification",
            "updateNotifications",
        ]),
        ...mapMutations([
            "CREATE_COMMENT",
            "DELETE_COMMENT",
            "UPDATE_ORDER_STATUS",
            "CREATE_ORDER_ACTIVITY",
            "UPDATE_ASSIGNEE",
            "UPDATE_DUE_DATE",
            "CREATE_DELIVERABLE",
            "UPDATE_DELIVERABLE",
            "DELETE_DELIVERABLE",
            "ADD_FOLLOWER",
        ]),
        addFollower() {
            const { activeUser } = this.users;
            if (!this.isFollowing) {
                const followerObj = {
                    fullName: activeUser.fullName,
                    email: activeUser.email,
                    employeeNumber: activeUser.employeeNumber,
                };
                this.addOrderFollower({
                    orderId: this.order.id,
                    follower: followerObj,
                });
            } else {
                // already following the order
            }
        },
        assigneeSelected(newAssignee) {
            this.assignmentDropdownShowing = false;
            this.changeAssignedTo(this.activeUser, this.order, newAssignee);
        },
        clearOrderNotifications() {
            /*- check if user has unread notifications for this order
             * and clear them and post the change if true
             *
             */
            if (this.unreadNotifications > 0) {
                const notificationIds = [];
                this.activeUser.notifications.forEach((notification) => {
                    if (notification.destinationUrl == this.$route.path) {
                        notificationIds.push(notification.id);
                    }
                });
                this.updateNotifications({
                    notificationIds,
                    isRead: 1,
                    employeeNumber: this.activeUser.employeeNumber,
                });
            }
        },
        closeAssignmentDropdown() {
            this.assignmentDropdownShowing = false;
        },
        closeDeliverableMenu() {
            this.activeEditIcon = null;
            this.deliverableMenuOpen = false;
        },
        closeStatusDropdown() {
            this.statusDropdownShowing = false;
        },
        async deliverablesFilesUploaded(e) {
            let droppedFiles;
            // collect dropped images and create an object to push into local product images state
            if (e.dataTransfer) {
                droppedFiles = e.dataTransfer.files;
            } else {
                droppedFiles = e.target.files;
            }

            if (!droppedFiles) return; // if we dont have files at this point, get out

            // convert FileList to array
            [...droppedFiles].forEach((file) => {
                // create deliverable
                const delObj = {
                    id: null,
                    createdDatetime: moment().toISOString(),
                    status: "uploaded",
                    filepath: "",
                    file,
                    versions: [],
                };

                const reader = new FileReader();
                reader.onload = (fileEvent) => {
                    // the result image data
                    delObj.filepath = fileEvent.target.result;
                    if (
                        !this.order.deliverables.some(
                            (del) => del.filepath == delObj.filepath
                        )
                    ) {
                        // wrap the deliverable in form post for back end
                        const formData = new FormData();
                        formData.append("orderId", this.order.id);
                        Object.keys(delObj).forEach((key) => {
                            if (key != "filepath") {
                                // filepath not needed by back end (large base64 string)
                                formData.append(key, delObj[key]);
                            }
                        });
                        this.manageDeliverable({
                            orderId: this.order.id,
                            deliverable: delObj,
                            data: formData,
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        },
        async downloadAllDeliverables() {
            this.finalDeliverables.forEach((final) => {
                const imageIndex = final.assets.findIndex(
                    (image) => image.type == "raw"
                );
                this.onDownloadDeliverable(final.assets[imageIndex].filepath);
            });
        },
        forceFileDownload(response) {
            // argument is the file blob from fetch - create a link to trigger download then remove
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", response.config.url.split("/").pop()); // or any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        getRawImageIndex(deliverable) {
            const index = deliverable.assets.findIndex(
                (asset) => asset.type == "raw"
            );
            return index;
        },
        goToUserIfAdmin(employeeNumber) {
            if (this.userIsAdmin) {
                window.open(
                    `/admin/user-management/edit-user/${employeeNumber}`
                );
            }
        },
        goToProofDisplay(selected) {
            this.$router.push(`/orders/${this.order.id}/proofs/${selected.id}`);
        },
        isReadAuthorized(authRequired) {
            if (authRequired == 1) {
                return this.userIsAdmin;
            }
            return true;
        },
        async onDeleteOrder() {
            await this.deleteOrder(this.order.id);
            this.$router.push("/orders");
        },
        async onDownloadDeliverable(url) {
            const response = await this.downloadDeliverable(url);
            this.forceFileDownload(response);
        },
        onEditorReady(editor) {
            editor.editing.view.focus();
        },
        onResize() {
            this.windowWidth = window.innerWidth;
        },
        onReplaceDeliverable(e) {
            this.deliverableMenuOpen = false;
            const formData = new FormData();
            formData.append("id", this.selectedProof.id);
            formData.append("status", "underReview");
            formData.append("file", e.target.files[0]);
            this.replaceDeliverable({
                orderId: this.order.id,
                deliverable: this.selectedProof,
                data: formData,
            });
            this.changeOrderStatus(
                this.activeUser,
                this.order,
                "Needs Approval"
            );
        },
        openDeliverableMenu(deliverable) {
            this.activeEditIcon = deliverable.id;
            this.selectedId = deliverable.id;
            this.deliverableMenuOpen = true;
        },
        async postImageComment(image) {
            const commentObj = {
                id: null,
                employee: {
                    employeeNumber: this.activeUser.employeeNumber,
                    email: this.activeUser.email,
                    fullName: this.activeUser.fullName,
                },
                comment: this.comment,
                isAdmin: this.commentIsAdmin ? 1 : 0,
                datetime: null,
                filepath: null,
                ideaId: null,
                filename: image.name,
            };
            const reader = new FileReader();
            reader.onload = async (fileEvent) => {
                // the result image data
                commentObj.filepath = fileEvent.target.result;

                const { response, orderId } = await this.createComment({
                    orderId: this.order.id,
                    comment: commentObj,
                });
                if (response.status == "200") {
                    if (this.$socket) {
                        this.$socket.emit("manageComment", {
                            orderId,
                            comment: response.data,
                        });
                    }
                }
                this.comment = "";
            };
            reader.readAsDataURL(image);
        },
        async removeComment(commentId) {
            const { response, orderId } = await this.deleteComment({
                orderId: this.order.id,
                commentId,
            });
            if (response.status == "200") {
                if (this.$socket) {
                    this.$socket.emit("deleteComment", {
                        orderId,
                        commentId,
                    });
                }
            }
        },
        async removeDeliverable() {
            const { response, orderId } = await this.deleteDeliverable({
                orderId: this.order.id,
                deliverableId: this.selectedProof.id,
            });
            if (response.status == "200") {
                if (this.$socket) {
                    this.$socket.emit("deleteDeliverable", {
                        orderId,
                        deliverableId: this.selectedProof.id,
                    });
                }
            }
            this.closeDeliverableMenu();
        },
        removeFollower() {
            this.removeOrderFollower({
                orderId: this.order.id,
                employeeNumber: this.activeUser.employeeNumber,
            });
        },
        async reopenOrder() {
            this.revisionBoxShowing = false;

            const comment = {
                id: null,
                employee: {
                    employeeNumber: this.activeUser.employeeNumber,
                },
                comment: `<span style="color:#f38e36;">[REVISION]&nbsp;</span>${this.reopenComment}`,
                isAdmin: 0,
                datetime: null,
                filepath: null,
                filename: null,
                ideaId: null,
            };

            const { response, orderId } = await this.createComment({
                orderId: this.order.id,
                comment,
            });
            if (response.status == "200") {
                if (this.$socket) {
                    this.$socket.emit("manageComment", {
                        orderId,
                        comment: response.data,
                    });
                }
            }
            this.reopenComment = "";
            this.changeOrderStatus(
                this.activeUser,
                this.order,
                "Needs Revision"
            );
        },
        toggleAdminComment() {
            this.commentIsAdmin = !this.commentIsAdmin;
        },
        toggleChatHeight() {
            this.historyIsExpanded = !this.historyIsExpanded;
        },
    },
    sockets: {
        manageComment(data) {
            const { orderId, comment } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                this.CREATE_COMMENT({ orderIndex, comment });
            }
        },
        deleteComment(data) {
            const { orderId, commentId } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                const commentIndex = this.commentIndexById(
                    orderIndex,
                    commentId
                );
                if (commentIndex !== -1) {
                    this.DELETE_COMMENT({ orderIndex, commentIndex });
                }
            }
        },
        updateAssignee(data) {
            const { orderId, newAssignee, assignmentChange } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                this.UPDATE_ASSIGNEE({ orderIndex, newAssignee });
                this.CREATE_ORDER_ACTIVITY({
                    orderIndex,
                    activity: assignmentChange,
                });
            }
        },
        updateDueDate(data) {
            const { orderId, newDueDate, dueDateChange } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                this.UPDATE_DUE_DATE({ orderIndex, newDueDate });
                this.CREATE_ORDER_ACTIVITY({
                    orderIndex,
                    activity: dueDateChange,
                });
            }
        },
        createOrderActivity(data) {
            const { orderId, activity } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                this.CREATE_ORDER_ACTIVITY({ orderIndex, activity });
            }
        },
        updateDeliverableStatus(data) {
            const { orderId, deliverable } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                const deliverableIndex = this.deliverableIndexById(
                    orderIndex,
                    deliverable.id
                );
                if (deliverableIndex !== -1) {
                    this.UPDATE_DELIVERABLE({
                        orderIndex,
                        deliverableIndex,
                        deliverable,
                    });
                }
            }
        },
        deleteDeliverable(data) {
            const { orderId, deliverableId } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                const deliverableIndex = this.deliverableIndexById(
                    orderIndex,
                    deliverableId
                );
                if (deliverableIndex !== -1) {
                    this.DELETE_DELIVERABLE({ orderIndex, deliverableIndex });
                }
            }
        },
        updateOrderStatus(data) {
            const { orderId, newStatus, statusChange } = data;
            const orderIndex = this.orderIndexById(orderId);
            if (orderIndex !== -1) {
                this.UPDATE_ORDER_STATUS({ orderIndex, newStatus });
                this.CREATE_ORDER_ACTIVITY({
                    orderIndex,
                    activity: statusChange,
                });
            }
        },
    },
    async created() {
        // make sure order exists before rendering, if it doesnt redirect to 404
        if (!this.ordersAreLoading) {
            const response = await this.updateOrder(
                this.$route.params.orderNumber
            );
            if (response.length == 0) {
                this.$router.push("/404");
            }
        }
        // bring marketing employee data
        this.fetchMarketingEmployees();
        // check for notifications on this order and clear them if they exist
        if (this.activeUser.notifications) {
            this.clearOrderNotifications();
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", this.onResize);
        });
    },
};
</script>

<style lang="scss" scoped>
.order-container,
.loading-container {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 85%;
    margin: 4rem auto 0;
    padding: $standard-view;
    @include breakpoint(wide) {
        width: 100%;
        padding: 4rem 4rem 10rem;
    }
    @include breakpoint(tablet-port) {
        padding: 4rem 2rem 10rem;
    }
    &__leftBlock {
        max-width: 50%;
        margin-bottom: 3rem;
        @include breakpoint(tablet-land) {
            max-width: 100%;
        }
    }
    &__rightBlock {
        margin-bottom: 2rem;
        min-width: 40rem;
        @include breakpoint(tablet-port) {
            min-width: unset;
            width: 100%;
        }
    }
    &__underBlock {
        width: 100%;
    }
}
.loading-container {
    padding: 0;
}

h3 {
    &.label {
        position: relative;
        display: inline-block;
        font-weight: 600;
        margin-right: 0.5rem;
        color: #000;
        font-size: 1.2em;
    }
    &.activity-label {
        margin-bottom: 1rem;
    }
}

.header {
    height: 53px;
    &__orderName {
        display: inline-block;
        flex-grow: 1;
        font-size: 1.5em;
        color: $teal-light;
        text-transform: uppercase;
        transition: 0.3s ease, color 0.3s ease;
        font-weight: 800;
        &:hover {
            color: $orange;
        }
    }
    &__category {
        color: $gray;
        font-size: 2rem;
        font-weight: 800;
    }
}

.controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3rem;
    .status-block {
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        align-self: center;
        width: 24rem;
        cursor: pointer;
        label {
            font-weight: 700;
            margin-right: 0.5rem;
            margin-bottom: 0;
        }
        .toggleIcon {
            margin-left: 0.5rem;
        }
        &__dropdown {
            position: absolute;
            top: 4rem;
            right: 0;
            z-index: 10;
            width: 20rem;
            background-color: #fff;
            padding: 1rem;
            box-shadow: $dropdownShadow;
            .status {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 1.5rem;
                border-radius: 3px;
                text-align: left;
                cursor: pointer;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        .status {
            font-size: 14px;
        }
    }
    .deleteBtn {
        padding: 0.35rem 1.5rem 0.35rem;
        font-size: 14px;
        font-weight: 700;
        font-family: 'Nunito Sans', sans-serif;
    }
}

.deliverables-block {
    position: relative;
    width: 100%;
    &:last-of-type {
        margin-top: 3rem;
    }
    h3 {
        position: relative;
        display: inline-block;
        margin-bottom: 0.5rem;
        font-weight: 800;
    }
    a,
    p {
        display: block;
        z-index: 1;
        &.deprecated {
            color: $orange;
        }
        &.final,
        &.approved {
            color: $approved;
        }
        &.uploaded {
            color: $gray;
        }
    }
    .downloadControls {
        position: relative;
        display: flex;
        justify-content: flex-end;
        margin-top: 2rem;
        button:last-child {
            margin-left: 2rem;
        }
        .revisionBox-container {
            position: absolute;
            right: 16rem;
            top: 0;
            z-index: 10;
            min-width: 30rem;
            background-color: #fff;
            box-shadow: $dropdownShadow;
            /deep/ label {
                color: #333;
            }
        }
    }
    .deliverables-container {
        position: relative;
        border: 1px solid $gray-light;
        height: 162px;
        overflow-y: auto;
        max-width: 40rem;
        .deliverable {
            display: flex;
            margin: 1rem 0 1rem 1rem;
            font-size: 14px;
            p,
            a {
                cursor: pointer;
                text-decoration: underline;
            }

            .editDeliverable {
                color: $gray-light;
                margin-right: 0.5rem;
                font-size: 15px;
                z-index: 1;
                cursor: pointer;
                &.active {
                    color: $teal-light;
                }
            }
        }
        .dragDrop {
            position: absolute;
            height: 100%;
            opacity: 0;
        }
    }
    ::v-deep .download {
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
}

.assignment {
    display: flex;
    margin-top: 2rem;
    @include breakpoint(mobile) {
        flex-wrap: wrap;
    }
    &__left {
        display: flex;
        align-items: center;
        cursor: pointer;
        div.assignedTo {
            position: relative;
            display: flex;
            flex-direction: column;
            margin-left: 1rem;
            label {
                color: $gray;
                font-weight: 700;
                cursor: pointer;
            }
            .assignee {
                color: $orange;
                font-weight: 700;
            }
            .multiselect-wrapper {
                height: 3.6rem;
                position: absolute;
                bottom: -4rem;
                width: 20rem;
            }
        }
    }
    &__right {
        display: flex;
        align-items: center;
        margin-left: 4rem;
        @include breakpoint(mobile) {
            width: 100%;
            margin: 3rem 0 0 0;
        }
        label {
            position: relative;
        }
        .dueDate {
            display: flex;
            flex-direction: column;
            margin-left: 1rem;
            label {
                color: $gray;
                font-weight: 700;
            }
            .pickerTrigger {
                display: block;
                font-weight: 700;
                background-color: transparent;
                border: none;
                outline: none;
                padding: 0;
                font-size: 1.6rem;
                font-family: 'Nunito Sans', sans-serif;
                cursor: pointer;
            }
        }
        ::v-deep .datepicker {
            top: 0.75rem !important;
        }
    }
}

.orderInfo {
    margin-top: 3rem;
    .group,
    .flex-group {
        margin-bottom: 1.5rem;
        label {
            margin-right: 0.5rem;
            font-weight: 700;
        }
    }
    .flex-group {
        display: flex;
        flex-wrap: wrap;
    }
    .submittedDetails {
        margin: 2rem 0;
        .details-label {
            font-weight: 700;
        }
        .flex-group {
            margin-bottom: 1.5rem;
            &:first-of-type {
                margin-top: 1.5rem;
            }
            .value {
                font-size: 1.4rem;
                color: $gray;
                font-weight: 600;
            }
            a.value {
                color: $linkBlue;
                max-width: 60%;
                overflow-x: auto;
                margin-left: 0.5rem;
            }
        }
    }
    &__value {
        font-size: 14px;
        font-weight: 600;
        color: $gray;
    }
    .orderedFor {
        transition: 0.3s ease-in-out, color 0.3s ease-in-out;
        &:hover {
            text-shadow: 0 0 0.65px $orange, 0 0 0.65px $orange;
            color: $orange;
        }
    }

    &__deliverables {
        margin-top: 2rem;
        width: 40rem;
        @include breakpoint(mobile) {
            width: 100%;
        }
        label {
            display: block;
            color: #000;
            font-size: 1.2em;
            font-weight: 700;
        }
        span {
            display: block;
            margin-top: 1.5rem;
            color: $gray;
            font-weight: 600;
        }
    }
    .deliverables-label {
        font-weight: 700;
    }
}

.belowFold {
    position: relative;
    margin-top: 2rem;
    width: 100%;
    .activity-label {
        font-weight: 700;
    }
}

.orderChat {
    &__history {
        height: 25rem;
        padding: 1rem;
        overflow-y: auto;
        border: 1px solid $gray-light;
        color: unset;
        text-decoration: none;
        scrollbar-color: #a7a7a7 #f1f1f1;
        scrollbar-width: thin;
        -ms-overflow-style: auto;
        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            background: #ffffff;
        }
        &::-webkit-scrollbar-thumb {
            background-color: $gray-light;
            border-radius: 10px;
            border: 1px solid $gray;
        }
        &--expanded {
            height: 100%;
        }
    }
    &__commentBox {
        min-height: 6rem;
        border: none;
        border: 1px solid $gray-light !important;
        max-width: 100%;
        min-width: 100%;
        margin-top: 4.1rem;
    }
    .assignmentStmt {
        display: block;
        color: $gray;
        font-size: 1.4rem;
        font-weight: 500;
        margin-bottom: 1.75rem;
    }
    .controlBox {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 2rem 0;
        .expandIcon {
            position: absolute;
            right: 1rem;
            top: -12rem;
            cursor: pointer;
        }

        &__controls {
            display: flex;
            align-items: flex-start;
            margin-bottom: 3rem;
            button {
                margin-right: 2rem;
                font-family: 'Nunito Sans', sans-serif;
                font-weight: 700;
            }
            .adminSwitch {
                margin-left: 2rem;
            }
        }
        ::v-deep button {
            font-family: 'Nunito Sans', sans-serif;
            font-weight: 700;
        }

        &__followers {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            label {
                color: $gray;
                margin-bottom: 0;
            }
            .addFollowerBtn,
            .removeFollowerBtn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 3rem;
                height: 3rem;
                text-align: center;
                color: $gray;
                border-radius: 50%;
                border: 2px solid lightgray;
                cursor: pointer;
                transition: color 0.3s, background-color 0.3s, border 0.3s;
                &:hover {
                    background-color: $teal-light;
                    color: #fff;
                }
            }
            .follower {
                position: relative;
                margin-left: 1rem;

                .tooltip {
                    display: none;
                    position: absolute;
                    top: -4rem;
                    left: 0;
                    padding: 0.5rem 1rem;
                    color: #fff;
                    background-color: $gray-dark;
                    border-radius: 5px;
                    white-space: nowrap;
                    &.--followControl {
                        left: 1.5rem;
                        margin-left: 100%;
                        top: 0.3rem;
                    }
                }
                &:hover .tooltip {
                    display: inline-block;
                }
            }
        }
    }
}

/deep/ .upload-wrapper button {
    padding: 0.5rem 2rem !important;
}

// transitions
@include slideDownEnter("fileMenu", 0.3rem, 4rem);

@include slideDownEnter("orderStatus", 2rem, 4rem);
</style>
