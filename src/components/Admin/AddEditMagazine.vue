<template>
    <div class="addEditMagazine">
        <ValidationObserver
            ref="observer"
            v-slot="{ invalid }"
            tag="form"
        >
            <!-- Title -->
            <ValidationProvider
                name="title"
                mode="passive"
                v-slot="{ errors }"
                rules="required"
            >
                <div class="form-group">
                    <label>Magazine Name </label>
                    <text-input
                        v-focus
                        type="text"
                        name="name"
                        v-model="localItem.title"
                    />
                    <span class="errorMessage">{{ errors[0] }}</span>
                </div>
            </ValidationProvider>

            <!-- Description -->
            <ValidationProvider
                name="description"
                mode="passive"
                v-slot="{ errors }"
                rules="required"
            >
                <div class="form-group">
                    <label>Magazine Description</label>
                    <text-area v-model="localItem.description" />
                    <span class="errorMessage">{{ errors[0] }}</span>
                </div>
            </ValidationProvider>

            <!-- Status -->
            <div class="form-group">
                <label> Status </label>
                <div class="input-group">
                    <div class="input-group">
                        <radio-input
                            name="status"
                            label="Active"
                            id="status_active"
                            labelFor="status_active"
                            :check="1"
                            v-model="localItem.isActive"
                        />
                    </div>
                    <div class="input-group">
                        <radio-input
                            name="status"
                            label="Inactive"
                            id="status_inactive"
                            labelFor="status_inactive"
                            :check="0"
                            v-model="localItem.isActive"
                        />
                    </div>
                </div>
            </div>

            <!-- Image upload -->
            <ValidationProvider
                name="image"
                mode="passive"
                ref="imageProvider"
                v-slot="{ errors }"
                rules="required"
            >
                <div class="form-group">
                    <single-file-input
                        button-text="Upload Image"
                        :file-name="computedImage.split('/').pop()"
                        @input="imageUploaded"
                    />
                    <span class="errorMessage">{{ errors[0] }}</span>
                </div>
            </ValidationProvider>
        </ValidationObserver>
        <div class="form-controls">
            <span
                @click="saveItem"
                class="control --save"
            >Save</span>
            <span
                @click="close"
                class="control --cancel"
            >Cancel</span>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import TextInput from "@/components/Shared/Inputs/TextInput";
import TextArea from "@/components/Shared/Inputs/TextArea";
import RadioInput from "@/components/Shared/Inputs/RadioInput";
import SingleFileInput from "@/components/Shared/Inputs/SingleFileInput";

export default {
    name: "AddEditMagazine",
    props: {
        item: {
            type: Object,
            default() {
                return {
                    id: null,
                    image: null,
                    title: "",
                    description: "",
                    isActive: 1,
                };
            },
        },
        action: String,
    },
    components: {
        "text-input": TextInput,
        "text-area": TextArea,
        "single-file-input": SingleFileInput,
        "radio-input": RadioInput,
    },
    data() {
        return {
            localItem: { ...this.item },
        };
    },
    computed: {
        computedImage: {
            get() {
                if (this.localItem.image == null) {
                    return "No file selected";
                }
                return this.localItem.image;
            },
            set(newValue) {
                this.localItem.image = newValue;
            },
        },
    },
    methods: {
        ...mapActions(["manageMagazine", "updateMagazines"]),
        close() {
            this.$emit("close");
        },
        imageUploaded(image) {
            const file = {
                path: "",
                name: image.name,
            };
            const reader = new FileReader();
            reader.onload = async (fileEvent) => {
                // the result image data
                file.path = fileEvent.target.result;
            };
            reader.readAsDataURL(image);
            this.localItem.file = file;
            this.localItem.image = image.name;
            this.$refs.imageProvider.syncValue(this.localItem.image); // this will let validitor know if files are present
        },
        async saveItem() {
            const formValid = await this.$refs.observer.validate();
            if (formValid) {
                if (!this.localItem.file) {
                    this.localItem.file = null;
                }
                this.manageMagazine(this.localItem);
                this.close();
            }
        },
    },
    mounted() {
        this.$refs.imageProvider.syncValue(this.localItem.image); // this will let validitor know if files are present
    },
};
</script>

<style lang="scss" scoped>
.addEditMagazine {
    position: fixed;
    top: 20rem;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    padding: 4rem 6rem;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.inline-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .form-group {
        width: 45%;
    }
    input {
    }
}
label {
    font-weight: 700;
}
::v-deep .upload-wrapper {
    button {
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
}

.form-controls {
    display: flex;
    justify-content: flex-start;
    margin-top: 4rem;
    .control {
        display: block;
        margin-right: 1.5rem;
        border-radius: 2rem;
        padding: 0.5rem 2rem 0.25rem;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 600;
        &.--save {
            color: $teal-light;
            &:hover {
                background-color: $teal-light;
                color: #fff;
            }
        }
        &.--cancel {
            color: $orange;
            &:hover {
                background-color: $orange;
                color: #fff;
            }
        }
        &.--delete {
            color: $red;
            &:hover {
                background-color: $red;
                color: #fff;
            }
        }
    }
}
</style>
