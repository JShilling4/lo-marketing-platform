<template>
    <div class="toggleSwitch">
        <span
            class="switchLabel"
            :class="{'--on': switchOn}"
        >{{ label }}</span>
        <label class="switch">
            <input
                type="checkbox"
                @input="toggleChanged"
            />
            <span class="slider round"></span>
        </label>
    </div>
</template>

<script>
export default {
    name: "ToggleSwitch",
    props: {
        label: {
            type: String,
            required: true,
        },
        switchOn: Boolean,
    },
    methods: {
        toggleChanged() {
            this.$emit("change");
        },
    },
};
</script>

<style lang="scss" scoped>
.toggleSwitch {
    display: flex;
    align-items: center;
    .switchLabel {
        color: $gray;
        font-size: 12px;
        margin-right: 0.75rem;
        transition: color 0.3s;
        &.--on {
            color: $teal-light;
        }
    }
}
.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    margin-bottom: 0;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.3s;
}

input:checked + .slider {
    background-color: $teal-light;
}

input:focus + .slider {
    box-shadow: 0 0 1px $teal-light;
}

input:checked + .slider:before {
    transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
