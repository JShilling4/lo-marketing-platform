<template>
    <div class="template-variable-input">
        <div
            v-if="variable.type == 'text'"
            class="form-group"
        >
            <label>{{ variable.name }}</label>
            <ValidationProvider
                :name="variable.name"
                mode="passive"
                rules="required"
                v-slot="{ errors }"
            >
                <ckeditor
                    :editor="editor"
                    v-model="variable.value"
                    :config="editorConfig"
                    @input="onTextChange(variable.value, variable.name)"
                />
                <span class="errorMessage">{{ errors[0] }}</span>
            </ValidationProvider>
        </div>

        <div
            v-else-if="variable.type == 'image'"
            class="form-group"
        >
            <label>{{ variable.name }}</label>
            <div class="inputChoice-group">

                <single-file-input
                    buttonText="Upload"
                    :name="variable.name"
                    :file-name="fileName"
                    @input="onImageChange($event, variable.name)"
                >
                    <template
                        v-if="!inputHasFile"
                        #removal-button
                    >
                        <i
                            class="fas fa-times-circle removalButton"
                            @click="resetImage(variable.name)"
                        />
                    </template>
                </single-file-input>
            </div>
        </div>

        <div
            v-else-if="variable.type == 'link'"
            class="form-group"
        >
            <label>{{ variable.name }}</label>
            <div class="inputChoice-group">
                <div class="linkType-group">
                    <span
                        class="linkType"
                        :class="{ 'linkType--selected': linkType == 'file' }"
                        @click="linkType = 'file'"
                    >
                        File
                    </span>
                    <span class="linkDivider">|</span>
                    <span
                        class="linkType"
                        :class="{ 'linkType--selected': linkType == 'url' }"
                        @click="linkType = 'url'"
                    >
                        URL
                    </span>
                </div>
                <div v-if="linkType == 'file'">
                    <div class="inline-fileInput">
                        <single-file-input
                            buttonText="Upload"
                            @input="onLinkChange($event, variable.name)"
                            :file-name="fileName"
                            :name="variable.name"
                        />
                    </div>
                </div>
                <div v-if="linkType == 'url'">
                    <text-input
                        type="text"
                        v-model="variable.value"
                        @input="onLinkChange($event, variable.name)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InlineEditor from "ruoff-ckeditor5-custom-inline/build/ckeditor";
import TextInput from "@/components/Shared/Inputs/TextInput";
import SingleFileInput from "@/components/Shared/Inputs/SingleFileInput";

export default {
    name: "EmailVariableInput",
    components: {
        "text-input": TextInput,
        "single-file-input": SingleFileInput,
    },
    props: {
        variable: Object,
    },
    data() {
        return {
            linkType: "url",
            editor: InlineEditor,
            editorData: "",
            editorConfig: {
                toolbar: [
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "fontColor",
                    "fontSize",
                    "|",
                    "link",
                ],
                fontColor: {
                    colors: [
                        {
                            color: "#16af8c",
                        },
                        {
                            color: "#026957",
                        },
                        {
                            color: "#142f42",
                        },
                        {
                            color: "#f38e36",
                        },
                        {
                            color: "#00485c",
                        },
                    ],
                },
                fontSize: {
                    options: [10, 14, 16, "default", 20, 22, 26],
                },
            },
            fileName: "",
        };
    },
    computed: {
        inputHasFile() {
            return this.fileName == "No file selected.";
        },
    },
    methods: {
        onTextChange(text, varName) {
            this.$emit("input-text", text, varName);
        },
        onImageChange(value, varName) {
            // change ui filename and send the file object to parent
            this.$emit("input-image", value, varName);
            this.setFileName(value);
        },
        setFileName(value = this.variable.value) {
            if (value == "" || value == null || value == undefined) {
                this.fileName = "No file selected.";
            } else if (value instanceof File) {
                this.fileName = value.name;
            } else {
                this.fileName = value.split("/").pop();
            }
        },
        onLinkChange(value, varName) {
            // change ui filename and send the file object to parent
            if (value instanceof Object) {
                this.fileName = value.name;
                this.$emit("input-link", value, varName);
            } else {
                this.$emit("input-link", value, varName);
                this.fileName = "No file selected";
            }
            this.setFileName();
        },
        resetImage(varName) {
            const targets = document.querySelectorAll(
                `[data-variable='${varName}`
            );
            targets.forEach((target) => {
                target.src = target.dataset.default;
            });
            this.fileName = "No file selected.";
            this.$emit("remove-image", varName);
        },
    },
    mounted() {
        this.setFileName();
    },
};
</script>

<style lang="scss" scoped>
.template-variable-input {
    // height: 8rem;
}
.inputChoice-group {
    display: flex;
    align-items: center;
    height: 2.4rem;
    input {
        margin-left: 1rem;
        width: 23rem;
        font-size: 12px;
    }
    input[type="text"] {
        height: 2.4rem;
    }
    .removalButton {
        margin-left: 1rem;
        font-size: 16px;
        color: $red;
        cursor: pointer;
        z-index: 11;
    }
}
.linkType-group {
    color: $gray;
    .linkType {
        cursor: pointer;
        font-size: 1.4rem;
        &--selected {
            color: $orange;
            font-weight: 600;
        }
    }
}
.inline-fileInput {
    margin-left: 1rem;
}
.ck-editor__editable {
    font-size: 12px;
    border: 1px solid $gray-light !important;
    border-radius: 5px !important;
    outline: none;
    &:focus {
        border: 1px solid $teal-light !important;
        box-shadow: none !important;
    }
}
</style>
