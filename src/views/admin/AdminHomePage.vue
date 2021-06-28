<template>
    <div class="adminHomePage">
        <h1 class="heading">Admin Home</h1>
        <div class="totals-container">
            <totals-card
                label="Average Star Rating"
                value=""
            />
            <totals-card
                label="Order Total (Day)"
                :value="ordersPlaced('day')"
            />
            <totals-card
                label="Order Total (Week)"
                :value="ordersPlaced('week')"
            />
            <totals-card
                label="Orders Completed (Day)"
                :value="ordersCompleted('day')"
            />
            <totals-card
                label="Orders Completed (Week)"
                :value="ordersCompleted('week')"
            />
        </div>

        <div class="reports-container">
            <div class="report-container">
                <order-status-chart />
            </div>

            <div class="report-container report-container--activity">
                <order-activity-feed :order-activities="allOrderActivity" />
            </div>

            <div class="report-container">
                <marketing-leaderboard />
            </div>

            <div class="report-container">
                <average-toc />
            </div>
        </div>

        <div class="employeeCard-container">
            <employee-card
                v-for="employee in allMarketingEmployees"
                :key="employee.employeeNumber"
                :employee="employee"
            />

            <div class="cardFiller"></div>
            <div class="cardFiller"></div>
            <div class="cardFiller"></div>
            <div class="cardFiller"></div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TotalsCard from "@/components/Admin/Home/TotalsCard";
import OrderStatusChart from "@/components/Admin/Home/OrderStatusChart";
import OrderActivityFeed from "@/components/Admin/Home/OrderActivityFeed";
import MarketingLeaderboard from "@/components/Admin/Home/MarketingLeaderboard";
import AverageTOC from "@/components/Admin/Home/AverageTOC";
import EmployeeCard from "@/components/Admin/Home/EmployeeCard";

export default {
    name: "AdminHomePage",
    components: {
        "totals-card": TotalsCard,
        "order-status-chart": OrderStatusChart,
        "order-activity-feed": OrderActivityFeed,
        "marketing-leaderboard": MarketingLeaderboard,
        "average-toc": AverageTOC,
        "employee-card": EmployeeCard,
    },
    computed: {
        ...mapGetters([
            "ordersPlaced",
            "ordersCompleted",
            "allOrderActivity",
            "allMarketingEmployees",
        ]),
    },
    methods: {
        ...mapActions(["fetchMarketingEmployees"]),
    },
    created() {
        this.fetchMarketingEmployees();
    },
};
</script>

<style lang="scss" scoped>
.adminHomePage {
    padding: 4rem 0;
    max-width: 1260px;
    margin: 0 auto;
}
.totals-container {
    display: flex;
    justify-content: space-between;
    margin-top: 4rem;
}

.reports-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 8rem;
}
.report-container {
    width: 57rem;
    height: 50rem;
    overflow-y: auto;
    margin: 0 0 6rem;
    box-shadow: $dropdownShadow;
    scrollbar-color: #a7a7a7 #f1f1f1;
    scrollbar-width: thin;
    -ms-overflow-style: auto;
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background: #ffffff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: $gray-light;
        border-radius: 10px;
        border: 1px solid $gray;
    }
}
.employeeCard-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 2rem;
    .cardFiller {
        width: 15%;
        height: 322px;
        margin: 0 2rem 6rem;
    }
}
</style>
