<template>
    <div class="productReviews">
        <div
            v-if="product"
            class="content"
        >
            <div class="product">
                <img
                    :src="productImage"
                    class="product-image"
                    alt=""
                >
                <div class="details">
                    <h2 class="details__name">{{ product.name }}</h2>
                    <p class="details__category">{{ product.category.name }}</p>
                    <p class="details__assignee">
                        Assignee: <span>{{ product.assignTo.fullName }}</span>
                    </p>
                    <p class="details__status">
                        Status: <span>{{ statusString }}</span>
                    </p>
                </div>
            </div>

            <div class="statCard-container">
                <stat-card
                    class="statCard"
                    heading="Average Star Rating"
                    :stat-value="averageRating"
                />
                <stat-card
                    class="statCard"
                    heading="Total Reviews"
                    :stat-value="reviewCount"
                />
                <stat-card class="statCard">
                    <bar-chart
                        :chart-data="chartData"
                        :options="chartOptions"
                        :height="125"
                    />
                </stat-card>
            </div>

            <div class="reviewsTable">
                <h2 class="heading">Reviews</h2>
                <vue-good-table
                    ref="ordersTable"
                    :columns="tableColumns"
                    :rows="productReviews"
                    styleClass="vgt-table"
                    :pagination-options="{
                        enabled: true,
                        perPageDropdown: [10, 20, 30, 40, 50],
                        dropdownAllowAll: false,
                        mode: 'records'
                    }"
                    :sort-options="{
                        enabled: true
                    }"
                >
                    >
                    <div slot="emptystate">
                        <span class="emptyState">
                            There are no reviews for this product yet.
                        </span>
                    </div>

                    <!-- Dynamic table rows -->
                    <template
                        slot="table-row"
                        slot-scope="props"
                    >
                        <!-- Due date -->
                        <span v-if="props.column.field === 'datetime'">
                            {{ formatDate(props.row.datetime, "MM/DD/YYYY") }}
                        </span>

                        <!-- Star Rating -->
                        <span v-else-if="props.column.field === 'rating'">
                            <star-rating
                                :star-size="starSize"
                                :show-rating="false"
                                :increment="1"
                                :read-only="true"
                                :rating="props.row.rating"
                                active-color="#16af8c"
                                :padding="5"
                            />
                        </span>

                        <!-- Delete -->
                        <span v-else-if="props.column.field === 'delete'">
                            <i
                                class="fas fa-trash-alt"
                                @click="deleteProductReview({
                                        employeeNumber: props.row.employee.employeeNumber,
                                        productId: $route.params.productId
                                    })"
                            >
                            </i>
                        </span>

                        <!-- Fallback renders raw field -->
                        <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                    </template>

                </vue-good-table>
            </div>
        </div>

        <loading-dots
            v-else
            loading-text="Loading product reviews"
        />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
// mixins
import { format } from "@/mixins";

