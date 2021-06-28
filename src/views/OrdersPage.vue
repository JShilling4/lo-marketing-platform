<template>
    <div
        id="ordersPage"
        class="orders"
    >
        <div>
            <!-- Order scope filter -->
            <div class="orders-header">
                <h2 class="orders-header__text">{{ orderScope }}</h2>
                <img
                    v-if="userIsAdmin"
                    class="orders-header__toggle"
                    src="@/assets/images/dropdown_icon_green.png"
                    alt
                />
                <div
                    v-if="userIsAdmin"
                    class="orders-header__dropdown"
                >
                    <ul>
                        <li
                            :class="{ '--active': orderScope == 'My Orders' }"
                            @click="toggleOrderScope('My Orders')"
                        >
                            My Orders
                        </li>
                        <li
                            :class="{ '--active': orderScope == 'All Orders' }"
                            @click="toggleOrderScope('All Orders')"
                        >
                            All Orders
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Table Bar -->
            <div class="tableBar">
                <i
                    :class="[
                        'fas',
                        'fa-filter',
                        'filterToggle',
                        { 'filterToggle--active': filterMenuToggled }
                    ]"
                    @click="filterMenuToggled = !filterMenuToggled"
                ></i>

                <div
                    v-if="filterMenuShowing"
                    class="filterGroup"
                >
                    <!-- Search -->
                    <div class="search">
                        <i class="fas fa-search"></i>
                        <input
                            type="search"
                            v-model="searchQuery"
                            @input="searchFilterChanged"
                        />
                    </div>
                    <!-- Broad Filter -->
                    <ul class="broadFilter">
                        <li
                            class="broadFilter__item"
                            :class="{ 'broadFilter__item--active': broadFilter === 'open' }"
                            @click="toggleBroadFilter('open')"
                        >
                            Open
                        </li>
                        <li
                            class="broadFilter__item"
                            :class="{ 'broadFilter__item--active': broadFilter === 'following' }"
                            @click="toggleBroadFilter('following')"
                        >
                            Following
                        </li>
                        <li
                            class="broadFilter__item"
                            :class="{ 'broadFilter__item--active': broadFilter === 'all' }"
                            @click="toggleBroadFilter('all')"
                        >
                            All
                        </li>
                    </ul>
                    <!-- Narrow Filters -->
                    <ul class="narrowFilter">
                        <!-- Status -->
                        <li class="narrowFilter__type">
                            <div class="multiselect-wrapper">
                                <div class="form-group">
                                    <div class="label-wrapper">
                                        <label>Status</label>
                                        <app-button
                                            v-if="selectedStatus !== null"
                                            classes="btn btn-orange"
                                            text="Clear"
                                            @click.native="clearFilter('status')"
                                        />
                                    </div>
                                    <multi-select
                                        :class="{ activeFilter: selectedStatus !== null }"
                                        v-model="selectedStatus"
                                        :options="orders.statuses"
                                        placeholder="Select status"
                                        label=""
                                        selectLabel=""
                                        selectedLabel=""
                                        deselectLabel=""
                                        @input="statusFilterChanged"
                                    />
                                </div>
                            </div>
                        </li>

                        <!-- Assignee -->
                        <li class="narrowFilter__type">
                            <div class="multiselect-wrapper">
                                <div class="form-group">
                                    <div class="label-wrapper">
                                        <label>Assignee</label>
                                        <app-button
                                            v-if="selectedAssignee !== null"
                                            classes="btn btn-orange"
                                            text="Clear"
                                            @click.native="clearFilter('assignee')"
                                        />
                                    </div>
                                    <multi-select
                                        :class="{ activeFilter: selectedAssignee !== null }"
                                        v-model="selectedAssignee"
                                        :options="sortedMarketingEmployees"
                                        placeholder="Select employee"
                                        track-by="employeeNumber"
                                        label="fullName"
                                        selectLabel=""
                                        selectedLabel=""
                                        deselectLabel=""
                                        @input="assigneeFilterChanged"
                                    />
                                </div>
                            </div>
                        </li>

                        <!-- Category -->
                        <li class="narrowFilter__type">
                            <div class="multiselect-wrapper">
                                <div class="form-group">
                                    <div class="label-wrapper">
                                        <label>Category</label>
                                        <app-button
                                            v-if="selectedCategory !== null"
                                            classes="btn btn-orange"
                                            text="Clear"
                                            @click.native="clearFilter('category')"
                                        />
                                    </div>
                                    <multi-select
                                        :class="{ activeFilter: selectedCategory !== null }"
                                        v-model="selectedCategory"
                                        label="name"
                                        track-by="id"
                                        selectLabel=""
                                        selectedLabel=""
                                        placeholder="Select category"
                                        deselectLabel=""
                                        :preserve-search="true"
                                        :options="allCategoriesSorted"
                                        @input="categoryFilterChanged"
                                    />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Orders Table -->
            <transition
                v-if="!storeIsLoading"
                name="fadeInOut"
                appear
            >
                <div class="resultsTable">
                    <vue-good-table
                        ref="ordersTable"
                        :columns="columns"
                        :rows="ordersByOrderDatetimeAsc"
                        @on-row-click="openOrderFromTable($event.row)"
                        :row-style-class="rowStyleClassFn"
                        styleClass="vgt-table"
                        :disable-checkbox="!clearToBulkUpdate"
                        :pagination-options="{
                            enabled: true,
                            perPageDropdown: [10, 20, 30, 40, 50],
                            dropdownAllowAll: false,
                            mode: 'records'
                        }"
                        :sort-options="{
                            enabled: true
                        }"
                        :select-options="{
                            enabled: userIsAdmin && windowWidth > 1023 ? true : false,
                            selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                            selectionInfoClass: 'table-selection-bar',
                            selectionText: 'selected',
                        }"
                    >
                        >
                        <div slot="emptystate">
                            <span class="emptyState">There are no orders meeting the current criteria.</span>
                        </div>
                        <!-- Table selection bar -->
                        <div
                            slot="selected-row-actions"
                            class="bulk-update-input-row"
                        >
                            <div class="input-wrapper">
                                <multi-select
                                    :class="{ activeFilter: selectedAssignee !== null }"
                                    v-model="bulkUpdateAssignedTo"
                                    :options="sortedMarketingEmployees"
                                    placeholder="Edit Assignee"
                                    track-by="employeeNumber"
                                    label="fullName"
                                    selectLabel=""
                                    selectedLabel=""
                                    deselectLabel=""
                                />
                            </div>

                            <div class="input-wrapper">
                                <multi-select
                                    :class="{ activeFilter: selectedStatus !== null }"
                                    v-model="bulkUpdateStatus"
                                    :options="orders.statuses"
                                    placeholder="Edit Status"
                                    label=""
                                    selectLabel=""
                                    selectedLabel=""
                                    deselectLabel=""
                                />
                            </div>

                            <div class="input-wrapper">
                                <date-time-picker
                                    v-model="bulkUpdateDueDate"
                                    color="#16af8c"
                                    formatted="MM/DD/YYYY"
                                    format="YYYY-MM-DD"
                                    :only-date="true"
                                    label="Edit Due Date"
                                    :no-label="true"
                                    :no-button-now="true"
                                    :auto-close="true"
                                />
                            </div>

                            <app-button
                                classes="btn btn-white"
                                @click.native="bulkUpdate()"
                                text="Update"
                            />

                        </div>
                        <!-- Dynamic table rows -->
                        <template
                            slot="table-row"
                            slot-scope="props"
                        >
                            <!-- Status -->
                            <span v-if="props.column.field === 'status'">
                                <span
                                    class="status status--orders"
                                    :class="parseOrderStatus(props.row.status)"
                                >
                                    {{ props.row.status }}
                                </span>
                            </span>
                            <!-- Ordered By -->
                            <span v-else-if="props.column.field === 'orderedBy.fullName'">
                                <span v-if="
                                        props.row.orderedBy.fullName !==
                                            props.row.orderedFor.fullName
                                    ">
                                    {{ props.row.orderedBy.fullName }}
                                </span>
                            </span>
                            <!-- Due date -->
                            <span v-else-if="props.column.field === 'dueDate'">
                                {{ formatDate(props.row.dueDate, "MM-DD-YY") }}
                            </span>
                            <!-- Fallback renders raw field -->
                            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                        </template>
                    </vue-good-table>
                </div>
            </transition>
            <loading-dots
                v-else
                loading-text="Loading orders"
            />
        </div>
    </div>
