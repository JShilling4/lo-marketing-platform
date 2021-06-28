<template>
    <div class="fieldDetailsMenu">
        <validation-observer ref="fieldObserver">
            <!-- Text Input-->
            <div
                v-if="fieldType == 'text'"
                class="standard"
            >
                <p class="fieldType">{{ action == "edit" ? `Edit ${field.label}` : "Add Text Input" }}</p>
                <!-- Label -->
                <div class="form-group">
                    <label>Label</label>
                    <validation-provider
                        rules="required"
                        name="fieldLabel"
                        v-slot="{ errors }"
                    >
                        <text-input
                            v-focus
                            type="text"
                            v-model="localField.label"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Placeholder -->
                <div class="form-group">
                    <label>Placeholder</label>
                    <text-input
                        type="text"
                        v-model="localField.placeholder"
                    />
                </div>
                <!-- Required -->
                <div class="form-group">
                    <div class="input-group">
                        <checkbox-input
                            label="Required field?"
                            check="1"
                            v-model="localField.required"
                        />
                    </div>
                </div>
            </div>

            <!-- Dropdown/Radio Input -->
            <div
                v-else-if="fieldType == 'dropdown' || fieldType == 'radio'"
                class="optionsInput"
            >
                <p class="fieldType">
                    {{
            action == "edit"
              ? `Edit ${field.label}`
              : `Add ${fieldType == "dropdown" ? "Dropdown" : "Radio Group"}`
          }}
                </p>
                <!-- Label -->
                <div class="form-group">
                    <label>Label</label>
                    <validation-provider
                        rules="required"
                        name="fieldLabel"
                        v-slot="{ errors }"
                    >
                        <text-input
                            v-focus
                            type="text"
                            v-model="localField.label"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Options -->
                <div class="form-group">
                    <label>Options</label>
                    <div
                        v-for="(option, index) in localField.options"
                        :key="option.id"
                        class="option-wrapper"
                    >
                        <text-input
                            v-model="option.value"
                            @keyup.enter.native="addOption"
                            class="option"
                            type="text"
                        />
                        <i
                            v-if="index !== 0"
                            class="fas fa-times deleteOption"
                            @click="deleteOption(index)"
                        ></i>
                    </div>
                    <span
                        class="addOption"
                        @click="addOption"
                    >+ Add option</span>
                </div>
                <!-- Required -->
                <div class="form-group">
                    <div class="input-group">
                        <checkbox-input
                            label="Required field?"
                            check="1"
                            v-model="localField.required"
                        />
                    </div>
                </div>
            </div>

            <!-- Texarea Input-->
            <div
                v-else-if="fieldType == 'textbox'"
                class="textarea"
            >
                <p class="fieldType">{{ action == "edit" ? `Edit ${field.label}` : "Add Text Box" }}</p>
                <!-- Label -->
                <div class="form-group">
                    <label>Label</label>
                    <validation-provider
                        rules="required"
                        name="fieldLabel"
                        v-slot="{ errors }"
                    >
                        <text-input
                            v-focus
                            type="text"
                            v-model="localField.label"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Placeholder -->
                <div class="form-group">
                    <label>Placeholder</label>
                    <text-input
                        type="text"
                        v-model="localField.placeholder"
                    />
                </div>
                <!-- Required -->
                <div class="form-group">
                    <div class="input-group">
                        <checkbox-input
                            label="Required field?"
                            check="1"
                            v-model="localField.required"
                        />
                    </div>
                </div>
            </div>

            <!-- Date Input-->
            <div
                v-else-if="fieldType == 'date'"
                class="file"
            >
                <p class="fieldType">{{ action == "edit" ? `Edit ${field.label}` : "Add Date Input" }}</p>
                <!-- Label -->
                <div class="form-group">
                    <label>Label</label>
                    <validation-provider
                        rules="required"
                        name="fieldLabel"
                        v-slot="{ errors }"
                    >
                        <text-input
                            v-focus
                            type="text"
                            v-model="localField.label"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Required -->
                <div class="form-group">
                    <div class="input-group">
                        <checkbox-input
                            label="Required field?"
                            check="1"
                            v-model="localField.required"
                        />
                    </div>
                </div>
            </div>

            <!-- Build/File upload -->
            <div
                v-else-if="fieldType == 'file'"
                class="file"
            >
                <p class="fieldType">{{ action == "edit" ? `Edit ${field.label}` : "Add File Input" }}</p>
                <!-- Label -->
                <div class="form-group">
                    <label>Label</label>
                    <validation-provider
                        rules="required"
                        name="fieldLabel"
                        v-slot="{ errors }"
                    >
                        <text-input
                            v-focus
                            type="text"
                            v-model="localField.label"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Required -->
                <div class="form-group">
                    <div class="input-group">
                        <checkbox-input
                            label="Required field?"
                            check="1"
                            v-model="localField.required"
                        />
                    </div>
                </div>
            </div>
        </validation-observer>

        <!-- Controls -->
        <div class="buttons-container">
            <app-button
                v-if="action == 'add'"
                classes="btn btn-orange"
                class="btn add"
                @click.native="addField"
                text="Add Field"
            />
            <app-button
                v-else
                classes="btn btn-orange"
                class="btn add"
                @click.native="editField"
                text="Edit Field"
            />
            <app-button
                class="btn btn-black"
                @click.native="$emit('close')"
                text="Cancel"
            />
        </div>
    </div>
