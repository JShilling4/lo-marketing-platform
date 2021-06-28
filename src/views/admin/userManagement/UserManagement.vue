<template>
    <div class="userMgmt">
        <h1 class="heading">User Management</h1>

        <div class="utilityBar"></div>

        <transition
            v-if="!storeIsLoading"
            name="fadeInOut"
            appear
        >
            <div class="resultsTable">
                <vue-good-table
                    :columns="tableColumns"
                    :rows="tableRows"
                    @on-row-click="editUser"
                    styleClass="vgt-table"
                    :search-options="{
                        enabled: true,
                        skipDiacritics: true
                    }"
                    :pagination-options="{
                        enabled: true,
                        mode: 'pages'
                    }"
                    :sort-options="{
                        enabled: true,
                        initialSortBy: { field: 'fullName', type: 'asc' }
                    }"
                >
                    <!-- Dynamic table rows -->
                    <template
                        slot="table-row"
                        slot-scope="props"
                    >
                        <!-- User name -->
                        <span v-if="props.column.field === 'fullName'">
                            {{ formatName(props.row) }}
                        </span>

                        <!-- Status -->
                        <span v-else-if="props.column.field === 'availability'">
                            <span
                                class="status"
                                style="text-transform: capitalize; color: #333;"
                            >
                                {{ props.row.availability == 'away' ? `${props.row.availability} until ${props.row.awayEndDatetime}` :  props.row.availability}}
                            </span>
                        </span>

                        <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                    </template>
                </vue-good-table>
            </div>
        </transition>
        <loading-dots
            v-else
            loading-text="Loading users"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import VueGoodTable from "@/components/Shared/Table/Table";

export default {
    name: "UserManagement",
    components: {
        "vue-good-table": VueGoodTable,
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
    },
    data() {
        return {
            tableColumns: [
                {
                    label: "ID",
                    field: "employeeNumber",
                },
                {
                    label: "Name",
                    field: "fullName",
                    sortFn: this.sortByLastName,
                },
                {
                    label: "Email",
                    field: "email",
                },
                {
                    label: "Access",
                    field: this.getAccessLevel,
                    sortFn: this.sortByAccessLevel,
                },
                {
                    label: "Status",
                    field: "availability",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
            ],
            tableRows: [],
            storeIsLoading: true,
        };
    },
    computed: {
        ...mapState(["users"]),
        ...mapGetters(["allUsers"]),
    },
    methods: {
        ...mapActions(["fetchEmployees"]),
        editUser(data) {
            this.$router.push(
                `/admin/user-management/edit-user/${data.row.employeeNumber}`
            );
        },
        formatName(rowObj) {
            const delimiter =
                rowObj.lastName !== "" && rowObj.firstName !== "" ? ", " : "";
            return `${rowObj.lastName}${delimiter}${rowObj.firstName} `;
        },
        sortByLastName(a, b) {
            try {
                const splitA = a.split(" ");
                const splitB = b.split(" ");
                const lastA = splitA[splitA.length - 1];
                const lastB = splitB[splitB.length - 1];

                if (lastA < lastB) return -1;
                if (lastA > lastB) return 1;
            } catch (error) {
                /* shhh linter */
            }
            return 0;
        },
        sortByAccessLevel(a, b) {
            try {
                const roleA = this.getAccessLevel({ userRoles: a });
                const roleB = this.getAccessLevel({ userRoles: b });
                if (roleA < roleB) return -1;
                if (roleA > roleB) return 1;
            } catch (error) {
                /* shhh linter */
            }
            return 0;
        },
        getAccessLevel(rowObj) {
            const { userRoles } = rowObj;
            if (userRoles) {
                if (
                    userRoles.includes("ROLE_MARKETING_ADMIN") ||
                    userRoles.includes("ROLE_IT")
                ) {
                    return "Super Administrator";
                }
                if (userRoles.includes("ROLE_EXECUTIVE_MANAGER")) {
                    return "Executive Manager";
                }
                if (userRoles.includes("ROLE_REGIONAL_MANAGER")) {
                    return "Regional Manager";
                }
                if (userRoles.includes("ROLE_BRANCH_MANAGER")) {
                    return "Branch Manager";
                }
                if (userRoles.includes("ROLE_MARKETING_EMPLOYEE")) {
                    return "Marketing Employee";
                }
                if (userRoles.includes("ROLE_EMPLOYEE")) {
                    return "Ruoff Employee";
                }
            }
            return "User";
        },
    },
    async mounted() {
        setTimeout(() => {
            this.tableRows = this.users.users;
        }, 100);

        // show users immediately if they exist in store
        if (this.users.users.length > 0) {
            this.storeIsLoading = false;
        }

        await this.fetchEmployees();
        this.tableRows = this.users.users;
        this.storeIsLoading = false;
    },
};
</script>

<style lang="scss" scoped>
.userMgmt {
    padding: $standard-view;
    .heading {
        font-weight: 800;
    }
    .resultsTable {
        .vgt-global-search {
            left: 0;
            right: unset;
        }
        .status {
            display: inline-block;
            width: 9rem;
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
    margin: 8rem 0 1rem;
}
::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}
</style>
