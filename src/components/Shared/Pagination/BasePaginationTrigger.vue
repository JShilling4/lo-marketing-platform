<template>
    <span
        class="paginationNum"
        @click="onClick"
    >
        {{ pageNumber }}
    </span>
</template>

<script>
export default {
    props: {
        pageNumber: {
            type: Number,
            required: true,
        },
    },
    methods: {
        onClick() {
            this.$emit("loadPage", this.pageNumber);
        },
    },
};
</script>

<style lang="scss" scoped>
.paginationNum {
    margin: 0 1.5rem;
    color: $gray;
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
    &.--current {
        color: $teal-light;
        transform: scale(1.2);
    }
}
</style>