</template>

<script>
import TextInput from "@/components/Shared/Inputs/TextInput";
import CheckboxInput from "@/components/Shared/Inputs/CheckboxInput";

let clientId = 0;
export default {
    name: "FieldDetailsMenu",

    components: {
        "text-input": TextInput,
        "checkbox-input": CheckboxInput,
        "app-button": () => import("@/components/Shared/AppButton"),
    },

    props: {
        fieldType: String,
        field: {
            type: Object,
            default() {
                return {
                    /*  if this is an edit, the modal will populate with this object
              because field prop is undefined
          */
                    id: null,
                    cid: ++clientId,
                    type: this.fieldType,
                    placeholder: null,
                    label: "",
                    required: 0,
                    sortOrder: "",
                    value: "",
                    options: [],
                };
            },
        },
        action: String,
    },

    data() {
        return {
            // use JSON to deep copy and keep source intact
            localField: JSON.parse(JSON.stringify({ ...this.field })),
            deletedOptions: [],
        };
    },

    watch: {
        field(newObject) {
            this.localfield = JSON.parse(JSON.stringify({ ...newObject }));
        },
    },

    methods: {
        async addField() {
            const fieldValid = await this.$refs.fieldObserver.validate();
            if (fieldValid) {
                // notify FieldBuilder.vue that a field has been added
                this.$emit("add-field", this.localField);
            }
        },
        async editField() {
            const fieldValid = await this.$refs.fieldObserver.validate();
            if (fieldValid) {
                // notify parent that a field has been edited (send original label for id with local field)
                this.$emit("edit-field", this.localField);
            }
        },
        addOption() {
            // make a new option avaialable in details, set incremented label name
            this.localField.options.push({
                id: `temp ${this.localField.options.length + 1}`,
                value: "",
            });
        },
        deleteOption(index) {
            const deletedOption = this.localField.options.splice(index, 1);
            const { id } = deletedOption[0];
            if (/^\d+$/.test(id)) {
                this.$emit("option-deleted", id);
            }
        },
    },
    mounted() {
        if (this.fieldType == "dropdown" || this.fieldType == "radio") {
            // if this is a field with options and is new, we want to start with min required 2 options
            if (this.field.options.length == 0) {
                this.addOption();
                this.addOption();
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.fieldDetailsMenu {
    position: absolute;
    top: 0;
    left: 9rem;
    z-index: 3;
    padding: 1rem 0;
    box-shadow: $dropdownShadow;
    font-size: 14px;
    width: 30rem;
    padding: 2rem;
    background-color: #fff;
    .buttons-container {
        display: flex;
        justify-content: space-between;
    }
}
.multiselect-wrapper {
    height: 3.6rem;
}
.fieldType {
    color: $orange;
    font-weight: 600;
    font-size: 1.6rem;
    margin-bottom: 1rem;
}
.optionsInput {
    .option-wrapper {
        position: relative;
    }
    .option {
        margin-bottom: 0.5rem;
    }
    .addOption {
        display: block;
        font-size: 1.2rem;
        margin-top: 0.5rem;
        color: $gray-dark;
        cursor: pointer;
        &:hover {
            color: $teal-light;
        }
    }
    .deleteOption {
        position: absolute;
        right: 1rem;
        top: 1.3rem;
        color: $gray;
        cursor: pointer;
        &:hover {
            color: $red;
        }
    }
}

.input-group {
    margin-right: 2rem;
    label {
        font-weight: normal;
        margin-left: 0.5rem;
        margin-bottom: 0;
        font-size: 12px;
        line-height: 1.5;
    }
}
input {
    font-size: 1.2rem;
}
input[type="checkbox"] {
    width: 16px;
}
</style>
