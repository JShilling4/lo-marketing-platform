<template>
    <div class="reports">
        <h1 class="heading">Reports</h1>

        <!-- Date Range -->
        <div class="dateRange">
            <date-time-picker
                color="#16af8c"
                id="dateRange"
                :no-label="true"
                formatted="MM/DD/YYYY"
                label="Select date range"
                :only-date="true"
                :auto-close="true"
                :no-weekends-days="true"
                :range="true"
                @input="dateRangeChanged()"
                v-model="dateRange"
            />
        </div>

        <!-- Stat Cards -->
        <div class="statCard-container">
            <stat-card
                class="statCard"
                heading="Average Product Rating"
                :stat-value="averageProductRating"
            />
            <stat-card
                class="statCard"
                heading="All Orders"
                :stat-value="allOrders"
            />
            <stat-card
                class="statCard"
                heading="Completed Orders"
                :stat-value="completedOrders"
            />
        </div>

        <div class="reports-container">
            <!-- Leaderboard & Order Status PieChart -->
            <div class="report-row-1">
                <marketing-leaderboard
                    class="leaderboard"
                    :is-loading="leaderboardIsLoading"
                />

                <order-status-chart
                    class="orderStatus-chart"
                    :is-loading="orderStatusChartIsLoading"
                />
            </div>

            <!-- Orders by category -->
            <div class="report-row-2">
                <orders-by-category />
            </div>

            <!-- Report cards -->
            <div class="reportCard-container">
                <!-- Most popular products -->
                <report-card
                    class="reportCard"
                    heading="Most Popular Products"
                    :is-loading="popularProductsAreLoading"
                    :list="popularProducts"
                    @export="exportReport('mostPopularProducts')"
                >
                    <template #controls>
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group">
                                    <radio-input
                                        check="orderCount"
                                        name="popularProductsBy"
                                        id="orderCount"
                                        labelFor="orderCount"
                                        label="Order Count"
                                        v-model="orderPopularProductsBy"
                                    />
                                </div>
                                <div class="input-group">
                                    <radio-input
                                        check="starRating"
                                        name="popularProductsBy"
                                        id="starRating"
                                        labelFor="starRating"
                                        label="Star Rating"
                                        v-model="orderPopularProductsBy"
                                    />
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #list>
                        <ul>
                            <li
                                v-for="(
                                    product, index
                                ) in topTenPopularProducts"
                                :key="index"
                                class="item"
                                @click="goToProduct(product.id)"
                            >
                                {{ index + 1 }}. {{ product.name }}
                                <span class="accent">
                                    ({{
                                        orderPopularProductsBy == "orderCount"
                                            ? product.orderCount
                                            : product.averageRating.toFixed(2)
                                    }})
                                </span>
                            </li>
                        </ul>
                    </template>
                </report-card>

                <!-- Top orders by employee -->
                <report-card
                    class="reportCard"
                    heading="Top Orders By LO/LOA"
                    :is-loading="topOrdersByEmployeeAreLoading"
                    :list="mostActiveEmployees"
                    @export="exportReport('mostActiveEmployees')"
                >
                    <template #controls>
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group">
                                    <radio-input
                                        check="orderedFor"
                                        name="topOrdersByEmployee"
                                        id="orderedFor"
                                        labelFor="orderedFor"
                                        label="Ordered For"
                                        v-model="mostActiveEmployeesBy"
                                    />
                                </div>
                                <div class="input-group">
                                    <radio-input
                                        check="orderedBy"
                                        name="topOrdersByEmployee"
                                        id="orderedBy"
                                        labelFor="orderedBy"
                                        label="Ordered By"
                                        v-model="mostActiveEmployeesBy"
                                    />
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #list>
                        <ul>
                            <li
                                v-for="(
                                    employee, index
                                ) in topTenActiveEmployees"
                                :key="index"
                                class="item"
                                @click="goToEmployee(employee.id)"
                            >
                                {{ index + 1 }}. {{ employee.fullName }}
                                <span class="accent">
                                    ({{
                                        mostActiveEmployeesBy == "orderedFor"
                                            ? employee.orderForCount
                                            : employee.orderByCount
                                    }})
                                </span>
                            </li>
                        </ul>
                    </template>
                </report-card>

                <!-- Top orders by branch -->
                <report-card
                    class="reportCard"
                    heading="Top Orders By Branch"
                    :is-loading="topOrdersByBranchAreLoading"
                    :list="mostActiveBranches"
                    @export="exportReport('mostActiveBranches')"
                >
                    <template #list>
                        <ul>
                            <li
                                v-for="(branch, index) in topTenActiveBranches"
                                :key="index"
                                class="item"
                            >
                                {{ index + 1 }}. {{ branch.name }}
                                <span class="accent">
                                    ({{ branch.orderCount }})
                                </span>
                            </li>
                        </ul>
                    </template>
                </report-card>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import api from "@/store/api";
