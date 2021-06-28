<template>
    <div class="checkbox-group">
        <label class="checkbox-label">
            <input
                type="checkbox"
                :checked="check == value"
                :name="name"
                :id="id"
                :disabled="disabled"
                @change="$emit('input', Number($event.target.checked))"
            />
            <span class="checkbox-custom"></span>
        </label>
        <label
            :for="labelFor"
            class="checkbox-group__label"
        >{{ label }}</label>
    </div>
</template>

<script>
export default {
    name: "CheckboxInput",
    props: {
        value: [String, Number, Boolean],
        disabled: Boolean,
        name: String,
        label: String,
        id: String,
        labelFor: String,
        check: [String, Number, Boolean],
    },
};
</script>

<style lang="scss" scoped>
label {
    font-weight: normal;
    margin: 0 0 0 0.5rem;
}
.checkbox-group {
    display: flex;
    align-items: center;
    &__label {
        margin-right: 1.5rem;
    }
}
.checkbox-label {
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 13px;
    height: 16px;
    width: 16px;
    clear: both;
    margin-left: 0;
    .checkbox-custom {
        position: absolute;
        top: -1px;
        left: 0px;
        height: 16px;
        width: 16px;
        background-color: transparent;
        border-radius: 3px;
        transition: all 0.15s ease;
        border: 1px solid $gray;
    }
    input:checked ~ .checkbox-custom {
        background-color: #ffffff;
        border-radius: 3px;
        transform: rotate(0deg) scale(1);
        opacity: 1;
        border: 1px solid $gray;
    }
    .checkbox-custom::after {
        position: absolute;
        content: "";
        left: 7px;
        top: 7px;
        height: 0px;
        width: 0px;
        border-radius: 3px;
        border: solid $teal-light;
        border-width: 0 2px 2px 0;
        transform: rotate(0deg) scale(0);
        opacity: 1;
        transition: all 0.15s ease;
    }
    input:checked ~ .checkbox-custom::after {
        transform: rotate(45deg) scale(1);
        opacity: 1;
        left: 5px;
        top: 0px;
        width: 2px;
        height: 9px;
        border: solid $teal-light;
        border-width: 0 2px 2px 0;
        background-color: transparent;
        border-radius: 0;
    }
}
input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 16px;
    height: 16px;
}
</style>
