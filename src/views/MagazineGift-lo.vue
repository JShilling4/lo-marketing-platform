<template>
    <div class="magazineGiftLo">
        <h1 class="heading">Magazine Gift Program</h1>

        <!-- View toggle -->
        <div class="viewToggle">
            <ul class="viewToggle__nav">
                <li
                    :class="['navItem', { '--active': currentView === 'loans' }]"
                    @click="currentView = 'loans'"
                >
                    My Gifts
                </li>
                <li
                    :class="['navItem', { '--active': currentView === 'options' }]"
                    @click="currentView = 'options'"
                >
                    Magazine Options
                </li>
            </ul>
        </div>

        <div
            v-if="currentView === 'loans'"
            class="utilityBar"
        >
            <app-button
                classes="btn btn-orange"
                text="Submit Choices"
                @click.native="saveChoices"
            />
        </div>

        <!-- Description Block -->
        <div
            v-if="currentView === 'options'"
            class="descriptionBlock"
        >
            <p class="copy">
                The Magazine Gift Program is a direct marketing tool for saying "THANK YOU" to your client.
                Your client will receive:
            </p>
            <ul class="list">
                <li>A. "THANK YOU" postcard to announce the gift subscription.</li>
                <li>B. SUBSCRIPTION to the selected magazine.</li>
                <li>
                    C. Your
                    <a
                        href="/images/magazineGift/loyaltyLabel.png"
                        target="_blank"
                    >Loyalty Label</a> on the
                    front cover of each issue.
                </li>
            </ul>
            <p class="copy">
                The cost is $9 for each subscription and automatically deducted from your payroll!
                Send a magazine subscription to one of the great magazines in our selection.<br />
                Each issue of the magazine displays a label with your name, phone number, logo, and a thank you message.
                New orders take two months to process, as do any changes or modifications to an active subscription.
            </p>
            <p class="copy">
                <strong>
                    Each magazine subscription will run for a 12-month or 24-month period, as stated in its description.
                    By participating in the program, the loan officer agrees that it is their responsibility to reach out to the
                    Marketing Director if a subscription needs to be changed or canceled for any reason.
                </strong>
            </p>
        </div>

        <!-- Options Table -->
        <div class="resultsTable options">
            <vue-good-table
                v-show="currentView === 'options'"
                :columns="magazineTableColumns"
                :rows="magazines.magazines"
                styleClass="vgt-table"
                :search-options="{
          enabled: true
        }"
                :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 5
        }"
                :sort-options="{
          enabled: true,
          initialSortBy: { field: 'title', type: 'asc' }
        }"
            >
                <!-- Dynamic table rows -->
                <template
                    slot="table-row"
                    slot-scope="props"
                >
                    <!-- Magazine -->
                    <span v-if="props.column.field === 'image'">
                        <img
                            :src="props.row.image"
                            class="magazineThumb"
                        />
                    </span>

                    <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                </template>
            </vue-good-table>
        </div>

        <!-- Closed Loans Table -->
        <div class="resultsTable loans">
            <vue-good-table
                v-show="currentView === 'loans'"
                :columns="closedLoanColumns"
                :rows="closedLoans"
                styleClass="vgt-table"
                :search-options="{
          enabled: true
        }"
                :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 5
        }"
                :sort-options="{
          enabled: true,
          initialSortBy: { field: 'closeDate', type: 'desc' }
        }"
            >
                <!-- Dynamic table rows -->
                <template
                    slot="table-row"
                    slot-scope="props"
                >
                    <!-- Edit -->
                    <span v-if="props.column.field == 'edit'">
                        <img
                            class="tableIcon tableIcon--edit"
                            src="@/assets/images/edit_icon.png"
                            @click="editBorrowerInfo(props.row)"
                            alt
                        />
                    </span>

                    <!-- Borrower Name -->
                    <span v-else-if="props.column.field == 'name'">
                        {{ props.row.firstName }} {{ props.row.lastName }}
                    </span>

                    <!-- Borrower Address -->
                    <span v-else-if="props.column.field == 'fullAddress'">
                        {{ props.row.address }} <br />
                        {{ props.row.city }}, {{ props.row.state }} {{ props.row.zip }}
                    </span>

                    <!-- Loan Number -->
                    <span v-else-if="props.column.field == 'loanNumber'">
                        {{ props.row.loanOfficer.fullName }} <br />
                        Loan #{{ props.row.loanNumber }}
                    </span>

                    <!-- Magazine Choice -->
                    <span v-else-if="props.column.field == 'magazine'">
                        <div class="multiselect-wrapper">
                            <multi-select
                                :value="props.row.magazine"
                                track-by="id"
                                label="title"
                                selectLabel=""
                                deselectLabel=""
                                :show-labels="false"
                                :searchable="false"
                                :options="magazineChoices"
                                @input="addToChoicesPostList($event, props.row)"
                            />
                        </div>
                    </span>

                    <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                </template>
            </vue-good-table>
        </div>

        <transition name="editBorrower">
            <edit-borrower-info
                v-if="editBorrowerShowing"
                @close="editBorrowerShowing = false"
                :loan-info="selectedLoanInfo"
                @update="updateBorrowerInfo"
            />
        </transition>
    </div>
