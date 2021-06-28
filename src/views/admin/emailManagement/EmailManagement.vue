<template>
    <div>
        <div class="emailMgmt">
            <div>
                <h1 class="heading">Email Management</h1>
                <!-- Utility Bar -->
                <div class="utilityBar">
                    <app-button
                        classes="btn btn-orange"
                        @click.native="goToAddEmail"
                        text="Create Email"
                    />
                    <app-button
                        classes="btn btn-blue"
                        @click.native="goToTemplateManagement"
                        text="Templates"
                    />
                </div>
                <!-- Results Table -->
                <transition
                    v-if="!storeIsLoading"
                    name="fadeInOut"
                    appear
                >
                    <div class="resultsTable">
                        <vue-good-table
                            :columns="tableColumns"
                            :rows="allEmails"
                            styleClass="vgt-table"
                            :search-options="{
                                enabled: true,
                            }"
                            :pagination-options="{
                                enabled: true,
                                mode: 'records',
                            }"
                        >
                            <!-- Dynamic table rows -->
                            <template slot="table-row" slot-scope="props">
                                <!-- "Duplicate" -->
                                <span v-if="props.column.field == 'duplicate'">
                                    <img
                                        class="tableIcon tableIcon--duplicate"
                                        src="@/assets/images/duplicate_icon.png"
                                        @click="
                                            goToDuplicateTemplate(props.row.id)
                                        "
                                        alt
                                    />
                                </span>
                                <!-- "Edit" -->
                                <span v-if="props.column.field == 'edit'">
                                    <img
                                        v-if="props.row.status !== 'Sent'"
                                        class="tableIcon tableIcon--edit"
                                        src="@/assets/images/edit_icon.png"
                                        @click="goToEditEmail(props.row.id)"
                                        alt
                                    />
                                    <img
                                        v-else
                                        class="tableIcon tableIcon--view"
                                        src="@/assets/images/eye_icon.png"
                                        @click="goToViewEmail(props.row.id)"
                                        alt
                                    />
                                </span>
                                <!-- Status -->
                                <span
                                    v-else-if="props.column.field === 'status'"
                                >
                                    <span
                                        class="status"
                                        :class="
                                            parseOrderStatus(props.row.status)
                                        "
                                        >{{ props.row.status }}</span
                                    >
                                </span>

                                <span v-else>{{
                                    props.formattedRow[props.column.field]
                                }}</span>
                            </template>
                        </vue-good-table>
                    </div>
                </transition>
                <loading-dots
                    v-else
                    loading-text="Loading emails"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";
// components
import VueGoodTable from "@/components/Shared/Table/Table";
// mixins
import { parse } from "@/mixins";

export default {
    name: "EmailManagement",
    mixins: [parse],
    components: {
        "vue-good-table": VueGoodTable,
        "app-button": () => import("@/components/Shared/AppButton"),
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
    },
    data() {
        return {
            tableColumns: [
                {
                    label: "Duplicate",
                    field: "duplicate",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
                {
                    label: "Edit/View",
                    field: "edit",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
                {
                    label: "Subject Line",
                    field: "campaignName",
                },
                {
                    label: "Audience",
                    field: "audience",
                },
                {
                    label: "Date Created",
                    field: "createdDatetime",
                    formatFn: this.formatDate,
                },
                {
                    label: "Send Date",
                    field: "sendDatetime",
                    formatFn: this.formatDate,
                },
                {
                    label: "Status",
                    field: "status",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
            ],
            storeIsLoading: true,
        };
    },
    computed: {
        ...mapState(["templates"]),
        ...mapGetters(["allEmails", "emailById", "baseTemplateById"]),
    },
    methods: {
        ...mapActions(["updateEmails", "reserveBatchId", "fetchLoanOfficers"]),

        goToTemplateManagement() {
            this.$router.push("/admin/email-management/template-management");
        },
        goToAddEmail() {
            this.$router.push("/admin/email-management/add-email");
        },
        goToEditEmail(id) {
            this.$router.push(`/admin/email-management/edit-email/${id}`);
        },
        goToViewEmail(id) {
            this.$router.push(`/admin/email-management/view-email/${id}`);
        },
        goToDuplicateTemplate(id) {
            this.$router.push(`/admin/email-management/duplicate-email/${id}`);
        },
        formatDate(value) {
            return value ? moment(value).format("MM/DD/YYYY - hh:mm a") : "";
        },
    },
    async mounted() {
        this.fetchLoanOfficers();

        // show emails immediately if they exist in store
        if (this.allEmails.length > 0) {
            this.baseEmails = this.allEmails;
            this.storeIsLoading = false;
        }

        await this.updateEmails();   // vuex action that brings in all email data
        this.storeIsLoading = false;
    },
};
</script>

<style lang="scss" scoped>
.emailMgmt {
	@include view-pad-2-14;
	.heading {
		font-weight: 800;
	}
	.resultsTable {
		.status {
			display: inline-block;
			width: 10rem;
			text-align: center;
		}
		::v-deep .vgt-responsive {
			table.vgt-table {
				td {
					font-weight: 600;
				}
			}
		}
	}
}
.utilityBar {
	display: flex;
	justify-content: flex-end;
	margin: 5.5rem 0 1.5rem;
	button {
		margin-left: 1rem;
		font-family: "Nunito Sans", sans-serif;
		font-weight: 700;
	}
}
::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}
</style>

<style lang="scss">
.emailMgmt {
	.resultsTable {
		.vgt-global-search {
			left: 0;
			right: unset;
		}
	}
}
</style>
