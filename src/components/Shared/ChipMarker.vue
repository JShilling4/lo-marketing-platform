<template>
    <span class="chipMarker">
        {{ name }}
        <span
            class="remover"
            @click="$emit('remove-chip')"
        ><i class="fas fa-times-circle"></i></span>
    </span>
</template>

<script>
export default {
    name: "ChipMarker",
    props: {
        name: String,
        id: Number,
    },
};
</script>

<style lang="scss" scoped>
.chipMarker {
    color: #fff;
    background-color: $gray-dark;
    font-size: 12px;
    padding: 0.5rem 0.5rem 0.3rem 1rem;
    border-radius: 15rem;
    margin: 0 0.5rem 1.5rem;
    .remover {
        margin-left: 1rem;
        font-size: 14px;
        cursor: pointer;
    }
}
</style>
