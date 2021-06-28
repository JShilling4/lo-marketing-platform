<template>
    <div class="teamMgmt">
        <h1 class="heading">Team Management</h1>

        <div class="utilityBar">
            <app-button
                class="btn btn-orange"
                @click.native="openAddModal"
                text="Add Team"
            />
        </div>

        <transition v-if="!storeIsLoading" name="fadeInOut" appear>
            <div class="resultsTable">
                <vue-good-table
                    :columns="tableColumns"
                    :rows="teams.teams"
                    @on-row-click="openEditModal"
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
                        initialSortBy: { field: 'name', type: 'asc' },
                    }"
                >
                    <!-- Dynamic table rows -->
                    <template slot="table-row" slot-scope="props">
                        <!-- Active -->
                        <span
                            v-if="props.column.field == 'isActive'"
                            class="status"
                        >
                            {{ props.row.isActive === 1 ? "Yes" : "No" }}
                        </span>
                        <span v-else-if="props.column.field == 'template'">
                            {{
                                props.row.template.includes("minimal")
                                    ? "Minimal"
                                    : "Full"
                            }}
                        </span>

                        <span v-else>{{
                            props.formattedRow[props.column.field]
                        }}</span>
                    </template>
                </vue-good-table>
            </div>
        </transition>
        <loading-dots v-else loading-text="Loading teams" />

        <transition name="addEditTeamModal">
            <add-edit-team
                v-if="addEditModalShowing"
                :item="selectedItem"
                :action="action"
                @close="addEditModalShowing = false"
            />
        </transition>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueGoodTable from "@/components/Shared/Table/Table";
import AddEditTeam from "@/components/Admin/TeamManagement/AddEditTeam";
import AppButton from "@/components/Shared/AppButton";

export default {
    name: "TeamManagement",
    components: {
        "vue-good-table": VueGoodTable,
        "add-edit-team": AddEditTeam,
        "app-button": AppButton,
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
    },
    data() {
        return {
            tableColumns: [
                {
                    label: "Name",
                    field: "name",
                },
                {
                    label: "Team Leader",
                    field: "leader.fullName",
                },
                {
                    label: "URL",
                    field: "url",
                },
                {
                    label: "Template",
                    field: "template",
                },
                {
                    label: "Active",
                    field: "isActive",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
            ],
            addEditModalShowing: false,
            action: null,
            selectedItem: {},
            baseTeams: [],
            storeIsLoading: true,
        };
    },
    computed: {
        ...mapState(["teams"]),
    },
    methods: {
        ...mapActions(["updateTeams", "fetchEmployees"]),
        openEditModal(params) {
            this.selectedItem = params.row;
            this.action = "edit";
            this.addEditModalShowing = true;
        },
        openAddModal() {
            this.action = "add";
            this.selectedItem = {
                id: null,
                name: "",
                bio: "",
                isActive: 1,
                leader: null,
                members: null,
                template: "pages/Teams/team-minimal.html.twig",
            };
            this.addEditModalShowing = true;
        },
    },
    async created() {
        this.fetchEmployees();

        if (this.teams.teams.length > 0) {
            this.storeIsLoading = false;
        }

        await this.updateTeams();
        this.storeIsLoading = false;
    },
};
</script>

<style lang="scss" scoped>
.teamMgmt {
    padding: $standard-view;
    h1.heading {
        font-weight: 800;
    }
    .resultsTable {
        .vgt-global-search {
            left: 0;
            right: unset;
        }
        .status {
            color: #333;
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
    justify-content: flex-end;
    margin: 4rem 0 1rem;
    .search {
        position: relative;
        input {
            height: 2.5rem;
            width: 35rem;
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
    button {
        font-family: "Nunito Sans", sans-serif;
        font-weight: 700;
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

@include slideDownEnter("addEditTeamModal", 35%, 50%);
</style>