import moment from "moment";

export default {
    name: "admin-reports",
    components: {
        "stat-card": () => import("@/components/Shared/StatCard"),
        "marketing-leaderboard": () =>
            import("@/components/Admin/Reports/MarketingLeaderboard"),
        "report-card": () => import("@/components/Admin/Reports/ReportCard"),
        "date-time-picker": () => import("vue-ctk-date-time-picker"),
        "radio-input": () => import("@/components/Shared/Inputs/RadioInput"),
        "order-status-chart": () =>
            import("@/components/Admin/Reports/OrderStatusChart"),
        "orders-by-category": () =>
            import("@/components/Admin/Reports/OrdersByCategory"),
    },
    data() {
        return {
            weeklyOrders: 29,
            weeklyCompletedOrders: 18,
            dateRange: {
                start: moment().subtract(30, "days"),
                end: moment(),
            },
            orderPopularProductsBy: "orderCount", // starRating or orderCount
            mostActiveEmployeesBy: "orderedFor", // orderedFor or orderedBy
            leaderboardIsLoading: false,
            orderStatusChartIsLoading: false,
            popularProductsAreLoading: false,
            popularCategoriesAreLoading: false,
            topOrdersByEmployeeAreLoading: false,
            topOrdersByBranchAreLoading: false,
        };
    },
    computed: {
        ...mapState(["reports"]),
        ...mapGetters([
            "popularProductsByRating",
            "popularProductsByOrderCount",
            "mostActiveEmployeesByOrderedBy",
            "mostActiveEmployeesByOrderedFor",
        ]),
        popularProducts() {
            if (this.orderPopularProductsBy == "orderCount") {
                return this.popularProductsByOrderCount;
            }
            return this.popularProductsByRating;
        },
        mostActiveEmployees() {
            if (this.mostActiveEmployeesBy == "orderedFor") {
                return this.mostActiveEmployeesByOrderedFor;
            }
            return this.mostActiveEmployeesByOrderedBy;
        },
        mostActiveBranches() {
            return this.reports.mostActiveBranches;
        },
        topTenPopularProducts() {
            return this.popularProducts.slice(0, 10);
        },
        topTenActiveEmployees() {
            return this.mostActiveEmployees.slice(0, 10);
        },
        topTenActiveBranches() {
            return this.mostActiveBranches.slice(0, 10);
        },
        validDateRange() {
            return (
                this.dateRange != null &&
                this.dateRange?.start != null &&
                this.dateRange?.end != null
            );
        },
        completedOrders() {
            return (
                this.reports.orderStatusCounts.find(
                    (count) => count.status == "Completed"
                )?.count || 0
            );
        },
        allOrders() {
            try {
                return this.reports.orderStatusCounts.reduce(
                    (accum, item) => accum + Number(item.count),
                    0
                );
            } catch {
                return "N/A";
            }
        },
        averageProductRating() {
            if (this.popularProductsByRating.length > 0) {
                return parseFloat(
                    this.popularProductsByRating.reduce(
                        (acc, curr) => acc + curr.averageRating,
                        0
                    ) / this.popularProductsByRating.length
                ).toFixed(2);
            }
            return "N/A";
        },
    },
    methods: {
        ...mapActions([
            "fetchOrderLeaderboard",
            "fetchPopularProducts",
            "fetchPopularCategories",
            "fetchOrderStatusCounts",
            "fetchCategories",
            "fetchMostActiveEmployees",
            "fetchMostActiveBranches",
        ]),
        exportReport(report) {
            switch (report) {
                case "mostPopularProducts": {
                    api.reports
                        .exportPopularProducts({
                            startDate: this.dateRange.start,
                            endDate: this.dateRange.end,
                        })
                        .then((response) => {
                            if (response.status == "200") {
                                const { data } = response;
                                const link = document.createElement("a");
                                link.href = data.file;
                                link.click();
                            }
                        })
                        .catch((error) => {});
                    break;
                }
                case "mostActiveEmployees": {
                    api.reports
                        .exportMostActiveEmployees({
                            startDate: this.dateRange.start,
                            endDate: this.dateRange.end,
                        })
                        .then((response) => {
                            if (response.status == "200") {
                                const { data } = response;
                                const link = document.createElement("a");
                                link.href = data.file;
                                link.click();
                            }
                        })
                        .catch((error) => {});
                    break;
                }
                case "mostActiveBranches": {
                    api.reports
                        .exportMostActiveBranches({
                            startDate: this.dateRange.start,
                            endDate: this.dateRange.end,
                        })
                        .then((response) => {
                            if (response.status == "200") {
                                const { data } = response;
                                const link = document.createElement("a");
                                link.href = data.file;
                                link.click();
                            }
                        })
                        .catch((error) => {});
                    break;
                }
            }
        },
        getPopularProducts() {
            if (this.validDateRange) {
                this.popularProductsAreLoading = true;
                this.fetchPopularProducts({
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                    orderBy: "orderCount",
                }).then(() => (this.popularProductsAreLoading = false));
            }
        },
        getPopularCategories() {
            if (this.validDateRange) {
                this.popularCategoriesAreLoading = true;
                this.fetchPopularCategories({
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                }).then(() => (this.popularCategoriesAreLoading = false));
            }
        },
        getEmployeeLeaderboard() {
            if (this.validDateRange) {
                this.leaderboardIsLoading = true;
                this.fetchOrderLeaderboard({
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                }).then(() => (this.leaderboardIsLoading = false));
            }
        },
        getMostActiveBranches() {
            if (this.validDateRange) {
                this.topOrdersByBranchAreLoading = true;
                this.fetchMostActiveBranches({
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                }).then(() => (this.topOrdersByBranchAreLoading = false));
            }
        },
        getMostActiveEmployees() {
            if (this.validDateRange) {
                this.topOrdersByEmployeeAreLoading = true;
                this.fetchMostActiveEmployees({
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                }).then(() => (this.topOrdersByEmployeeAreLoading = false));
            }
        },
        getOrderStatusCounts() {
            if (this.validDateRange) {
                this.orderStatusChartIsLoading = true;
                this.fetchOrderStatusCounts({
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                }).then(() => (this.orderStatusChartIsLoading = false));
            }
        },
        dateRangeChanged() {
            this.$router.replace({
                name: "reports",
                query: {
                    ...this.$route.query,
                    from: moment(this.dateRange.start).format("YYYY-MM-DD"),
                    to: moment(this.dateRange.end).format("YYYY-MM-DD"),
                },
            });
            this.refreshReports();
        },
        refreshReports() {
            this.getEmployeeLeaderboard();
            this.getPopularProducts();
            this.getOrderStatusCounts();
            this.getPopularCategories();
            this.getMostActiveEmployees();
            this.getMostActiveBranches();
        },
        goToProduct(productId) {
            this.$router.push(`/product/${productId}`);
        },
        goToEmployee(employeeId) {
            this.$router.push(`/admin/user-management/edit-user/${employeeId}`);
        },
    },
    mounted() {
        // read query strings and handle filters as needed
        const queryFromDate = this.$route.query.from;
        const queryToDate = this.$route.query.to;

        if (queryFromDate && queryToDate) {
            this.dateRange.start = moment(queryFromDate).format("YYYY-MM-DD");
            this.dateRange.end = moment(queryToDate).format("YYYY-MM-DD");
        }

        this.refreshReports();
    },
};
</script>