</template>

<script>
// dependencies
import { mapGetters, mapActions, mapState } from "vuex";
import moment from "moment";
// components
import VueGoodTable from "@/components/Shared/Table/Table";
import Multiselect from "vue-multiselect";
// mixins
import { format, parse, buildNotification } from "@/mixins";

export default {
    name: "orders-page",
    mixins: [format, parse, buildNotification],
    components: {
        "multi-select": Multiselect,
        "vue-good-table": VueGoodTable,
        "app-button": () => import("@/components/Shared/AppButton"),
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
        "date-time-picker": () => import("vue-ctk-date-time-picker"),
    },

    data() {
        return {
            // orders
            selectedOrderNumber: null,
            columns: [
                {
                    label: "Order #",
                    field: "id",
                    type: "number",
                    thClass: "num-left-align",
                    tdClass: "num-left-align",
                },
                {
                    label: "Product",
                    field: "product.name",
                    thClass: "th-product",
                    tdClass: "td-product",
                },
                {
                    label: "Ordered By",
                    field: "orderedBy.fullName",
                    thClass: "th-orderedBy",
                    tdClass: "td-orderedBy",
                },
                {
                    label: "Ordered For",
                    field: "orderedFor.fullName",
                    thClass: "th-orderedFor",
                    tdClass: "td-orderedFor",
                },
                {
                    label: "Due Date",
                    field: "dueDate",
                    thClass: "th-dueDate",
                    tdClass: "td-dueDate",
                },
                {
                    label: "Assigned To",
                    field: "assignedTo.fullName",
                },
                {
                    label: "Status",
                    field: "status",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align",
                },
            ],
            baseOrders: [],
            filteredOrders: [],
            // scope and sort
            orderScope: "My Orders",
            // chips
            chips: [],
            // filters
            searchQuery: "",
            broadFilter: "open",
            selectedCategory: null,
            selectedStatus: null,
            selectedAssignee: null,
            // bulk update
            bulkUpdateDueDate: null,
            bulkUpdateAssignedTo: null,
            bulkUpdateStatus: null,
            clearToBulkUpdate: false,
            // misc
            windowWidth: window.innerWidth,
            filterMenuToggled: false,
            storeIsLoading: true,
        };
    },

    computed: {
        ...mapGetters([
            "allOrders",
            "orderById",
            "allTopics",
            "productById",
            "ordersByActiveUser",
            "allCategories_short",
            "marketingEmployeeById",
            "categoryByName",
        ]),
        ...mapState(["users", "orders"]),
        userIsAdmin() {
            try {
                return this.users.activeUser.userRoles.includes(
                    "ROLE_MARKETING_EMPLOYEE"
                );
            } catch (error) {
                /* shhhh */
            }
            return false;
        },
        activeUser() {
            try {
                return this.users.activeUser;
            } catch (error) {
                return undefined;
            }
        },
        filterMenuShowing() {
            if (this.windowWidth > 1000) {
                return true;
            }
            if (this.windowWidth < 1000 && this.filterMenuToggled) {
                return true;
            }
            return false;
        },
        ordersByOrderDatetimeAsc() {
            return this.filteredOrders
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.orderedDatetime) -
                        new Date(a.orderedDatetime)
                );
        },
        allCategoriesSorted() {
            return this.allCategories_short
                .slice()
                .sort((a, b) => (a.name > b.name ? 1 : -1));
        },
        sortedMarketingEmployees() {
            return this.users.marketingEmployees
                .slice()
                .sort((a, b) => (a.fullName > b.fullName ? 1 : -1));
        },
    },

    methods: {
        ...mapActions([
            "fetchOrders",
            "bulkUpdateOrders",
            "fetchMarketingEmployees",
            "fetchCategoriesTopics",
            "createOrderActivity",
            "postNotification",
            "createNotification",
            "updateOrder",
        ]),
        async bulkUpdate() {
            // payload scaffold
            let payload = {
                assignedTo: this.bulkUpdateAssignedTo,
                status: this.bulkUpdateStatus,
                dueDate: this.bulkUpdateDueDate,
                orderIds: [],
            };

            // get the order Ids from the selected rows
            const rows = this.$refs["ordersTable"].selectedRows;
            payload.orderIds = rows.map((row) => row.id);

            // send the bulk update request
            const response = await this.bulkUpdateOrders(payload);
            if (response.status == "200") {
                // shorten activeUser properties for use in building our objects
                const { employeeNumber, email, fullName } = this.activeUser;
                // form the statusChange object that will be used in our payloads
                const statusChangeObj = {
                    id: null,
                    note: `${fullName} changed the status to "${payload.status}".`,
                    datetime: moment().format(),
                    employee: {
                        employeeNumber,
                        email,
                        fullName,
                    },
                };
                // bulk update success, loop the orders to post activity feed & notifications
                payload.orderIds.forEach(async (id) => {
                    const [order] = await this.updateOrder(id);
                    // status
                    if (payload.status !== null) {
                        // fire socket event & build notification
                        if (this.$socket) {
                            this.$socket.emit("updateOrderStatus", {
                                orderId: order.id,
                                newStatus: payload.status,
                                statusChange: statusChangeObj,
                            });
                        }
                        // build & post activity feed item
                        this.createOrderActivity({
                            orderId: order.id,
                            activity: statusChangeObj,
                        });

                        // build & post notification
                        this.buildNotification(
                            this.activeUser,
                            order,
                            "status"
                        );
                    }

                    // assignedTo
                    if (payload.assignedTo !== null) {
                        const assignmentChangeObj = {
                            id: Math.round(Math.random() * 100000),
                            note: `${this.activeUser.fullName} assigned the order to ${payload.assignedTo.fullName}.`,
                            datetime: moment().format(),
                            employee: {
                                employeeNumber: this.activeUser.employeeNumber,
                                email: this.activeUser.email,
                                fullName: this.activeUser.fullName,
                            },
                        };
                        // update connected clients
                        if (this.$socket) {
                            this.$socket.emit("updateAssignee", {
                                orderId: order.id,
                                newAssignee: payload.assignedTo,
                                assignmentChange: assignmentChangeObj,
                            });
                        }
                        // post the activity feed item
                        this.createOrderActivity({
                            orderId: order.id,
                            activity: assignmentChangeObj,
                        });
                        // post the notification
                        this.buildNotification(
                            this.activeUser,
                            order,
                            "assign"
                        );
                        // the API added assignee as follower, post it to the store
                        if (
                            !order.followers.some(
                                (follower) =>
                                    follower.employeeNumber ==
                                    order.assignedTo.employeeNumber
                            )
                        ) {
                            const followerObj = {
                                fullName: order.assignedTo.fullName,
                                email: order.assignedTo.email,
                                employeeNumber: order.assignedTo.employeeNumber,
                            };
                            const orderIndex = this.orderIndexById(order.id);
                            this.ADD_FOLLOWER({
                                orderIndex,
                                follower: followerObj,
                            });
                        }
                    }

                    // due date
                    if (payload.dueDate !== null) {
                        const dueDateChangeObj = {
                            id: Math.round(Math.random() * 100000),
                            note: `${
                                this.activeUser.fullName
                            } changed the due date to ${moment(
                                payload.dueDate
                            ).format("MM-DD-YY")}.`,
                            datetime: moment().format(),
                            employee: {
                                employeeNumber: this.activeUser.employeeNumber,
                                email: this.activeUser.email,
                                fullName: this.activeUser.fullName,
                            },
                        };
                        // check this is a new due date & post if true

                        // update was successful, push to connected clients
                        if (this.$socket) {
                            this.$socket.emit("updateDueDate", {
                                orderId: order.id,
                                newDueDate: moment(payload.dueDate).format(),
                                dueDateChange: dueDateChangeObj,
                            });
                        }
                        // post the activity feed item
                        this.createOrderActivity({
                            orderId: order.id,
                            activity: dueDateChangeObj,
                        });
                        // build and post the notification
                        this.buildNotification(
                            this.activeUser,
                            order,
                            "dueDate"
                        );
                    }
                });
            }
            this.filterOrders(); // update the table
            // reset inputs
            this.bulkUpdateDueDate = null;
            this.bulkUpdateAssignedTo = null;
            this.bulkUpdateStatus = null;
        },
        filterOrders() {
            // reset to base
            this.filteredOrders = JSON.parse(
                JSON.stringify([...this.baseOrders])
            );

            // apply order scope filter
            if (this.orderScope == "My Orders") {
                if (this.userIsAdmin) {
                    const matches = this.baseOrders.filter(
                        (order) =>
                            order.assignedTo.employeeNumber ==
                                this.activeUser.employeeNumber ||
                            order.orderedFor.employeeNumber ==
                                this.activeUser.employeeNumber ||
                            order.orderedBy.employeeNumber ==
                                this.activeUser.employeeNumber ||
                            order.followers.find(
                                (follower) =>
                                    follower.employeeNumber ==
                                    this.activeUser.employeeNumber
                            )
                    );
                    this.filteredOrders = matches;
                } else {
                    const matches = this.baseOrders.filter(
                        (order) =>
                            order.orderedFor.employeeNumber ==
                                this.activeUser.employeeNumber ||
                            order.orderedBy.employeeNumber ==
                                this.activeUser.employeeNumber
                    );
                    this.filteredOrders = matches;
                }
            }
            // apply broad filter (open/completed/following/all)
            switch (this.broadFilter) {
                case "open": {
                    this.filteredOrders = this.filteredOrders.filter(
                        (order) => order.status !== "Completed"
                    );
                    break;
                }
                case "following": {
                    this.filteredOrders = this.filteredOrders.filter((order) =>
                        order.followers.some(
                            (follower) =>
                                follower.employeeNumber ==
                                this.activeUser.employeeNumber
                        )
                    );
                    break;
                }
                default: {
                    break;
                }
            }
            // apply order status filter
            if (this.selectedStatus !== null) {
                this.filteredOrders = this.filteredOrders.filter(
                    (order) => order.status == this.selectedStatus
                );
            }
            // apply assignee filter
            if (this.selectedAssignee !== null) {
                this.filteredOrders = this.filteredOrders.filter(
                    (order) =>
                        order.assignedTo.employeeNumber ==
                        this.selectedAssignee.employeeNumber
                );
            }
            // apply category filter
            if (this.selectedCategory !== null) {
                this.filteredOrders = this.filteredOrders.filter(
                    (order) =>
                        order.product.category.id == this.selectedCategory.id
                );
            }

            if (this.searchString !== "") {
                const regExp = new RegExp(this.searchQuery, "gi");
                const check = (obj) => {
                    if (obj !== null && typeof obj === "object") {
                        return Object.values(obj).some(check);
                    }
                    if (Array.isArray(obj)) {
                        return obj.some(check);
                    }
                    return (
                        (typeof obj === "string" || typeof obj === "number") &&
                        regExp.test(obj)
                    );
                };
                this.filteredOrders = this.filteredOrders.filter(check);
            }
        },
        getProductName(id) {
            const product = this.productById(id);
            return product.name;
        },
        onResize() {
            this.windowWidth = window.innerWidth;
        },
        openOrderFromTable(row) {
            this.$router.push({ path: `/orders/${row.id}` });
        },
        rowStyleClassFn() {
            return "VGT-row";
        },
        selectedOrder(orderNum) {
            // package row fields into our data object to send into modal
            return this.orderById(orderNum);
        },
        statusFilterChanged() {
            this.$router.replace({
                name: "orders",
                query: {
                    ...this.$route.query,
                    status: this.selectedStatus,
                },
            });
            this.filterOrders();
        },
        assigneeFilterChanged() {
            this.$router.replace({
                name: "orders",
                query: {
                    ...this.$route.query,
                    assignee:
                        this.selectedAssignee !== null
                            ? this.selectedAssignee.employeeNumber
                            : "",
                },
            });
            this.filterOrders();
        },
        categoryFilterChanged() {
            this.$router.replace({
                name: "orders",
                query: {
                    ...this.$route.query,
                    category:
                        this.selectedCategory !== null
                            ? this.selectedCategory.name
                            : "",
                },
            });
            this.filterOrders();
        },
        searchFilterChanged() {
            if (this.$route.query.search !== this.searchQuery) {
                this.$router.replace({
                    name: "orders",
                    query: {
                        ...this.$route.query,
                        search: this.searchQuery,
                    },
                });
                this.filterOrders();
            }
        },
        clearFilter(filter) {
            switch (filter) {
                case "status": {
                    this.selectedStatus = null;
                    this.statusFilterChanged();
                    break;
                }
                case "assignee": {
                    this.selectedAssignee = null;
                    this.assigneeFilterChanged();
                    break;
                }
                case "category": {
                    this.selectedCategory = null;
                    this.categoryFilterChanged();
                    break;
                }
                default: {
                    break;
                }
            }
        },
        toggleOrderScope(selected) {
            this.orderScope = selected;
            if (this.$route.query.scope !== this.orderScope) {
                this.$router.replace({
                    name: "orders",
                    query: {
                        ...this.$route.query,
                        scope: this.orderScope,
                    },
                });
            }
            this.filterOrders();
        },
        toggleBroadFilter(selected) {
            this.broadFilter = selected;
            if (this.$route.query.broadFilter !== this.broadFilter) {
                this.$router.replace({
                    name: "orders",
                    query: {
                        ...this.$route.query,
                        broadFilter: this.broadFilter,
                    },
                });
            }
            this.filterOrders();
        },
        async setFiltersByQueryStrings(
            queryScope,
            queryBroadFilter,
            queryStatus,
            queryAssignee,
            queryCategory,
            querySearch
        ) {
            if (queryScope) {
                if (queryScope == "All Orders" || queryScope == "My Orders") {
                    this.orderScope = queryScope;
                }
            }
            if (queryBroadFilter) {
                this.broadFilter = queryBroadFilter.toLowerCase();
            }
            if (queryStatus) {
                this.selectedStatus = queryStatus;
            }
            if (queryAssignee) {
                if (!this.marketingEmployeeById(Number(queryAssignee))) {
                    await this.fetchMarketingEmployees();
                }
                this.selectedAssignee = await this.marketingEmployeeById(
                    Number(queryAssignee)
                );
            }
            if (queryCategory) {
                if (!this.categoryByName(queryCategory)) {
                    await this.fetchCategoriesTopics();
                }
                this.selectedCategory = await this.categoryByName(
                    queryCategory
                );
            }
            if (querySearch) {
                this.searchQuery = querySearch.toLowerCase();
            }
            this.filterOrders();
        },
    },

    async mounted() {
        this.fetchMarketingEmployees();
        this.fetchCategoriesTopics();
        // read query strings and handle filters as needed
        const queryScope = this.$route.query.scope || this.$route.query.Scope;
        const queryBroadFilter =
            this.$route.query.broadFilter || this.$route.query.BroadFilter;
        const queryStatus =
            this.$route.query.status || this.$route.query.Status;
        const queryAssignee =
            this.$route.query.assignee || this.$route.query.Assignee;
        const queryCategory =
            this.$route.query.category || this.$route.query.Category;
        const querySearch =
            this.$route.query.search || this.$route.query.Search;
        const queryStringPresent =
            queryScope ||
            queryBroadFilter ||
            queryStatus ||
            queryAssignee ||
            queryCategory ||
            querySearch;

        // show orders immediately if they exist in store
        if (this.allOrders.length > 0) {
            this.baseOrders = this.allOrders;
            this.setFiltersByQueryStrings(
                queryScope,
                queryBroadFilter,
                queryStatus,
                queryAssignee,
                queryCategory,
                querySearch
            );
            this.filterOrders();
            this.storeIsLoading = false;
        }
        // if orders were not in store, render the results after store is populated
        await this.fetchOrders();
        this.baseOrders = this.allOrders;
        this.storeIsLoading = false;

        if (!queryStringPresent) {
            this.filterOrders();
        } else {
            this.setFiltersByQueryStrings(
                queryScope,
                queryBroadFilter,
                queryStatus,
                queryAssignee,
                queryCategory,
                querySearch
            );
        }
        this.clearToBulkUpdate = true;
        // set our resize listner for reactive responsive styles
        this.$nextTick(() => {
            window.addEventListener("resize", this.onResize);
        });
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },
};
</script>

