<template>
    <div class="categoryMgmt">
        <div>
            <h1 class="heading">Categories & Topics</h1>
            <div class="utilityBar">
                <div class="utilityBar__filterContainer">
                    <span
                        :class="{ '--selected': dataset == 'categories' }"
                        @click="dataset = 'categories'"
                    >
                        Categories
                    </span>
                    <span
                        :class="{ '--selected': dataset == 'topics' }"
                        @click="dataset = 'topics'"
                    >
                        Topics
                    </span>
                </div>
                <app-button
                    class="btn btn-orange"
                    @click.native="addItem"
                    :text="
                        dataset == 'categories'
                            ? 'Add a Category'
                            : 'Add a Topic'
                    "
                />
            </div>

            <!-- Table -->
            <transition v-if="!storeIsLoading" name="fadeInOut" appear>
                <div class="resultsTable">
                    <vue-good-table
                        :columns="tableColumns"
                        :rows="tableData"
                        styleClass="vgt-table"
                        :search-options="{
                            enabled: true,
                        }"
                        :pagination-options="{
                            enabled: true,
                            mode: 'pages',
                        }"
                    >
                        <!-- Dynamic table rows -->
                        <template slot="table-row" slot-scope="props">
                            <!-- "Edit" -->
                            <span v-if="props.column.field == 'edit'">
                                <img
                                    class="tableIcon tableIcon--edit"
                                    src="@/assets/images/edit_icon.png"
                                    @click="
                                        editItem(
                                            dataset == 'categories'
                                                ? props.row.id
                                                : props.row.name
                                        )
                                    "
                                    alt
                                />
                            </span>
                            <!-- Status -->
                            <span v-else-if="props.column.field === 'isActive'">
                                <span
                                    class="status"
                                    :class="
                                        parseStatusFromBool(props.row.isActive)
                                    "
                                >
                                    {{
                                        parseStatusFromBool(props.row.isActive)
                                    }}
                                </span>
                            </span>

                            <!-- Delete -->
                            <span v-else-if="props.column.field == 'delete'">
                                <i
                                    class="fas fa-times-circle deleteBtn"
                                    @click="onDeleteTopic(props.row.name)"
                                ></i>
                            </span>

                            <span v-else>{{
                                props.formattedRow[props.column.field]
                            }}</span>
                        </template>
                    </vue-good-table>
                </div>
            </transition>
            <loading-dots v-else loading-text="Loading categories" />
        </div>

        <transition name="addEditCategoryTopicModal">
            <add-edit-category-or-topic
                v-if="addEditShowing"
                :item="selectedItem"
                :type="dataset"
                :action="action"
                @close="addEditShowing = false"
            />
        </transition>
    </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions, mapState } from "vuex";
// components
import VueGoodTable from "@/components/Shared/Table/Table";
import AddEditCategoryOrTopic from "@/components/Admin/CategoriesAndTopics/AddEditCategoryOrTopic";
// mixins
import { parse } from "@/mixins";

