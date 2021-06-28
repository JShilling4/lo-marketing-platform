<template>
    <div class="rp-mgmt">
        <h1 class="heading">Referral Partners</h1>

        <div class="flexBlock">
            <div class="flexBlock__right">
                <p>
                    Please use the provided CSV template for uploading a
                    referral partner list.
                </p>
                <a href="/docs/rp-list-template.csv" target="_blank"
                    >Download CSV template</a
                >
            </div>
        </div>
        <div class="utilityBar">
            <!-- Search -->
            <div
                v-if="referralPartners.referralPartners.length > 0"
                class="search"
            >
                <i class="fas fa-search"></i>
                <text-input type="text" v-model="searchQuery" />
            </div>
            <div v-if="userIsLOA" class="LOselect-container">
                <multi-select
                    v-model="selectedLoanOfficers"
                    :multiple="true"
                    track-by="employeeNumber"
                    label="fullName"
                    placeholder="Select Loan Officers"
                    selectLabel=""
                    deselectLabel=""
                    :close-on-select="false"
                    :preserve-search="true"
                    :options="activeUser.assists"
                >
                    <template slot="selection" slot-scope="{ values, isOpen }">
                        <span
                            class="multiselect__single"
                            v-if="values.length && !isOpen"
                        >
                            {{ values.length }} selected
                        </span>
                    </template>
                </multi-select>

                <app-button
                    classes="btn btn-orange"
                    text="Submit"
                    @click.native="fetchReferralPartnerChanges()"
                />
            </div>

            <div class="addButtons-container">
                <app-button
                    classes="btn btn-orange"
                    @click.native="openModal(null)"
                    text="Add Referral Partner"
                />
                <app-button
                    v-if="userIsLOA"
                    classes="btn btn-orange"
                    @click.native="openUploadModal()"
                    text="Upload CSV"
                />
                <div v-else class="csv-upload">
                    <single-file-input
                        buttonText="Upload CSV"
                        @input="
                            addReferralPartnersByCSV({
                                file: $event,
                                loanOfficer: activeUser,
                            })
                        "
                        :show-file-name="false"
                    />
                    <div class="uploadStatus-wrapper">
                        <i
                            class="fas"
                            :class="{
                                'fa-check-circle': uploadStatus == 'Success!',
                                'fa-times': uploadStatus == 'Error!',
                            }"
                        />
                        <span
                            class="uploadStatus"
                            :class="{
                                '--success': uploadStatus == 'Success!',
                                '--error': uploadStatus == 'Error!',
                            }"
                        >
                            {{ uploadStatus }}
                            <span>&nbsp;{{ statusMessage }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <transition v-if="!storeIsLoading" name="fadeInOut" appear>
            <div class="resultsTable">
                <vue-good-table
                    :columns="tableColumns"
                    :rows="referralPartners.referralPartners"
                    :row-style-class="rowStyleClass"
                    styleClass="vgt-table"
                    :search-options="{
                        enabled: true,
                        externalQuery: searchQuery,
                    }"
                    :pagination-options="{
                        enabled: true,
                        mode: 'records',
                    }"
                    :sort-options="{
                        enabled: true,
                        initialSortBy: { field: this.formatName, type: 'asc' },
                    }"
                >
                    <!-- Dynamic table rows -->
                    <template slot="table-row" slot-scope="props">
                        <!-- Is Subscribed -->
                        <span
                            v-if="props.column.field == 'isSubscribed'"
                            :class="isSubscribedColor(props.row)"
                        >
                            {{ props.formattedRow[props.column.field] }}
                            <app-button
                                v-if="props.row.isSubscribed == 1"
                                class="btn --unsubscribe"
                                classes="btn btn-red"
                                text="Unsubscribe"
                                @click.native="unsubscribe(props.row.id)"
                            />
                        </span>
                        <!-- Delete -->
                        <span
                            v-else-if="props.column.field == 'controls'"
                            class="tableControls"
                        >
                            <img
                                src="@/assets/images/edit_icon.png"
                                class="editRP"
                                @click="openModal(props.row.id)"
                            />
                            <i
                                class="fas fa-times-circle deleteRP"
                                @click="onDeleteReferralPartner(props.row.id)"
                            ></i>
                        </span>

                        <span v-else>{{
                            props.formattedRow[props.column.field]
                        }}</span>
                    </template>
                </vue-good-table>
            </div>
        </transition>
        <loading-dots v-else loading-text="Loading referral partners" />

        <transition name="addEditRpModal">
            <add-edit-referral-partner
                v-if="editModalShowing"
                :rp="selectedRP"
                :action="action"
                @file-uploaded="addReferralPartnersByCSV($event)"
                @close="editModalShowing = false"
                @success="fetchReferralPartnerChanges()"
            />
        </transition>

        <!-- Confirmation Modal -->
        <transition name="modal-scale">
            <confirmation-modal
                v-if="confirmModal.showing"
                :message="confirmModal.message"
                :event="confirmModal.event"
                @confirmation="handleConfirmModalEvent"
            />
        </transition>
    </div>
