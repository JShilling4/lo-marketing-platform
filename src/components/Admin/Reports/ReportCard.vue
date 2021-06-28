<template>
	<div :style="styleObject">
		<h2 class="heading">
			{{ heading }}
		</h2>

		<slot name="controls"></slot>

		<transition name="fadeInOut" mode="out-in">
            <slot v-if="!isLoading" name="list"></slot>
			<loading-dots v-if="isLoading" loading-text="Fetching data" />
		</transition>
        <p v-if="list.length < 1" class="noData">No data for this date range</p>

		<app-button classes="btn btn-orange control" text="Create Report" @click.native="$emit('export')" />
	</div>
</template>

<script>
export default {
	name: "ReportCard",
	components: {
		"app-button": () => import("@/components/Shared/AppButton"),
		"loading-dots": () => import("@/components/Shared/LoadingDots"),
	},
    data() {
        return {
            styleObject: {
                minHeight: this.minHeight,
            }
        };
    },
	props: {
		heading: {
			type: String,
			default: "Placeholder Heading",
		},
		list: {
			type: Array,
			default() {
				return [];
			},
		},
        isLoading: {
            type: Boolean,
            default: false,
        },
        minHeight: {
            type: String,
            default: "585px",
        }
	},
};
</script>

<style lang="scss" scoped>
.heading {
	margin-bottom: 2rem;
	font-size: 2.6rem;
	font-weight: 500;
	text-align: center;
	color: $teal-light;
	@include breakpoint(ipadPro) {
		font-size: 1.6rem;
		text-align: left;
	}
}

button {
	display: block;
	margin: auto auto 1rem;
}

.noData {
    color: $gray;
}
</style>