<style lang="scss" scoped>
.reports {
    padding: $standard-view;
    max-width: 1500px;
    margin: 0 auto;
}
.dateRange {
    width: 20rem;
    margin-top: 2rem;
}
.statCard-container {
    margin-top: 4rem;
    display: flex;
    justify-content: space-between;
    @include breakpoint(tablet-land) {
        flex-wrap: wrap;
    }
    .statCard {
        width: 28%;
        padding: 2rem 2rem;
        box-shadow: $containerShadow;
        @include breakpoint(tablet-land) {
            width: 100%;
            box-shadow: none;
            padding: 0;
        }
        &:nth-of-type(1),
        &:nth-of-type(2) {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 3rem;
            @include breakpoint(tablet-land) {
                margin-right: 0;
                margin-bottom: 2rem;
            }
        }
    }
}
.reports-container {
    margin-top: 6rem;
    .report-row-1 {
        display: flex;
        justify-content: space-between;
        height: 535px;
    }
    .report-row-2 {
        margin-top: 6rem;
    }
    .leaderboard {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        width: 40%;
        padding: 2rem;
        background-color: #fff;
        box-shadow: $containerShadow;
    }
    .orderStatus-chart {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        width: 40%;
        padding: 2rem;
        background-color: #fff;
        box-shadow: $containerShadow;
    }
    .reportCard-container {
        margin-top: 6rem;
        display: flex;
        justify-content: space-between;
        .reportCard {
            display: flex;
            flex-direction: column;
            width: 28%;
            padding: 2rem 4rem;
            background-color: #fff;
            box-shadow: $containerShadow;
        }
        .item {
            padding: 1rem 0;
            font-size: 1.4rem;
            cursor: pointer;
            transition: color 0.3s;
            &:hover {
                color: $orange;
            }
            .accent {
                color: $gray;
            }
        }
        ul {
            margin-bottom: 2rem;
        }
    }
}
</style>