</template>

<script>
// dependencies
import { mapGetters, mapState, mapActions } from "vuex";
import moment from "moment";
// components
import VueGoodTable from "@/components/Shared/Table/Table";
import AppButton from "../components/Shared/AppButton.vue";

export default {
    name: "ReferralPartnerManagement",
    components: {
        "vue-good-table": VueGoodTable,
        "add-edit-referral-partner": () =>
            import(
                "@/components/Admin/ReferralPartners/AddEditReferralPartner"
            ),
        "single-file-input": () =>
            import("@/components/Shared/Inputs/SingleFileInput"),
        "text-input": () => import("@/components/Shared/Inputs/TextInput"),
        "confirmation-modal": () =>
            import("@/components/Shared/ConfirmationModal"),
        "app-button": () => import("@/components/Shared/AppButton"),
        "multi-select": () => import("vue-multiselect"),
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
    },
    data() {
        return {
            editModalShowing: false,
            selectedRP: {},
            uploadStatus: "",
            statusMessage: "",
            action: "",
            tableColumns: [
                {
                    label: "Name",
                    field: this.formatName,
                },
                {
                    label: "Company",
                    field: "company",
                },
                {
                    label: "Email",
                    field: "email",
                    thClass: "email",
                    tdClass: "email",
                },
                {
                    label: "Subscribed Date",
                    field: "subscribedDatetime",
                    formatFn: this.formatDate,
                    thClass: "subscribedDate",
                    tdClass: "subscribedDate",
                },
                {
                    label: "Unsubscribed Date",
                    field: "unsubscribedDatetime",
                    formatFn: this.formatDate,
                    thClass: "unsubscribedDate",
                    tdClass: "unsubscribedDate",
                },
                {
                    label: "Is Subscribed?",
                    field: "isSubscribed",
                    formatFn: this.formatIsSubscribed,
                    tdClass: this.isSubscribedColor,
                    sortable: false,
                },
                {
                    label: "Loan Officer",
                    field: "employee",
                    formatFn: this.parseLoanOfficerName,
                    sortable: false,
                    thClass: "loanOfficer",
                    tdClass: "loanOfficer",
                },
                {
                    label: "",
                    field: "controls",
                    sortable: false,
                    tdClass: "vgt-right-align",
                },
            ],
            confirmModal: {
                showing: false,
                message: "",
                event: "",
            },
            selectedLoanOfficers: [],
            searchQuery: "",
            storeIsLoading: true,
        };
    },
    computed: {
        ...mapGetters([
            "referralPartnerById",
            "referralPartnersByEmployeeNumber",
        ]),
        ...mapState(["users", "referralPartners"]),
        userRPs() {
            return this.referralPartnersByEmployeeNumber(
                this.activeUser.employeeNumber
            );
        },
        activeUser() {
            return this.users.activeUser;
        },
        userIsLOA() {
            try {
                return this.activeUser.assists.length > 0;
            } catch {
                return false;
            }
        },
    },
    methods: {
        ...mapActions([
            "createReferralPartner",
            "updateReferralPartners",
            "createReferralPartners",
            "editReferralPartner",
            "deleteReferralPartner",
            "fetchLoanOfficers",
        ]),
        formatDate(value) {
            return value ? moment(value).format("MM/DD/YYYY") : "";
        },
        formatName(rowObj) {
            const delimiter =
                rowObj.lastName !== "" && rowObj.firstName !== "" ? ", " : "";
            return `${rowObj.lastName}${delimiter}${rowObj.firstName} `;
        },
        formatIsSubscribed(rowObj) {
            return rowObj == 1 ? "Yes" : "No";
        },
        isSubscribedColor(rowObj) {
            return rowObj.isSubscribed == 1 ? "--subscribed" : "";
        },
        openModal(rowID) {
            if (rowID !== null) {
                this.selectedRP = this.referralPartnerById(rowID);
                this.action = "edit";
            } else {
                this.selectedRP = {
                    id: null,
                };
                this.action = "add";
            }
            this.editModalShowing = true;
        },
        openUploadModal() {
            this.selectedRP = {
                id: null,
            };
            this.action = "upload";
            this.editModalShowing = true;
        },
        rowStyleClass() {
            return "VGT-row";
        },
        parseLoanOfficerName(value) {
            return value.fullName;
        },
        async addReferralPartnersByCSV(payload) {
            this.editModalShowing = false;

            if (payload.file.name.split(".").pop() !== "csv") {
                this.uploadStatus = "Error!";
                this.statusMessage = "[File must be .CSV]";
            } else {
                const formData = new FormData();
                formData.append("file", payload.file);
                formData.append("employee", payload.loanOfficer.employeeNumber);
                this.createReferralPartners(formData);
            }
        },
        unsubscribe(id) {
            this.selectedRP = JSON.parse(
                JSON.stringify({ ...this.referralPartnerById(id) })
            );
            this.openConfirmModal(
                "unsubscribe",
                "Unsubscribing will be permanent. Are you sure?"
            );
        },
        openConfirmModal(event, message) {
            this.confirmModal.event = event;
            this.confirmModal.message = message;
            this.confirmModal.showing = true;
        },
        handleConfirmModalEvent(confirmed) {
            if (confirmed) {
                switch (this.confirmModal.event) {
                    case "cancel":
                        this.$emit("close");
                        break;
                    case "unsubscribe":
                        this.selectedRP.isSubscribed = 0;
                        this.editReferralPartner(this.selectedRP);
                        this.confirmModal.showing = false;
                        break;
                    case "delete":
                        this.deleteReferralPartner({
                            employeeId: this.selectedRP.employee.employeeNumber,
                            referralPartnerId: this.selectedRP.id,
                        });
                        this.confirmModal.showing = false;
                        break;
                    default:
                        return;
                }
            }
            this.confirmModal.message = "";
            this.confirmModal.showing = false;
        },
        onDeleteReferralPartner(id) {
            this.selectedRP = JSON.parse(
                JSON.stringify({ ...this.referralPartnerById(id) })
            );
            this.openConfirmModal(
                "delete",
                "Deleting a referral partner is permanent. Are you sure?"
            );
        },
        fetchReferralPartnerChanges() {
            const employeesString =
                this.selectedLoanOfficers.length > 0
                    ? this.selectedLoanOfficers
                          .map((lo) => lo.employeeNumber)
                          .join(",")
                    : this.activeUser.employeeNumber;
            const payload = {
                employees: employeesString,
            };

            this.updateReferralPartners(payload);
        },
        async fetchReferralPartners() {
            const payload = {
                employees: this.users.activeUser.employeeNumber,
            };
            await this.updateReferralPartners(payload);
            this.storeIsLoading = false;
        },
    },
    watch: {
        activeUser() {
            if (this.referralPartners.referralPartners.length > 0) {
                this.storeIsLoading = false;
            }
            if (this.storeIsLoading) {
                this.fetchReferralPartners();
            }
        }
    },
    async mounted() {
        if (this.users.activeUser.employeeNumber) {
            // show partners immediately if they exist in store
            if (this.referralPartners.referralPartners.length > 0) {
                this.storeIsLoading = false;
            }
            this.fetchReferralPartners();
        }
    },
};
</script>