export default {
    name: "CategoryTopicManagement",
    mixins: [parse],
    components: {
        "vue-good-table": VueGoodTable,
        "add-edit-category-or-topic": AddEditCategoryOrTopic,
        "app-button": () => import("@/components/Shared/AppButton"),
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
    },
    data() {
        return {
            addEditShowing: false,
            dataset: "categories",
            selectedItem: {},
            action: "",
            storeIsLoading: true,
        };
    },
    computed: {
        ...mapState(["topics"]),
        ...mapGetters([
            "allCategories",
            "allTopics",
            "topicByName",
            "categoryById",
        ]),
        tableColumns() {
            // conditionally render table columns/fields based on the dataset (category/Topic)
            if (this.dataset == "topics") {
                return [
                    {
                        label: "Edit",
                        field: "edit",
                        thClass: "vgt-center-align",
                        tdClass: "vgt-center-align",
                        width: "200px",
                    },
                    {
                        label: "Topic Name",
                        field: "name",
                        width: "340px",
                    },
                    {
                        label: "Topic Description",
                        field: "description",
                    },
                    {
                        label: "Status",
                        field: "isActive",
                        thClass: "vgt-center-align",
                        tdClass: "vgt-center-align",
                        width: "100px",
                    },
                    {
                        label: "Delete",
                        field: "delete",
                        sortable: false,
                        thClass: "vgt-center-align",
                        tdClass: "vgt-center-align",
                    },
                ];
            }
            return [
                {
                    label: "Edit",
                    field: "edit",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                    width: "100px",
                },
                {
                    label: "Category Name",
                    field: "name",
                    width: "340px",
                },
                {
                    label: "Category Description",
                    field: "description",
                },
                {
                    label: "Status",
                    field: "isActive",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                    width: "200px",
                },
            ];
        },
        tableData: {
            get() {
                if (this.dataset == "categories") {
                    return this.allCategories;
                }
                return this.allTopics;
            },
            set(value) {
                return value;
            },
        },
    },
    methods: {
        ...mapActions(["fetchCategoriesTopics", "manageTopic", "deleteTopic"]),
        ...mapMutations([
            "CREATE_CATEGORY",
            "EDIT_CATEGORY",
            "CREATE_TOPIC",
            "EDIT_TOPIC",
            "DELETE_TOPIC",
        ]),
        editItem(identifier) {
            // determine how to populate the modal based on the dataset
            if (this.dataset == "topics") {
                this.selectedItem = this.topicByName(identifier);
            } else {
                this.selectedItem = this.categoryById(identifier);
            }
            this.action = "edit";
            this.addEditShowing = true;
        },
        addItem() {
            // send in empty item for clean add/edit modal
            if (this.dataset == "categories") {
                this.selectedItem = {
                    id: null,
                    name: "",
                    description: "",
                    isActive: 1,
                    sortOrder: 0,
                    displayRealtor: 1,
                };
            } else {
                this.selectedItem = {
                    name: "",
                    description: "",
                    isActive: 1,
                };
            }
            this.action = "add";
            this.addEditShowing = true;
        },
        async onDeleteTopic(topicName) {
            const { response, topicIndex } = await this.deleteTopic(topicName);
            if (response.status == "200") {
                this.$socket.emit("deleteTopic", topicIndex);
            }
        },
    },
    sockets: {
        addCategory(category) {
            this.CREATE_CATEGORY(category);
        },
        editCategory(data) {
            const { category, categoryIndex } = data;
            this.EDIT_CATEGORY({ category, categoryIndex });
        },
        addTopic(topic) {
            this.CREATE_TOPIC(topic);
        },
        editTopic(data) {
            const { topic, topicIndex } = data;
            this.EDIT_TOPIC({ topic, topicIndex });
        },
        deleteTopic(topicIndex) {
            this.DELETE_TOPIC(topicIndex);
        },
    },
    async mounted() {
        // show categoriess immediately if they exist in store
        if (this.allCategories.length > 0) {
            this.tableData = this.allCategories;
            this.storeIsLoading = false;
        }

        await this.fetchCategoriesTopics();
        this.storeIsLoading = false;
    },
};
</script>

<style lang="scss" scoped>
.categoryMgmt {
    padding: 4rem 12rem 12rem;
    .heading {
        font-weight: 800;
    }
    .utilityBar {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin: 4rem 0 1.8rem;
        &__filterContainer {
            margin-left: 25rem;
            span {
                position: relative;
                color: #333;
                font-weight: 700;
                margin-right: 2rem;
                cursor: pointer;
                &.--selected {
                    color: $orange;
                    font-weight: 700;
                    &:after {
                        content: "";
                        position: absolute;
                        bottom: -0.6rem;
                        left: 0;
                        height: 3px;
                        width: 100%;
                        background-color: #f38e36;
                    }
                }
            }
        }
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
        min-height: 640px;
        .status {
            display: inline-block;
            width: 8rem;
            text-align: center;
        }
        .deleteBtn {
            color: $red;
            font-size: 2rem;
            cursor: pointer;
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
::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}

@include slideDownEnter("addEditCategoryTopicModal", 35%, 50%);
</style>
