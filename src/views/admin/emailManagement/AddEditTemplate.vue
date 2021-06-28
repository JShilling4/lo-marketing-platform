<template>
    <div class="addEditTemplate">
        <ValidationObserver
            ref="observer"
            tag="form"
            @submit.prevent="handleSubmit()"
        >
            <!-- Active template? -->
            <div class="form-group">
                <label for="">Active Template?</label>
                <div class="input-group">
                    <div class="input-group">
                        <radio-input
                            type="radio"
                            :check="1"
                            name="isActive"
                            id="activeYes"
                            labelFor="activeYes"
                            label="Yes"
                            v-model="localTemplate.isActive"
                        />
                    </div>
                    <div class="input-group">
                        <radio-input
                            type="radio"
                            :check="0"
                            name="isActive"
                            id="activeNo"
                            labelFor="activeNo"
                            label="No"
                            v-model="localTemplate.isActive"
                        />
                    </div>
                </div>
            </div>
            <!-- Template name -->
            <div class="form-group">
                <label>Template Name</label>
                <ValidationProvider
                    name="templateName"
                    rules="required"
                    v-slot="{ errors }"
                >
                    <text-input
                        type="text"
                        v-model="localTemplate.name"
                    />
                    <span class="errorMessage">{{ errors[0] }}</span>
                </ValidationProvider>
            </div>
            <!-- HTML -->
            <!-- Header -->
            <div class="inline-group">
                <div class="form-group">
                    <label for="">HTML Head</label>
                    <ValidationProvider
                        name="htmlHead"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <text-area v-model="localTemplate.header" />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            </div>
            <!-- Bodies -->
            <div class="inline-group">
                <div class="form-group">
                    <label>HTML Body</label>
                    <ValidationProvider
                        name="htmlContent"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <text-area v-model="localTemplate.baseContent" />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form-group">
                    <label>Alternate HTML Body</label>
                    <text-area v-model="localTemplate.alternateBaseContent" />
                </div>
            </div>
            <!-- Footer -->
            <div class="inline-group">
                <div class="form-group">
                    <label for="">HTML Footer</label>
                    <ValidationProvider
                        name="htmlFooter"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <text-area v-model="localTemplate.footer" />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            </div>

            <!-- Variables -->
            <div class="section-group">
                <div
                    v-for="(variable, index) in localTemplate.variables"
                    :key="variable.cid"
                    class="inline-group"
                >
                    <div class="form-group">
                        <label for="">Variable Name</label>
                        <ValidationProvider>
                            <text-input
                                type="text"
                                v-model="variable.name"
                            />
                        </ValidationProvider>
                    </div>
                    <div class="form-group">
                        <label for="">Variable Type</label>
                        <div class="multiselect-wrapper">
                            <multi-select
                                v-model="variable.type"
                                selectLabel=""
                                deselectLabel=""
                                :show-labels="false"
                                :searchable="false"
                                :options="['image', 'link', 'text']"
                            />
                        </div>
                    </div>
                    <i
                        class="fas fa-times-circle removeVariable"
                        @click="onRemoveVariable(variable, index)"
                    />
                </div>

                <!-- Add field -->
                <div class="addVariable">
                    <p class="label">Add Variable</p>
                    <i
                        class="fas fa-plus icon"
                        @click="addVariable"
                    ></i>
                </div>
            </div>

            <div class="buttonControls">
                <app-button
                    type="button"
                    classes="btn btn-green"
                    @click.native="handleSubmit"
                    text="Submit"
                />
                <app-button
                    type="button"
                    classes="btn btn-black"
                    @click.native="$emit('close')"
                    text="Cancel"
                />
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import TextInput from "@/components/Shared/Inputs/TextInput";
import RadioInput from "@/components/Shared/Inputs/RadioInput";
import TextArea from "@/components/Shared/Inputs/TextArea";

let cidIncrementer = 1;

export default {
    name: "AddEditTemplate",
    components: {
        "multi-select": Multiselect,
        "text-input": TextInput,
        "text-area": TextArea,
        "radio-input": RadioInput,
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    props: {
        selectedTemplate: {
            type: Object,
            default() {
                return {
                    id: undefined,
                    name: undefined,
                    header: undefined,
                    footer: undefined,
                    baseContent: undefined,
                    alternateBaseContent: undefined,
                    isActive: 1,
                    variables: [],
                };
            },
        },
        action: String,
    },
    data() {
        return {
            localTemplate: JSON.parse(
                JSON.stringify({ ...this.selectedTemplate })
            ),
        };
    },
    methods: {
        ...mapActions(["createTemplate", "deleteTemplateVariable"]),
        addVariable() {
            this.localTemplate.variables.push({
                cid: cidIncrementer++,
                id: null,
                name: "",
                type: "",
            });
        },
        onRemoveVariable(variable, index) {
            if (variable.id == null) {
                // this is a new variable, no need to notify server before updating UI
                this.localTemplate.variables.splice(index, 1);
            } else {
                this.deleteTemplateVariable(variable.id).then((response) => {
                    if (response.status == "200") {
                        this.localTemplate.variables.splice(index, 1);
                    }
                });
            }
        },
        async handleSubmit() {
            const isValid = await this.$refs.observer.validate();
            if (!isValid) {
                // console.log('there are validation errors...');
            } else {
                // post the form submit
                this.createTemplate(this.localTemplate).then((resp) => {
                    this.$emit("close");
                });
            }
        },
    },
    watch: {
        selectedTemplate() {
            // watcher to reset add/edit inputs after a cancel
            this.localTemplate = JSON.parse(
                JSON.stringify({ ...this.selectedTemplate })
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.addEditTemplate {
    margin-top: 4rem;
    form {
        width: 100rem;
        .inline-group {
            position: relative;
            display: flex;
            justify-content: space-between;
            .form-group {
                width: 48%;
            }
            .multiselect-wrapper {
                margin-right: 3rem;
            }
        }
        .removeVariable {
            position: absolute;
            right: 0;
            top: 3rem;
            color: $red;
            cursor: pointer;
        }
        textarea {
            resize: both;
        }
        label {
            font-weight: 700;
        }
    }
    .addVariable {
        position: relative;
        display: inline-block;
        margin-top: 2rem;
        font-size: 12px;
        font-weight: 700;
        .icon {
            display: block;
            color: $orange;
            text-align: center;
            border-radius: 50%;
            border: 2px solid $orange;
            height: 30px;
            width: 30px;
            line-height: 27px;
            margin: 0.5rem auto 0;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
            &:hover {
                color: #fff;
                background-color: $orange;
            }
        }
    }
    .buttonControls {
        margin-top: 4rem;
        button {
            margin-right: 1rem;
            font-weight: 700;
            font-family: 'Nunito Sans', sans-serif;
        }
    }
}
</style>