export default {
    name: "ProductReviews",
    mixins: [format],
    components: {
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
        "vue-good-table": () => import("@/components/Shared/Table/Table"),
        "star-rating": () => import("vue-star-rating"),
        "bar-chart": () => import("@/components/Admin/HorizontalBarChart"),
        "stat-card": () => import("@/components/Shared/StatCard"),
    },
    data() {
        return {
            tableColumns: [
                {
                    label: "Date",
                    field: "datetime",
                    width: "120px",
                    tdClass: "date-td",
                    thClass: "date-th",
                },
                {
                    label: "Reviewer",
                    field: "employee.fullName",
                    tdClass: "reviewer-td",
                },
                {
                    label: "Star Rating",
                    field: "rating",
                    tdClass: "rating-td",
                },
                {
                    label: "Review",
                    field: "comment",
                    tdClass: "comment-td",
                },
                {
                    label: "",
                    field: "delete",
                    tdClass: "delete-td",
                    thClass: "delete-th",
                    hidden: true,
                },
            ],
            chartData: {},
            chartOptions: {
                plugins: {
                    datalabels: {
                        color: "#a5a4a4",
                        anchor: "end",
                        align: "end",
                        font: {
                            size: 9,
                        },
                    },
                },
                tooltips: {
                    displayColors: false,
                    position: "nearest",
                    callbacks: {
                        title: () => {
                            return "";
                        },
                    },
                    filter: (tooltipItem) => {
                        return tooltipItem.datasetIndex === 0;
                    },
                },
                layout: {
                    padding: {
                        right: 10,
                    },
                },
                scales: {
                    yAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                            stacked: true,
                        },
                    ],
                    xAxes: [
                        {
                            display: false,
                            ticks: {
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: false,
                            },
                            stacked: true,
                        },
                    ],
                },
                legend: false,
                responsive: true,
                maintainAspectRatio: false,
            },
            windowWidth: window.innerWidth,
        };
    },
    computed: {
        ...mapState(["products", "users"]),
        ...mapGetters(["productById", "productReviewsByProductId"]),
        product() {
            return this.productById(this.$route.params.productId);
        },
        productImage() {
            return this.product.productImages[0].filepaths[0].path;
        },
        statusString() {
            return this.product.isActive == 1 ? "Active" : "Inactive";
        },
        productReviews() {
            return this.productReviewsByProductId(this.$route.params.productId);
        },
        reviewCount() {
            return this.productReviews.length;
        },
        averageRating() {
            try {
                const ratingTotal = this.productReviews
                    .map((review) => review.rating)
                    .reduce(function (a, b) {
                        return a + b;
                    });

                return (ratingTotal / this.reviewCount).toFixed(2);
            } catch {
                return "N/A";
            }
        },
        starSize() {
            if (this.windowWidth > 768) {
                return 20;
            } else {
                return 10;
            }
        },
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
    },
    watch: {
        productReviews() {
            this.fillChartData();
        },
        userIsAdmin(value) {
            if (value == true) {
                this.$set(this.tableColumns[4], "hidden", false);
            }
        },
    },
    methods: {
        ...mapActions([
            "updateProduct",
            "updateProductReviews",
            "deleteProductReview",
        ]),
        fillChartData() {
            // fill dataset 1 data with number of each rating
            let tempData1 = [0, 0, 0, 0, 0];
            this.productReviews.forEach((review) => {
                switch (review.rating) {
                    case 5:
                        tempData1[0] += 1;
                        break;
                    case 4:
                        tempData1[1] += 1;
                        break;
                    case 3:
                        tempData1[2] += 1;
                        break;
                    case 2:
                        tempData1[3] += 1;
                        break;
                    case 1:
                        tempData1[4] += 1;
                        break;
                }
            });
            // fill dataset 2 data with the differences between ratings total and each count
            let tempData2 = [0, 0, 0, 0, 0];
            tempData1.forEach((count, index) => {
                tempData2[index] = this.reviewCount - count;
            });
            this.chartData = {
                labels: ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"],
                datasets: [
                    // represents the bar on top
                    {
                        backgroundColor: "#16af8c",
                        barPercentage: 0.4,
                        data: tempData1,
                    },
                    // represents the bar underneath
                    {
                        backgroundColor: "#e8e8e8",
                        barPercentage: 0.4,
                        data: tempData2,
                    },
                ],
            };
        },
        onResize() {
            this.windowWidth = window.innerWidth;
        },
    },
    async created() {
        // fetch product details
        if (!this.productById(this.$route.params.productId)) {
            // make sure order exists before rendering, if it doesnt redirect to 404
            const response = await this.updateProduct(
                this.$route.params.productId
            );
            if (response.length == 0) {
                this.$router.push("/404");
            } else {
                // fetch product reviews
                this.updateProductReviews(this.$route.params.productId);
            }
        } else {
            // fetch product reviews
            this.updateProductReviews(this.$route.params.productId);
        }
        // fill chart data if we have product reviews on load
        if (this.productReviews) {
            this.fillChartData();
        }
    },
    mounted() {
        // set our resize listner for reactive responsive styles
        this.$nextTick(() => {
            window.addEventListener("resize", this.onResize);
        });
    },
    beforeDestroy() {
        // garbage collection
        window.removeEventListener("resize", this.onResize);
    },
};
</script>

<style lang="scss" scoped>
.productReviews {
    padding: $standard-view;
    width: 85%;
    margin: 0 auto;
    @include breakpoint(desktop) {
        width: 100%;
        padding-left: 4rem;
        padding-right: 4rem;
    }
    @include breakpoint(tablet-port) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
}

.product {
    display: flex;
    align-items: flex-end;
    img {
        margin-right: 2.5rem;
    }
    .details {
        margin-bottom: 1.5rem;
        &__name {
            color: #333;
            font-size: 1.8rem;
            font-weight: 700;
        }
        &__category {
            margin-bottom: 1rem;
            // font-weight: 600;
            color: $gray-mid;
        }
        &__assignee,
        &__status {
            font-size: 1.4rem;
            font-weight: 600;
        }
    }
}

.statCard-container {
    margin-top: 4rem;
    display: flex;
    justify-content: space-between;
    @include breakpoint(tablet-land) {
        flex-wrap: wrap;
    }
    .statCard {
        width: 33%;
        padding: 0.5rem 2rem;
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
        &__heading {
            font-size: 2rem;
            font-weight: 600;
            text-align: center;
            @include breakpoint(ipadPro) {
                font-size: 1.6rem;
                text-align: left;
            }
        }
        &__value {
            display: block;
            margin-top: 2rem;
            text-align: center;
            font-weight: 900;
            font-size: 4rem;
            color: $teal-light;
            @include breakpoint(ipadPro) {
                font-size: 3rem;
                text-align: left;
                margin-top: 1rem;
            }
        }
    }
}

.reviewsTable {
    .heading {
        font-weight: 700;
        margin-bottom: 2rem;
    }
    margin-top: 5rem;
    padding: 4rem;
    box-shadow: $containerShadow;
    @include breakpoint(tablet-land) {
        padding: 0;
        margin-top: 3rem;
        box-shadow: none;
    }
}

::v-deep {
    p.loading {
        text-align: left;
    }
    th {
        @include breakpoint(tablet-land) {
            font-size: 1.4rem;
        }
    }
    .vgt-table td {
        font-weight: 600;
        @include breakpoint(tablet-land) {
            font-size: 1.2rem;
        }
    }
    .comment-td {
        min-width: 315px;
    }
    .date-td,
    .date-th {
        @include breakpoint(ipadPro) {
            display: none;
        }
    }
    .reviewer-td {
        width: 150px;
        @include breakpoint(tablet-port) {
            min-width: 100px;
            max-width: 100px;
        }
    }
    .rating-td {
        width: 160px;
        @include breakpoint(ipadPro) {
            width: 100px;
        }
    }
    .delete-th {
        @include breakpoint(ipadPro) {
            display: none;
        }
    }
    .delete-td {
        color: $red;
        cursor: pointer;
        @include breakpoint(ipadPro) {
            display: none;
        }
    }
}
</style>
