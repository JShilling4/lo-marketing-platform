<template>
    <div
        v-if="selectedProof"
        class="deliverables"
    >
        <div class="header">
            <!-- File info -->
            <div class="header__fileInfo">
                <span
                    v-if="rawImage"
                    class="fileName"
                >{{ rawImage.filepath.split("/").pop() }}</span>
                <span class="fileDate">{{
          formatDate(selectedProof.createdDatetime, "MMM D, YYYY [at] hh:mm a")
        }}</span>

                <!-- Versions box -->
                <div
                    v-if="selectedProof.versions.length > 0"
                    class="versionContainer"
                >
                    <div
                        class="label tooltipLabel"
                        @click="showVersions = !showVersions"
                    >
                        <app-tooltip tip-text="These are past versions of the proof currently in the viewer. Click on a version box to view in a new tab." />
                        Archived Proofs <i class="fas fa-caret-down"></i>
                    </div>
                    <ul
                        v-if="showVersions"
                        v-on-clickaway="closeVersions"
                    >
                        <li
                            v-for="(version, index) in sortedVersionList"
                            :key="version.id"
                            class="version"
                        >
                            <a
                                :href="version.filepath"
                                target="_blank"
                                class="versionLink"
                            >
                                <div class="versionNum">{{ `Version ${index + 1}` }}</div>
                                <div class="datetime">
                                    {{ formatDate(version.datetime, "MMM D, YYYY [at] hh:mm a") }}
                                </div>
                                <div class="filename">{{ version.filepath.split("/").pop() }}</div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Controls -->
            <div class="header__controls">
                <app-button
                    v-if="selectedProof.status == 'deprecated' || selectedProof.status == 'underReview'"
                    class="btn approve"
                    @click.native="approveProof"
                    text="Approve"
                />
                <app-button
                    class="btn revise"
                    @click.native="commentBoxShowing = !commentBoxShowing"
                    text="Revise"
                />
                <app-button
                    class="btn btn-white close"
                    text="Go to Order"
                    @click.native="$router.push(`/orders/${order.id}`)"
                />
            </div>
        </div>

        <!-- Revision comment box -->
        <transition name="reviseBox">
            <div
                v-if="commentBoxShowing"
                class="revisionBox-container"
            >
                <revision-comment-box
                    v-model="comment"
                    @close="commentBoxShowing = false"
                    @add-revision-comment="buildRevisionComment"
                />
            </div>
        </transition>

        <!-- Proof status notification -->
        <div class="fileStatus-container">
            <span
                class="fileStatus"
                :class="{
          '--revision': selectedProof.status == 'deprecated',
          '--underReview': selectedProof.status == 'underReview',
          '--approved': selectedProof.status == 'approved' || selectedProof.status == 'final'
        }"
            >
                {{ fileStatusMessage }}
            </span>
        </div>

        <div class="deliverables__viewingArea">
            <!-- Main Preview -->
            <a
                :href="previewImage.filepath"
                target="_blank"
                class="mainImage-container"
            >
                <img
                    :src="proofImage.filepath"
                    :class="{
            '--final': selectedProof.status == 'final',
            '--approved': selectedProof.status == 'approved',
            '--revision': selectedProof.status == 'deprecated'
          }"
                />
            </a>
        </div>

        <carousel
            class="thumbs"
            :deliverables="proofs"
            @slide-clicked="reportSelectedProof"
            :show-proof-info="false"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
// mixins
import { format, parse, orderUtility, buildNotification } from "@/mixins";
import { mixin as clickaway } from "vue-clickaway";