<style lang="scss" scoped>
@import "~@/scss/components/searchInput";
@import "~@/scss/components/bulkUpdateTableBar";

.orders {
    padding: $standard-view;
    @include breakpoint(desktop) {
        padding-left: 4rem;
        padding-right: 4rem;
    }
    @include breakpoint(tablet-port) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
}
.orders-header {
    position: relative;
    display: flex;
    align-items: center;
    width: 17rem;
    margin-top: -1rem;
    padding: 1rem 0;
    cursor: default;
    &:hover .orders-header__dropdown {
        display: block;
    }
    &__text {
        color: $teal-light;
        font-weight: 800;
    }
    &__toggle {
        margin-left: 0.8rem;
        height: 0.6rem;
    }
    &__dropdown {
        display: none;
        position: absolute;
        top: 4rem;
        left: 0;
        width: 16rem;
        padding: 1.5rem;
        background-color: #fff;
        box-shadow: $dropdownShadow;
        z-index: 100;

        li {
            color: $gray;
            cursor: pointer;
            &:not(:last-child) {
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid $gray;
            }
            &:hover {
                color: $teal-light;
                font-weight: 600;
            }
            &.--active {
                color: $teal-light;
                font-weight: 600;
            }
        }
    }
}
.tableBar {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    .filterToggle {
        display: none;
        margin-left: 1rem;
        @include breakpoint(laptop) {
            display: block;
        }
        &--active {
            color: $orange;
        }
    }
}
.filterGroup {
    display: flex;
    align-items: flex-end;
    width: 100%;
    margin-top: -2rem;
    @include breakpoint(laptop) {
        position: absolute;
        left: 10rem;
        z-index: 11;
        flex-direction: column;
        align-items: flex-start;
        padding: 2rem;
        width: 23rem;
        background-color: rgba(0, 0, 0, 0.85);
    }
    .search {
        @include breakpoint(laptop) {
            margin-bottom: 2rem;
        }
        input {
            max-width: 19rem;
        }
    }
    .broadFilter {
        display: flex;
        margin-left: 4rem;
        @include breakpoint(laptop) {
            display: block;
            margin-left: 0;
            padding: 1rem 0;
            width: 19rem;
            border-top: 1px solid $gray;
            border-bottom: 1px solid $gray;
        }
        &__item {
            color: $gray;
            font-weight: 600;
            cursor: pointer;
            &:not(:last-child) {
                margin-right: 6rem;
                @include breakpoint(laptop) {
                    margin-right: 0;
                    margin-bottom: 1rem;
                }
            }
            &--active {
                color: $teal-light;
            }
        }
    }
    .narrowFilter {
        display: flex;
        align-items: center;
        margin-left: auto;
        @include breakpoint(laptop) {
            margin-left: 0;
            padding-top: 1rem;
            flex-direction: column;
        }
        &__type {
            position: relative;
            display: flex;
            align-items: center;
            margin-left: 3rem;
            @include breakpoint(laptop) {
                margin-left: 0;
                &:not(:last-child) {
                    margin-bottom: 1.5rem;
                }
            }
        }
        label {
            color: $orange;
            font-weight: 600;
        }
        .multiselect-wrapper {
            height: 5.6rem;
            max-width: 15rem;
            width: 15rem;
            white-space: nowrap;
            .label-wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .btn {
                    font-size: 10px;
                    padding: 2px 10px;
                    min-width: unset;
                    margin: 0 0 0.5rem 1rem;
                }
            }
            .activeFilter ::v-deep .multiselect__tags {
                border: 1px solid $orange;
            }
            @include breakpoint(laptop) {
                max-width: 19rem;
                width: 19rem;
            }
        }
    }
}
.resultsTable {
    margin-top: 2rem;

    // v-deep to bypass scope and reach 3rd party table
    ::v-deep {
        th {
            @include breakpoint(mobile) {
                font-size: 12px;
            }
        }
        td {
            font-weight: 600;
        }
        tr.clickable {
            @include breakpoint(mobile) {
                font-size: 14px;
            }
        }
        .th-orderedBy,
        .td-orderedBy,
        .th-orderedFor,
        .td-orderedFor {
            @include breakpoint(desktop) {
                display: none;
            }
        }
        .th-dueDate,
        .td-dueDate {
            @include breakpoint(laptop) {
                display: none;
            }
        }
        .th-product,
        .td-product {
            @include breakpoint(tablet-land) {
                display: none;
            }
        }
        .status {
            @include breakpoint(mobile) {
                min-width: 14.5rem;
            }
            @include breakpoint(mobile-small) {
                min-width: 10.5rem;
                font-size: 8px;
            }
        }
        .emptyState {
            font-weight: 600;
        }
    }
    .eyeIcon {
        color: $gray-mid;
        font-size: 22px;
        &:hover {
            color: $teal-light;
        }
    }
}

::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}
</style>
