<template>
    <textarea
        class="textArea"
        :name="name"
        :placeholder="placeholder"
        v-model="localValue"
        :disabled="isDisabled"
    />
</template>

<script>
export default {
    name: "TextArea",
    props: {
        value: {
            type: [String],
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        localValue: {
            get() {
                return this.value;
            },
            set(localValue) {
                if (localValue == null) {
                    localValue = "";
                }
                this.$emit("input", localValue);
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.textArea {
    background-color: #fff;
    outline: none;
    height: 10rem;
    resize: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    &:focus {
        border: 1px solid $teal-light;
    }
}
</style>
