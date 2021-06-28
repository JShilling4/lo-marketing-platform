<template>
	<div class="leaderboard">
		<h2>Employee Order Leaderboard</h2>

		<!-- Legend -->
		<div class="chartLegend">
			<div class="item">
				<span class="color"></span>
				<span class="label">Open Orders</span>
			</div>
			<div class="item">
				<span class="color"></span>
				<span class="label">Completed Orders</span>
			</div>
		</div>

		<!-- Chart -->
		<div class="chart-container">
			<transition name="fadeInOut" mode="out-in" appear>
				<bar-chart
					v-if="leaderboard.length > 0 && !isLoading"
					:chart-data="chartData"
					:options="chartOptions"
				/>

                <loading-dots v-else-if="isLoading" loading-text="Fetching data" />
                <p v-else class="noData">No data for this date range</p>
			</transition>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "MarketingLeaderboard",
	components: {
		"bar-chart": () => import("@/components/Admin/HorizontalBarChart"),
		"loading-dots": () => import("@/components/Shared/LoadingDots"),
	},
	props: {
		isLoading: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			chartData: {},
			chartOptions: {
				tooltips: {
					enabled: true,
					callbacks: {
						label: (tooltipItems, data) => {
							return tooltipItems.datasetIndex == 0
								? `Open - ${tooltipItems.value}`
								: `Completed - ${tooltipItems.value}`;
						},
					},
				},
				layout: {
					padding: {
						right: 50,
					},
				},
				scales: {
					yAxes: [
						{
							gridLines: {
								display: false,
							},
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
		};
	},
	computed: {
		...mapState(["reports"]),
		leaderboard() {
			const sortedBoard = [
				...this.reports.orderLeaderboard,
			].sort((a, b) => (a.completedOrders < b.completedOrders ? 1 : -1));
			return sortedBoard;
		},
		employeeNames() {
			return this.leaderboard.map((employee) => employee.fullName);
		},
		openOrders() {
			return this.leaderboard.map((employee) => employee.openOrders);
		},
		completedOrders() {
			return this.leaderboard.map((employee) => employee.completedOrders);
		},
	},
	watch: {
		employeeNames() {
			this.fillChartData();
		},
	},
	methods: {
		fillChartData() {
			this.chartData = {
				labels: this.employeeNames,
				datasets: [
					{
						categoryPercentage: 0.75,
						barPercentage: 0.6,
						backgroundColor: "#f38e36",
						data: this.openOrders,
						stack: 1,
					},
					{
						backgroundColor: "#16af8c",
						categoryPercentage: 0.75,
						barPercentage: 0.6,
						data: this.completedOrders,
						stack: 2,
					},
				],
			};
		},
	},
	mounted() {
		this.fillChartData();
	},
};
</script>

<style lang="scss" scoped>
h2 {
	margin-bottom: 2rem;
	font-size: 2.6rem;
	font-weight: normal;
	text-align: center;
	@include breakpoint(ipadPro) {
		font-size: 1.6rem;
		text-align: left;
	}
}
.chart-container {
	max-height: 40rem;
    width: 80%;
    margin: 0 auto;
	overflow-y: hidden;
	margin-bottom: auto;
}
.chartLegend {
	display: flex;
	justify-content: center;
	margin-bottom: 2rem;
	.item {
		margin: 0 2rem;
		font-size: 1.2rem;
		color: $gray-mid;
		&:nth-of-type(1) {
			.color {
				background-color: $orange;
			}
		}
		&:nth-of-type(2) {
			.color {
				background-color: $teal-light;
			}
		}
		.color {
			display: inline-block;
			height: 10px;
			width: 15px;
			margin-right: 0.5rem;
		}
	}
}
.noData {
    color: $gray;
}
</style>
