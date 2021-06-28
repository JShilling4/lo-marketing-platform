<template>
    <div class="fieldBuilder">
        <!-- Dynamic field list -->
        <div class="fieldHolder">
            <draggable
                v-model="localFormFields"
                @start="dragging = true"
                @update="updateFieldOrder"
            >
                <div
                    v-for="(field, index) in localFormFields"
                    :key="field.sortOrder"
                    class="form-group"
                >
                    <label>
                        {{ field.label }}
                        <i
                            v-if="field.required == 1"
                            class="fas fa-asterisk asterisk"
                        ></i>
                    </label>

                    <!-- Text input -->
                    <text-input
                        v-if="field.type == 'text'"
                        :placeholder="field.placeholder"
                        :isDisabled="true"
                    />

                    <!-- Dropdown -->
                    <div
                        v-if="field.type == 'dropdown'"
                        class="multiselect-wrapper"
                    >
                        <multi-select
                            label="value"
                            selectLabel=""
                            deselectLabel=""
                            :preserve-search="true"
                            :options="field.options"
                            :taggable="false"
                        />
                    </div>

                    <!-- Radio input -->
                    <div v-if="field.type == 'radio'" class="input-group">
                        <radio-input
                            v-for="option in field.options"
                            :key="option.id"
                            :check="option.value"
                            v-model="field.value"
                            :label="option.value"
                            :isDisabled="true"
                            :name="field.label.split(' ').join('')"
                        />
                    </div>

                    <!-- Text Box -->
                    <text-area
                        v-if="field.type == 'textbox'"
                        value=""
                        :placeholder="field.placeholder"
                        :isDisabled="true"
                    />

                    <!-- File input -->
                    <single-file-input
                        v-if="field.type == 'file'"
                        :field="field"
                        buttonText="Upload"
                        :isDisabled="true"
                        :showFileName="false"
                    />

                    <!-- Date input -->
                    <date-time-picker
                        v-if="field.type == 'date'"
                        color="#f38e36"
                        :no-label="true"
                        :only-date="true"
                        label="Select date"
                        :no-weekends-days="true"
                    />

                    <div class="field-controls">
                        <i
                            class="fas fa-edit editIcon"
                            @click="openDetailsMenu(field.type, field)"
                        ></i>
                        <i
                            class="fas fa-trash-alt deleteIcon"
                            @click="removeField(index)"
                        ></i>
                    </div>
                </div>
            </draggable>
        </div>

        <field-details-menu
            v-if="fieldEditorOpen && idMatches(selectedField)"
            :field-type="selectedField.type"
            :field="selectedField"
            :action="action"
            @add-field="onAddField"
            @edit-field="onEditField"
            @option-deleted="onDeletedFormFieldOption"
            @close="fieldEditorOpen = false"
        />

        <!-- Add field -->
        <div v-if="product.isDownload == 0" class="addField">
            <p class="label">Add Field</p>
            <i class="fas fa-plus icon" @click="openOptionsMenu"></i>
            <field-options-menu
                v-if="fieldOptionsOpen"
                @close="fieldOptionsOpen = false"
                @change="openDetailsMenu($event, undefined)"
            />
            <field-details-menu
                v-if="fieldDetailsOpen"
                :field-type="selectedFieldType"
                :field="selectedField"
                :action="action"
                @add-field="onAddField"
                @edit-field="onEditField"
                @option-deleted="onDeletedFormFieldOption"
                @close="fieldDetailsOpen = false"
            />
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import Multiselect from "vue-multiselect";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import FieldOptionsMenu from "@/components/Admin/ProductManagement/FieldOptionsMenu";
import FieldDetailsMenu from "@/components/Admin/ProductManagement/FieldDetailsMenu";
import TextInput from "@/components/Shared/Inputs/TextInput";
import RadioInput from "@/components/Shared/Inputs/RadioInput";
import TextArea from "@/components/Shared/Inputs/TextArea";
import SingleFileInput from "@/components/Shared/Inputs/SingleFileInput";

