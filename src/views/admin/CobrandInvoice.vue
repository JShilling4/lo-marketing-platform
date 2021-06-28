<template>
    <div class="cobrandInvoice">
        <h1 class="heading">Co-brand Invoice</h1>

        <div class="utilityBar">
            <app-button
                class="btn btn-orange"
                text="Add Invoice"
                @click.native="openAddInvoice"
            />
        </div>

        <transition
            v-if="!storeIsLoading"
            name="fadeInOut"
            appear
        >
            <div class="resultsTable">
                <vue-good-table
                    :columns="tableColumns"
                    :rows="cobrandInvoices.cobrandInvoices"
                    @on-row-click="openEditInvoice"
                    styleClass="vgt-table"
                    :search-options="{
                        enabled: true,
                    }"
                    :pagination-options="{
                        enabled: true,
                        mode: 'records',
                    }"
                    :sort-options="{
                        enabled: true,
                        initialSortBy: {
                            field: 'invoicedDatetime',
                            type: 'asc',
                        },
                    }"
                >
                    <!-- Dynamic table rows -->
                    <template slot="table-row" slot-scope="props">
                        <!-- Status -->
                        <span v-if="props.column.field === 'status'">
                            <span class="status" :class="props.row.status">{{
                                props.row.status
                            }}</span>
                        </span>

                        <!-- Invoiced date -->
                        <span
                            v-else-if="
                                props.column.field === 'invoicedDatetime'
                            "
                        >
                            {{
                                props.row.invoicedDatetime !== null
                                    ? formatDate(
                                          props.row.invoicedDatetime,
                                          "MM-DD-YY"
                                      )
                                    : ""
                            }}
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
            loading-text="Loading invoices"
        />

        <transition name="editInvoiceModal">
            <add-edit-invoice
                v-if="addEditInvoiceShowing"
                :invoice="selectedInvoice"
                :action="action"
                @close="addEditInvoiceShowing = false"
            />
        </transition>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VueGoodTable from "@/components/Shared/Table/Table";
import AddEditCobrandInvoice from "@/components/Admin/AddEditCobrandInvoice";
import AppButton from "@/components/Shared/AppButton";
// mixins
import { format } from "@/mixins";

export default {
    name: "cobrand-invoice",
    mixins: [format],
    components: {
        "vue-good-table": VueGoodTable,
        "add-edit-invoice": AddEditCobrandInvoice,
        "app-button": AppButton,
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
    },
    data() {
        return {
            tableColumns: [
                {
                    label: "Invoice #",
                    field: "id",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                    type: "number",
                },
                {
                    label: "Description",
                    field: "productDescription",
                },
                {
                    label: "Loan Officer",
                    field: "loanOfficer.fullName",
                },
                {
                    label: "Co-brandee Name",
                    field: "careOf.fullName",
                },
                {
                    label: "Co-brandee Email",
                    field: "careOf.email",
                },
                {
                    label: "Invoice Date",
                    field: "invoicedDatetime",
                },
                {
                    label: "Status",
                    field: "status",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
            ],
            addEditInvoiceShowing: false,
            selectedInvoice: null,
            action: "add",
            storeIsLoading: true,
        };
    },
    computed: {
        ...mapState(["cobrandInvoices"]),
    },
    methods: {
        ...mapActions(["fetchLoanOfficers", "fetchInvoices"]),
        openEditInvoice(params) {
            this.selectedInvoice = params.row;
            this.selectedInvoice.upload = null;
            this.addEditInvoiceShowing = true;
        },
        openAddInvoice() {
            this.selectedInvoice = undefined;
            this.addEditInvoiceShowing = true;
        },
    },
    async created() {
        this.fetchLoanOfficers();

        // show invoices immediately if they exist in store
        if (this.cobrandInvoices.cobrandInvoices.length > 0) {
            this.storeIsLoading = false;
        }

        await this.fetchInvoices();
        this.storeIsLoading = false;
    },
};
</script>

<style lang="scss" scoped>
.cobrandInvoice {
    padding: $standard-view;
    .heading {
        font-weight: 800;
    }
    .utilityBar {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin: 4rem 0 1.8rem;
        button {
            margin-left: auto;
            font-family: "Nunito Sans", sans-serif;
            font-weight: 700;
            &:hover {
                background-color: $orange;
                color: #fff;
            }
        }
    }
    .resultsTable {
        .vgt-global-search {
            left: 0;
            right: unset;
        }
        ::v-deep .vgt-center-align {
            text-align: center !important; // necessary to override the packages styles
        }
        .status {
            color: #fff;
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
    margin: 8rem 0 1rem;
}
::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}

@include slideDownEnter("editInvoiceModal", 35%, 50%);
</style>