<style lang="scss" scoped>
.rp-mgmt {
    padding: $standard-view;
    @include breakpoint(desktop) {
        padding-left: 4rem;
        padding-right: 4rem;
    }
    @include breakpoint(tablet-port) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
    .resultsTable {
        .vgt-wrap {
            min-height: 445px;
            ::v-deep .vgt-wrap__footer {
                @include breakpoint(mobile-small) {
                    padding-left: 0px;
                    padding-right: 0px;
                }
                .footer__row-count__label,
                .footer__row_count__select,
                .vgt-pull-right {
                    @include breakpoint(mobile-small) {
                        font-size: 10px;
                    }
                }
            }
            ::v-deep .vgt-global-search .vgt-input {
                @include breakpoint(tablet-port) {
                    width: 150px;
                }
            }
            ::v-deep .vgt-table {
                @include breakpoint(laptop) {
                    font-size: 11px;
                }
                @include breakpoint(mobile) {
                    font-size: 8px;
                }
                td {
                    font-weight: 600;
                }
                .subscribedDate {
                    @include breakpoint(laptop) {
                        display: none;
                    }
                }
                .unsubscribedDate,
                .email {
                    @include breakpoint(tablet-land) {
                        display: none;
                    }
                }
                .loanOfficer {
                    @include breakpoint(tablet-port) {
                        display: none;
                    }
                }
            }
        }
        .vgt-global-search {
            left: 0;
            right: unset;
        }
        .btn.--unsubscribe {
            display: inline-block;
            text-align: center;
            font-size: 1.1rem;
            margin-left: 1rem;
            padding: 0.25rem 1rem;
            font-family: "Nunito Sans", sans-serif;
            font-weight: 700;
            @include breakpoint(desktop) {
                margin-left: 0rem;
                display: block;
            }
            @include breakpoint(mobile) {
                font-size: 9px;
                padding: 0.25rem 0.25rem;
            }
        }
        .tableControls {
            display: flex;
            align-items: center;
            .editRP {
                margin-right: 2rem;
            }
            .deleteRP {
                color: $red;
                font-size: 2rem;
            }
        }
    }
    .heading {
        margin-bottom: 3rem;
        font-weight: 700;
    }
    .flexBlock {
        display: flex;
        &__right {
            font-size: 14px;
        }
        a {
            font-size: 14px;
            line-height: 1.75;
            color: $teal-light;
            text-decoration: underline;
        }
    }
}
.utilityBar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 3rem 0 1.5rem 0;
    height: 3.6rem;
    @include breakpoint(laptop) {
        height: auto;
    }

    .search {
        position: relative;
        margin-right: 2rem;
        input {
            height: 2.5rem;
            width: 20rem;
            padding: 0 0.5rem 0 2.5rem;
            border-radius: 5rem;
            border: 1px solid $gray;
            &:focus,
            &:active {
                outline: none;
            }
        }
        .fa-search {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            color: $gray;
        }
    }
    .multiselect {
        width: 20rem;
        margin-right: 2rem;
        ::v-deep input {
            height: unset;
            margin-bottom: 0;
        }
    }

    .LOselect-container {
        display: flex;
        align-items: center;
        height: 3.6rem;
        @include breakpoint(tablet-land) {
            width: 100%;
            margin-top: 2rem;
        }
    }
    .addButtons-container {
        display: flex;
        margin-left: auto;
        @include breakpoint(laptop) {
            margin: 2rem 0 0;
            width: 100%;
        }
        .csv-upload {
            display: flex;
            align-items: center;
            @include breakpoint(mobile) {
                display: none;
            }
            .uploadStatus-wrapper {
                display: flex;
                align-items: center;
                margin-left: 1rem;
                .fa-check-circle {
                    margin-left: 1rem;
                    color: $teal-light;
                }
                .fa-times {
                    color: $red;
                }
                .uploadStatus {
                    font-weight: 700;
                    font-size: 14px;
                    margin-left: 3px;
                    &.--success {
                        color: $teal-light;
                    }
                    &.--error {
                        color: $red;
                    }
                }
            }
        }
    }
    button {
        padding: 0.2rem 1rem;
        font-size: 12px;
        cursor: pointer;
        z-index: 1;
        margin-right: 2rem;
        font-family: "Nunito Sans", sans-serif;
        font-weight: 700;
        @include breakpoint(tablet-port) {
            font-size: 10px;
            margin-right: 1rem;
        }
        &:hover {
            background-color: $orange;
            color: #fff;
        }
    }
}
::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}

@include slideDownEnter("addEditRpModal", 35%, 50%);
</style>
