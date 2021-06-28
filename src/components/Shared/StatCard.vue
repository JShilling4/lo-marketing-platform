<template>
    <div>
        <slot>
            <h2 class="statCard__heading">{{ heading }}</h2>
            <span class="statCard__value">{{ statValue }}</span>
        </slot>
    </div>
</template>

<script>
export default {
    name: "StatCard",
    props: {
        heading: {
            type: String,
        },
        statValue: {
            type: [String, Number],
        },
    },
};
</script>

<style lang="scss" scoped>
.statCard {
    &__heading {
        font-size: 2rem;
        font-weight: normal;
        text-align: center;
        @include breakpoint(ipadPro) {
            font-size: 1.6rem;
            text-align: left;
        }
    }
    &__value {
        display: block;
        margin-top: 1.5rem;
        text-align: center;
        font-weight: 800;
        font-size: 4rem;
        color: $teal-light;
        @include breakpoint(ipadPro) {
            font-size: 3rem;
            text-align: left;
            margin-top: 1rem;
        }
    }
}
</style>