export default {
    name: "ProofDisplay",
    mixins: [format, parse, clickaway, orderUtility, buildNotification],
    components: {
        carousel: () => import("@/components/Shared/Carousel"),
        "revision-comment-box": () =>
            import("@/components/OrdersPage/RevisionCommentBox"),
        "app-button": () => import("@/components/Shared/AppButton"),
        "app-tooltip": () => import("@/components/Shared/AppTooltip"),
    },
    data() {
        return {
            comment: "",
            commentBoxShowing: false,
            showVersions: false,
        };
    },

    computed: {
        ...mapState(["orders", "users"]),
        ...mapGetters(["orderById", "orderIndexById", "deliverableIndexById"]),
        activeUser() {
            return this.users.activeUser;
        },
        order() {
            try {
                return this.orderById(this.$route.params.orderNumber);
            } catch (err) {
                return undefined;
            }
        },
        rawImage() {
            try {
                return this.selectedProof.assets.find(
                    (image) => image.type == "raw"
                );
            } catch (err) {
                return undefined;
            }
        },
        proofImage() {
            const proofImage = this.selectedProof.assets.find(
                (image) => image.type == "proof"
            );
            if (proofImage) {
                return proofImage;
            }
            return this.selectedProof.assets.find(
                (image) => image.type == "raw"
            );
        },
        previewImage() {
            const previewImage = this.selectedProof.assets.find(
                (image) => image.type == "preview"
            );
            if (previewImage) {
                return previewImage;
            }
            return this.selectedProof.assets.find(
                (image) => image.type == "raw"
            );
        },
        sortedVersionList() {
            const list = [...this.selectedProof.versions];
            return list.sort((a, b) => (a.datetime > b.datetime ? 1 : -1));
        },
        fileStatusMessage() {
            switch (this.selectedProof.status) {
                case "approved": {
                    return "This proof has been approved.";
                }
                case "deprecated": {
                    return `${
                        this.orderById(this.order.id).assignedTo.fullName
                    } is working on your revision request for this proof.`;
                }
                case "underReview": {
                    return "This proof is waiting for your approval.";
                }
                default: {
                    return 0;
                }
            }
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
        proofs() {
            if (this.proofs.length < 1) {
                this.$router.push(`/orders/${this.order.id}`);
            }
        },
        selectedProof(proof) {
            if (proof.status == "uploaded" || proof.status == "final") {
                this.selectExistingProof();
            }
        },
    },

    methods: {
        ...mapActions([
            "manageDeliverable",
            "updateOrder",
            "createOrderActivity",
            "updateOrderStatus",
            "postNotification",
            "createNotification",
            "createComment",
        ]),
        ...mapMutations(["UPDATE_ORDER_STATUS", "UPDATE_DELIVERABLE"]),
        buildRevisionComment() {
            const revisionComment = `<span><span style="color:#f38e36;">[REVISION] (${this.selectedProof.assets[0].filepath
                .split("/")
                .pop()})&nbsp; </span>${this.comment} </span>`;
            this.revisionCommentAdded(revisionComment);
            this.commentBoxShowing = false;
        },
        async revisionCommentAdded(revisionComment) {
            this.comment = revisionComment;
            this.editDeliverableStatus(
                this.activeUser,
                this.order,
                "deprecated"
            );
            this.postComment(this.activeUser, this.order, false);
            this.changeOrderStatus(
                this.activeUser,
                this.order,
                "Needs Revision"
            );
        },
        closeVersions() {
            this.showVersions = false;
        },
        approveProof() {
            this.editDeliverableStatus(this.activeUser, this.order, "approved");
        },
        reportSelectedProof(selectedProof) {
            this.selectedId = selectedProof.id;
            this.$router.push(
                `/orders/${this.order.id}/proofs/${this.selectedId}`
            );
        },
        selectExistingProof() {
            if (this.proofs.length > 0) {
                const [selected] = this.proofs;
                this.selectedId = selected.id;
                this.$router.replace(
                    `/orders/${this.order.id}/proofs/${this.selectedId}`
                );
            } else {
                this.$router.push(`/orders/${this.order.id}`);
            }
        },
    },

    sockets: {
        updateAssignee(data) {
            const { orderId, newAssignee, assignmentChange } = data;
            const orderIndex = this.orderIndexById(orderId);
            this.UPDATE_ASSIGNEE({ orderIndex, newAssignee });
            this.CREATE_ORDER_ACTIVITY({
                orderIndex,
                activity: assignmentChange,
            });
        },
        updateOrderStatus(data) {
            const { orderId, newStatus } = data;
            const orderIndex = this.orderIndexById(orderId);
            this.UPDATE_ORDER_STATUS({ orderIndex, newStatus });
        },
        updateDeliverableStatus(data) {
            const { orderId, deliverable } = data;
            const orderIndex = this.orderIndexById(orderId);
            const deliverableIndex = this.deliverableIndexById(
                orderIndex,
                deliverable.id
            );
            this.UPDATE_DELIVERABLE({
                orderIndex,
                deliverableIndex,
                deliverable,
            });
        },
    },
    async created() {
        if (!this.orderById(this.$route.params.orderNumber)) {
            // make sure order exists before rendering, if it doesnt redirect to 404
            const response = await this.updateOrder(
                this.$route.params.orderNumber
            );
            if (response.length == 0) {
                this.$router.push("/404");
            }
        }

        const selected = this.proofs.find(
            (deliverable) => deliverable.id == this.$route.params.proofId
        );
        if (selected) {
            this.selectedId = selected.id;
        }
        // check the proof slug (or lack thereof)
        if (!selected) {
            this.selectExistingProof();
        }
    },
};
</script>

<style lang="scss" scoped>
.deliverables {
    min-height: 100vh;
    background: #525252;
    padding: 3rem 10rem 0;
    @include breakpoint(laptop) {
        padding: 3rem 6rem 0;
    }
    @include breakpoint(tablet-land) {
        padding: 2rem 2rem 0;
    }
    .header {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // border-bottom: 1px solid #fff;
        margin-bottom: 10px;
        @include breakpoint(tablet-land) {
            align-items: flex-start;
        }
        &__fileInfo {
            display: flex;
            flex-direction: column;
            @include breakpoint(laptop) {
                width: 70%;
            }
            @include breakpoint(mobile) {
                width: 60%;
                min-width: 16rem;
            }
            .fileName {
                color: $orange;
                @include breakpoint(laptop) {
                    flex-wrap: wrap;
                }
                @include breakpoint(tablet-land) {
                    padding-top: 12px;
                    font-size: 12px;
                }
            }
            .fileDate {
                margin: 0.5rem 0 2rem;
                color: #fff;
                @include breakpoint(tablet-land) {
                    font-size: 12px;
                }
            }
            .versionContainer {
                position: relative;
                left: 2rem;
                z-index: 999;
                ul {
                    position: absolute;
                    max-height: 55rem;
                    min-width: 22rem;
                    padding-right: 1rem;
                    overflow-y: auto;
                    scrollbar-color: #a7a7a7 #f1f1f1;
                    scrollbar-width: thin;
                    &::-webkit-scrollbar {
                        width: 8px;
                    }
                    &::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    &::-webkit-scrollbar-thumb {
                        background-color: $gray-light;
                        border-radius: 10px;
                        border: 1px solid $gray;
                    }
                }
                .label {
                    display: flex;
                    color: $gray-light;
                    margin-bottom: 1rem;
                    cursor: pointer;
                    .fas {
                        margin-left: 0.5rem;
                    }
                }
                .version {
                    border: 1px solid;
                    padding: 0.5rem 1rem;
                    color: $orange;
                    margin-bottom: 1rem;
                    max-width: 22rem;
                    word-break: break-all;
                    background-color: #525252;
                    transition: background-color 0.5s;
                    &:hover {
                        background-color: #626262;
                    }
                    .datetime,
                    .filename {
                        color: #fff;
                        font-size: 13px;
                        margin: 0.5rem 0;
                    }
                }
            }
        }

        &__controls {
            display: flex;
            align-items: center;
            @include breakpoint(tablet-land) {
                flex-wrap: wrap;
                justify-content: flex-end;
            }
            @include breakpoint(mobile) {
            }
            .approve,
            .revise,
            .close {
                margin-left: 1rem;
                padding-left: 0;
                padding-right: 0;
                min-width: 11rem;
                color: #fff;
                font-family: 'Nunito Sans', sans-serif;
                @include breakpoint(mobile) {
                    font-size: 10px;
                }
            }
            .approve {
                border: none;
                background-color: $approvedGreen;
                @include breakpoint(tablet-land) {
                    margin-bottom: 1rem;
                }
            }
            .revise {
                border: none;
                background-color: $orange;
                @include breakpoint(tablet-land) {
                    margin-bottom: 1rem;
                }
                @include breakpoint(tablet-port) {
                }
            }
            .close {
                cursor: pointer;
            }
        }
    }
    .fileStatus-container {
        text-align: center;
        margin: 2rem auto;

        .fileStatus {
            padding: 1rem 2rem;
            background-color: #fff;
            border-radius: 2rem;
            color: #fff;
            @include breakpoint(tablet-port) {
                padding: 1rem 1rem;
                width: 100%;
                text-align: center;
            }
            @include breakpoint(mobile) {
                font-size: 12px;
            }
            &.--revision {
                background-color: $orange;
            }
            &.--approved {
                background-color: $approved;
            }
            &.--underReview {
                color: #333;
            }
        }
    }
    &__viewingArea {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 67vh;
        @include breakpoint(tablet-port) {
            justify-content: flex-start;
            padding-top: 6rem;
            min-height: unset;
        }
    }
    .mainImage-container {
        display: inline-block;
        margin: 0 auto;
        img {
            max-width: 100%;
            max-height: 60rem;
            margin-bottom: 2rem;
            &.--approved {
                border: 4px solid $approved;
            }
            &.--revision {
                border: 4px solid $orange;
            }
        }
    }
    .thumbs {
        max-width: 58rem;
        left: 50%;
        transform: translateX(-50%);
        @include breakpoint(mobile) {
            max-width: 25rem;
        }
    }
    .revisionBox-container {
        position: absolute;
        right: 16rem;
        top: 11rem;
        z-index: 10;
        min-width: 30rem;
        background-color: #fff;
        box-shadow: $dropdownShadow;
        @include breakpoint(tablet-port) {
            right: unset;
            left: 50%;
            transform: translateX(-50%);
        }

        ::v-deep label {
            color: #333;
        }
    }
}

@include slideDownEnter("reviseBox", 6rem, 11rem);
</style>