</template>

<script>
// dependencies
import Vue from "vue";
import { mapState, mapActions, mapMutations } from "vuex";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";
import moment from "moment";
// components
import VueGoodTable from "@/components/Shared/Table/Table";
import MultiSelect from "vue-multiselect";
import EditBorrowerInfo from "@/components/MagazineProgram/EditBorrowerInfo";
import AppButton from "@/components/Shared/AppButton";

export default {
    name: "MagazineGiftLo",
    components: {
        "vue-good-table": VueGoodTable,
        "multi-select": MultiSelect,
        "edit-borrower-info": EditBorrowerInfo,
        "app-button": AppButton,
    },
    data() {
        return {
            magazineTableColumns: [
                {
                    label: "Image",
                    field: "image",
                    thClass: "image",
                    tdClass: "image",
                },
                {
                    label: "Title",
                    field: "title",
                    thClass: "title",
                    tdClass: "title",
                },
                {
                    label: "Description",
                    field: "description",
                    thClass: "desc",
                    tdClass: "desc",
                },
            ],
            closedLoanColumns: [
                {
                    label: "Borrower",
                    field: "name",
                },
                {
                    label: "Email",
                    field: "email",
                    thClass: "email",
                    tdClass: "email",
                },
                {
                    label: "Address",
                    field: "fullAddress",
                    thClass: "address",
                    tdClass: "address",
                },
                {
                    label: "Loan #",
                    field: "loanNumber",
                    thClass: "loanNum",
                    tdClass: "loanNum",
                },
                {
                    label: "Closing Date",
                    field: "closeDate",
                    thClass: "vgt-center-align closing",
                    tdClass: "vgt-center-align closing",
                    formatFn: this.formatDate,
                },
                {
                    label: "Magazine Choice",
                    field: "magazine",
                    thClass: "magazineChoice",
                    tdClass: "magazineChoice",
                },
                {
                    label: "Edit",
                    field: "edit",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
            ],
            currentView: "loans",
            magazineChoices: [
                {
                    title: "No Magazine",
                    id: 1,
                },
                {
                    title: "Borrower's Choice",
                    id: 2,
                },
            ],
            closedLoans: [],
            editBorrowerShowing: false,
            selectedLoanInfo: {},
            choicesPostList: [],
        };
    },
    computed: {
        ...mapState(["magazines", "users"]),
        sessionData() {
            return this.users.activeUser;
        },
    },
    watch: {
        sessionData() {
            this.getClosedLoansForUser();
        },
    },
    methods: {
        ...mapActions(["updateMagazines"]),
        ...mapMutations(["SET_LOADING"]),
        editBorrowerInfo(row) {
            this.selectedLoanInfo = row;
            this.editBorrowerShowing = true;
        },
        addToChoicesPostList(newValue, loan) {
            const id = loan.loanNumber;
            const previousChoice = loan.magazine;

            // if we have entries in the post list, check if this one exists so we know if
            // we need to splice or push
            if (this.choicesPostList.length > 0) {
                const target = this.choicesPostList.find(
                    (post) => post.loanNumber == id
                );
                if (target) {
                    target.loanNumber = loan.loanNumber;
                    target.magazine = newValue;
                } else {
                    this.choicesPostList.push({
                        loanNumber: loan.loanNumber,
                        loanNumberIsEncoded: false,
                        magazine: newValue,
                        previousChoice,
                    });
                }
            } else {
                this.choicesPostList.push({
                    loanNumber: loan.loanNumber,
                    loanNumberIsEncoded: false,
                    magazine: newValue,
                    previousChoice,
                });
            }

            loan.magazine = newValue;
        },
        formatDate(value) {
            return value ? moment(value).format("MM/DD/YYYY") : "";
        },
        getClosedLoansForUser() {
            api.magazines
                .fetchClosedLoansByEmployeeNumber(
                    this.users.activeUser.employeeNumber
                )
                .then((response) => {
                    const { data } = response.data;
                    this.closedLoans = data.marketingV1GetLoans;
                });
        },
        saveChoices() {
            this.SET_LOADING(true, { root: true }); // start loading spinner
            api.magazines
                .setMagazineChoice(this.choicesPostList)
                .then((response) => {
                    if (response.status === 200) {
                        Vue.toasted.success(
                            "Magazine choices successfully saved."
                        );
                        this.SET_LOADING(false, { root: true }); // start loading spinner
                    }
                })
                .catch((error) => {
                    handleApiError(error);
                });
        },
        updateBorrowerInfo(borrowerInfo) {
            this.closedLoans.splice(
                borrowerInfo.originalIndex,
                1,
                borrowerInfo
            );
        },
    },
    async created() {
        if (this.users.activeUser.employeeNumber) {
            this.getClosedLoansForUser();
        }
        await this.updateMagazines();
        this.magazines.magazines.forEach((magazine) => {
            this.magazineChoices.push({
                title: magazine.title,
                id: magazine.id,
            });
        });
    },
};
</script>

<style lang="scss" scoped>
.magazineGiftLo {
    padding: $standard-view;
    @include breakpoint(desktop) {
        padding-left: 6rem;
        padding-right: 6rem;
    }
    @include breakpoint(laptop) {
        padding-left: 4rem;
        padding-right: 4rem;
    }
    @include breakpoint(tablet-port) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
    .heading {
        font-weight: 800;
        @include breakpoint(mobile-small) {
            font-size: 20px;
        }
    }
}

.utilityBar {
    display: flex;
    justify-content: flex-end;
    margin: 5rem 0 1rem;
    button {
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
        @include breakpoint(mobile) {
            padding: 5px 10px;
            width: 100px;
            font-size: 10px;
            height: 32px;
        }
        @include breakpoint(mobile-small) {
            padding: 5px 5px;
            width: 75px;
            font-size: 8px;
        }
        &:hover {
            background-color: $orange;
            color: #fff;
        }
    }
}

.viewToggle {
    margin-top: 3rem;
    &__nav {
        display: flex;
        .navItem {
            font-weight: 600;
            margin-right: 3rem;
            cursor: pointer;
            transition: color 0.3s;
            @include breakpoint(mobile-small) {
                font-size: 14px;
            }
            &.--active {
                color: $orange;
                text-decoration: underline;
            }
            &:hover {
                color: $orange;
            }
        }
    }
}

.descriptionBlock {
    margin-top: 2rem;
    font-size: 1.4rem;
    @include breakpoint(tablet-port) {
        font-size: 12px;
    }
    .list {
        margin: 1rem 0;
        padding-left: 3rem;
        line-height: 150%;
        a {
            text-decoration: underline;
            color: $teal-light;
            transition: color 0.3s;
            &:hover {
                color: $orange;
            }
        }
    }
    strong {
        font-weight: 700;
    }
}

.resultsTable {
    @include breakpoint(laptop) {
        font-size: 0.7em;
    }
    &.options {
        margin-top: 7rem;
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
        ::v-deep .vgt-responsive {
            table.vgt-table {
                .image {
                    width: 200px;
                    @include breakpoint(ipadPro) {
                        width: 150px;
                    }
                    @include breakpoint(tablet-land) {
                        width: 100px;
                        font-size: 12px;
                    }
                    @include breakpoint(tablet-port) {
                        width: 80px;
                        font-size: 10px;
                    }
                }
                .title {
                    width: 300px;
                    font-weight: 600;
                    @include breakpoint(ipadPro) {
                        width: 250px;
                    }
                    @include breakpoint(tablet-land) {
                        width: 150px;
                        font-size: 12px;
                    }
                    @include breakpoint(tablet-port) {
                        width: 100px;
                        font-size: 10px;
                    }
                    @include breakpoint(mobile) {
                        font-size: 12px;
                    }
                }
                .desc {
                    font-weight: 600;
                    @include breakpoint(tablet-land) {
                        font-size: 12px;
                    }
                    @include breakpoint(tablet-port) {
                        font-size: 10px;
                    }
                    @include breakpoint(mobile) {
                        display: none;
                    }
                }

                .magazineThumb {
                    width: 70px;
                }
            }
        }
    }
    &.loans {
        margin-top: -5.5rem;
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
            @include breakpoint(mobile) {
                width: 150px;
            }
            @include breakpoint(mobile-small) {
                width: 130px;
            }
        }
        ::v-deep .vgt-responsive {
            overflow-x: unset;
            table.vgt-table {
                @include breakpoint(ipadPro) {
                    font-size: 0.8em;
                }
                @include breakpoint(laptop) {
                    font-size: 10px;
                }
                @include breakpoint(tablet-land) {
                    font-size: 9px;
                }
                @include breakpoint(mobile) {
                    font-size: 8px;
                }
                th,
                td {
                    @include breakpoint(tablet-land) {
                        padding-right: 2px;
                        padding-left: 2px;
                    }
                }
                td {
                    font-weight: 600;
                }
                .address {
                    @include breakpoint(tablet-land) {
                        display: none;
                    }
                }
                .email {
                    @include breakpoint(tablet-port) {
                        display: none;
                    }
                }
                .closing {
                    @include breakpoint(tablet-port) {
                        display: none;
                    }
                }
                .loanNum {
                    @include breakpoint(mobile-small) {
                        display: none;
                    }
                }
                .magazineChoice {
                    .multiselect__tags,
                    .multiselect__content,
                    .multiselect__placeholder,
                    .multiselect__single {
                        @include breakpoint(laptop) {
                            font-size: 9px;
                        }
                        @include breakpoint(tablet-land) {
                            font-size: 8px;
                        }
                        @include breakpoint(tablet-port) {
                            font-size: 9px;
                        }
                        @include breakpoint(mobile) {
                            font-size: 8px;
                        }
                    }
                }
            }
        }
    }
}

@include slideDownEnter("editBorrower", 35%, 50%);
</style>
