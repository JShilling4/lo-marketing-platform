<template>
	<div>
		<h2>Order Status Chart</h2>
		<div
			v-if="chartData.datasets"
			class="chart-wrapper"
		>
			<doughnut-chart
				:height="300"
				:chart-data="chartData"
				:options="options"
			/>
		</div>
		<div v-else>
			<loading-dots loading-text="Analyzing order history" />
		</div>
		<span class="openOrders">{{ openOrders }} Open Orders</span>
	</div>
</template>

<script>
import { mapState } from "vuex";
import DoughnutChart from "@/components/Admin/DoughnutChart";
import LoadingDots from "@/components/Shared/LoadingDots";

export default {
	name: "OrderStatusChart",
	components: {
		"doughnut-chart": DoughnutChart,
		"loading-dots": LoadingDots,
	},

	data() {
		return {
			options: {
				legend: false,
				responsive: true,
				maintainAspectRatio: false,
				cutoutPercentage: 50,
				plugins: {
					datalabels: {
						// hide datalabels for all datasets
						display: false,
					},
				},
                "onClick": (evt, item) => {
                    this.$router.push(`/orders?scope=All Orders&broadFilter=all&status=${item[0]._model.label.trim()}`)
                }
			},
		};
	},
	computed: {
		...mapState(["reports"]),
		orderStatusCounts() {
			return this.reports.orderStatusCounts;
		},
		chartData() {
			return {
				labels: [
					" Assigned",
					" In Progress",
					" Needs Information",
					" Needs Approval",
					" Delayed",
					" Ordered",
					" Needs Ordered",
					" Needs Revision",
					" Approved",
                    " Commented"
				],
				datasets: [
					{
						backgroundColor: [
							"#0aa1ee",
							"#f38e36",
							"#a760e5",
							"#e83953",
							"#e560dd",
							"#f4c02f",
							"#16d6c6",
							"#0062ff",
							"#00b84f",
                            "#621ba5"
						],
						borderColor: "#fff",
						// Data to be represented on y-axis
						data: [
							this.orderStatusCounts.find(
								(count) => count.status == "Assigned"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "In Progress"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Needs Information"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Needs Approval"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Delayed"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Ordered"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Needs Ordered"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Needs Revision"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Approved"
							)?.count || 0,
							this.orderStatusCounts.find(
								(count) => count.status == "Commented"
							)?.count || 0,
						],
					},
				],
			};
		},
		openOrders() {
			return this.orderStatusCounts
				.filter((count) => count.status !== "Completed")
				.reduce((acc, curr) => acc + Number(curr.count), 0);
		},
	},
	methods: {},
	async mounted() {},
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
.openOrders {
	display: block;
	margin: auto 0 4rem;
	color: $teal-light;
	font-weight: 600;
	font-size: 2.7rem;
	text-align: center;
}
.chart-wrapper {
	margin: auto 0;
}
</style>
