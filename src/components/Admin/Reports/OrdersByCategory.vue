<template>
	<div>
        <h2>Orders By Category</h2>
		<vertical-bar-chart
			:chart-data="chartData"
			:options="chartOptions"
		/>
	</div>
</template>

<script>
import { mapState } from "vuex";
import VerticalBarChart from "@/components/Admin/VerticalBarChart";

export default {
	name: "OrdersByCategory",
	components: {
		VerticalBarChart,
	},
	data() {
		return {
			chartOptions: {
				tooltips: {
                    displayColors: false,
					callbacks: {
						label: (tooltipItems, data) => {
							return `${tooltipItems.value} Orders`;
						},
					},
				},
				scales: {
					yAxes: [
						{
                            ticks: {
                                display: false,
                                beginAtZero: true,
                            },
							gridLines: {
								display: false,
							},
						},
					],
					xAxes: [
						{
							gridLines: {
								display: false,
							},
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
		chartData() {
			return {
				labels: this.categories.map((category) => category.name),
				datasets: [
					{
						categoryPercentage: .75,
						barPercentage: 0.5,
						backgroundColor: "#16af8c",
						data: this.categories.map((category) => category.total),
					},
				],
			};
		},
        categories() {
            return this.reports.popularCategories;
        }
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
</style>