export default {
    name: "FieldBuilder",

    components: {
        draggable,
        "field-options-menu": FieldOptionsMenu,
        "field-details-menu": FieldDetailsMenu,
        "text-input": TextInput,
        "multi-select": Multiselect,
        "date-time-picker": VueCtkDateTimePicker,
        "radio-input": RadioInput,
        "text-area": TextArea,
        "single-file-input": SingleFileInput,
    },

    props: {
        product: Object,
    },

    data() {
        return {
            dragging: false,
            fieldOptionsOpen: false,
            fieldDetailsOpen: false,
            fieldEditorOpen: false,
            selectedFieldType: "",
            selectedField: undefined,
            action: "",
            localFormFields: [],
        };
    },

    watch: {
        product() {
            this.localFormFields = this.product.formFields;
        }
    },

    methods: {
        openOptionsMenu() {
            // close details modal when opening options modal
            this.fieldDetailsOpen = false;
            this.fieldOptionsOpen = true;
        },
        openDetailsMenu(type, field) {
            // destroy modals to refresh data
            this.fieldDetailsOpen = false;
            this.fieldEditorOpen = false;
            this.fieldOptionsOpen = false;
            /* set field props (if this is an edit, selectedField will carry an object. If it is
      an add, it will carry undefined to trigger default values) */
            this.selectedFieldType = type;
            this.selectedField = field;
            // set action prop so the details modal knows how to build itself
            if (field) {
                this.action = "edit";
                this.fieldEditorOpen = true;
            } else {
                this.action = "add";
                this.fieldDetailsOpen = true;
            }
        },
        onAddField(field) {
            // child FieldDetailsMenu.vue passed up a local field to be added, update the view
            this.localFormFields.push(field);
            // send the user back to options
            this.openOptionsMenu();
            this.updateFieldOrder();
            this.reportFieldChange();
        },
        onEditField(localField) {
            let index;
            // find the correct field to edit by id (or cid if new field), splice local field in for reactivity
            if (localField.id == null) {
                index = this.localFormFields.findIndex(
                    (field) => field.cid == localField.cid
                );
            } else {
                index = this.localFormFields.findIndex(
                    (field) => field.id == localField.id
                );
            }

            this.localFormFields.splice(index, 1, localField);
            this.reportFieldChange();
            // field as been edited, we can close the details
            this.fieldDetailsOpen = false;
            this.fieldEditorOpen = false;
        },
        idMatches(field) {
            if (field.id == null) {
                return field.cid == this.selectedField.cid;
            }
            return field.id == this.selectedField.id;
        },
        removeField(index) {
            const deletedField = this.localFormFields.splice(index, 1);
            const { id } = deletedField[0];
            if (id !== null) {
                this.$emit("field-deleted", id);
            }
            this.reportFieldChange();
        },
        updateFieldOrder() {
            // update sortOrders based on drag and drop position
            this.localFormFields.forEach((field, index) => {
                field.sortOrder = index;
            });
            this.reportFieldChange();
        },
        reportFieldChange() {
            this.$emit("field-changed", this.localFormFields);
        },
        onDeletedFormFieldOption(optionId) {
            this.$emit("option-deleted", optionId);
        },
    },

    mounted() {
        this.localFormFields = this.product.formFields;
    },
};
</script>

<style lang="scss" scoped>
.fieldBuilder {
    position: relative;
}
.fieldHolder {
    label {
        color: $orange;
        padding-right: 5rem;
    }
    .form-group {
        position: relative;
        padding: 1rem;
        border: 1px solid $orange;
        border-radius: 5px;
        .field-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            .fas {
                font-size: 14px;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            .deleteIcon {
                color: $gray;
                margin-left: 1rem;
                &:hover {
                    color: $red;
                }
            }
            .editIcon {
                color: $gray;
                &:hover {
                    color: $linkBlue;
                }
            }
        }
    }
}
.label {
    color: #616161;
    font-weight: 600;
    font-size: 14px;
}
.addField {
    position: relative;
    display: inline-block;
    margin-top: 2rem;
    .icon {
        display: block;
        color: $teal-light;
        text-align: center;
        border-radius: 50%;
        border: 2px solid $teal-light;
        height: 30px;
        width: 30px;
        line-height: 27px;
        margin: 0.5rem auto 0;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
        &:hover {
            color: #fff;
            background-color: $teal-light;
        }
    }
}
</style>
