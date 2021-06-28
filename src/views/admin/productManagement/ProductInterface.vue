<template>
    <div class="addProduct">
        <validation-observer ref="observer" tag="form">
            <div class="col col1">
                <h1>
                    {{ pageTitle }}
                </h1>
                <!-- Category -->
                <div class="form-group">
                    <label>Category</label>
                    <validation-provider
                        name="category"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <div class="multiselect-wrapper">
                            <multi-select
                                v-model="localProduct.category"
                                label="name"
                                track-by="id"
                                selectLabel=""
                                placeholder="Select category"
                                deselectLabel=""
                                :preserve-search="true"
                                :options="allCategories_short"
                                :taggable="false"
                            />
                        </div>
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Product Name -->
                <div class="form-group">
                    <label>Product Name</label>
                    <validation-provider
                        name="productName"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <text-input type="text" v-model="localProduct.name" />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Product Images -->
                <div class="form-group">
                    <label
                        >Product Images
                        <span class="labelNote"
                            >(click to set primary)</span
                        ></label
                    >
                    <validation-provider
                        name="productImages"
                        ref="imagesProvider"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <div
                            v-cloak
                            @drop.prevent="productImagesChanged"
                            @dragover.prevent
                            class="productImages"
                        >
                            <input
                                type="file"
                                name="productImages"
                                ref="productImages"
                                @input="productImagesChanged"
                                title=" "
                                multiple
                            />
                            <div
                                v-for="(
                                    image, index
                                ) in localProduct.productImages"
                                :key="index"
                                class="productImage"
                            >
                                <i
                                    class="fas fa-times-circle removeImage"
                                    @click="removeProductImage(index)"
                                />
                                <img
                                    :src="getThumbnailFilepath(image)"
                                    :class="{ '--primary': image.primary == 1 }"
                                    @click="setPrimaryProductImage(index)"
                                />
                            </div>
                        </div>
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Product Description -->
                <div class="form-group">
                    <label>Product Description</label>
                    <validation-provider
                        name="description"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <ckeditor
                            v-if="dataIsReady"
                            :editor="editor"
                            v-model="localProduct.description"
                            :config="editorConfig"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Primary Assignee -->
                <div class="form-group">
                    <label>Primary Assignee</label>
                    <validation-provider
                        name="assignTo"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <div class="multiselect-wrapper">
                            <multi-select
                                v-model="localProduct.assignTo"
                                :options="allMarketingEmployees"
                                track-by="employeeNumber"
                                placeholder="Select employee"
                                label="fullName"
                                selectLabel=""
                                deselectLabel=""
                            />
                        </div>
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <!-- Secondary Assignee -->
                <div class="form-group">
                    <label>Secondary Assignee</label>
                    <div class="multiselect-wrapper">
                        <multi-select
                            v-model="localProduct.secondaryAssignTo"
                            :options="allMarketingEmployees"
                            track-by="employeeNumber"
                            label="fullName"
                            placeholder="Select employee"
                            selectLabel=""
                            deselectLabel=""
                        />
                    </div>
                </div>
                <!-- Topics -->
                <div class="form-group">
                    <label>Topics</label>
                    <div class="multiselect-wrapper">
                        <multi-select
                            v-model="localProduct.topics"
                            :multiple="true"
                            track-by="name"
                            placeholder="Select or enter new topic"
                            label="name"
                            selectLabel=""
                            deselectLabel=""
                            :close-on-select="false"
                            :preserve-search="true"
                            :options="allTopics"
                            :taggable="true"
                            @tag="addNewTopic"
                        >
                            <template
                                slot="selection"
                                slot-scope="{ values, isOpen }"
                            >
                                <span
                                    class="multiselect__single"
                                    v-if="values.length &amp;&amp; !isOpen"
                                >
                                    {{ values.length }} selected
                                </span>
                            </template>
                        </multi-select>
                    </div>
                </div>
                <!-- Active status -->
                <div class="form-group">
                    <label>Active?</label>
                    <div class="input-group">
                        <radio-input
                            name="status"
                            :check="1"
                            label="Yes"
                            id="activeYes"
                            labelFor="activeYes"
                            v-model="localProduct.isActive"
                        />
                        <radio-input
                            name="status"
                            :check="0"
                            label="No"
                            id="activeNo"
                            labelFor="activeNo"
                            v-model="localProduct.isActive"
                        />
                    </div>
                </div>
                <!-- Requires 3rd party -->
                <div class="form-group">
                    <label>Requires 3rd Party?</label>
                    <div class="input-group">
                        <radio-input
                            name="requires3rdParty"
                            :check="1"
                            label="Yes"
                            id="3rdPartyYes"
                            labelFor="3rdPartyYes"
                            v-model="localProduct.requires3rdParty"
                        />
                        <radio-input
                            name="requires3rdParty"
                            :check="0"
                            label="No"
                            id="3rdPartyNo"
                            labelFor="3rdPartyNo"
                            v-model="localProduct.requires3rdParty"
                        />
                    </div>
                </div>
                <!-- Add to Discover -->
                <div class="form-group">
                    <label>Add to Discover Page?</label>
                    <div class="input-group">
                        <radio-input
                            name="addToDiscover"
                            :check="1"
                            label="Yes"
                            id="discoverYes"
                            labelFor="discoverYes"
                            v-model="localProduct.displayDiscover"
                        />
                        <radio-input
                            name="addToDiscover"
                            :check="0"
                            label="No"
                            id="discoverNo"
                            labelFor="discoverNo"
                            v-model="localProduct.displayDiscover"
                        />
                    </div>
                </div>
                <!-- Add to Catalog Site -->
                <div class="form-group">
                    <label>Add to Catalog Site?</label>
                    <div class="input-group">
                        <radio-input
                            name="addToCatalog"
                            :check="1"
                            id="catalogYes"
                            labelFor="catalogYes"
                            label="Yes"
                            v-model="localProduct.displayRealtor"
                        />
                        <radio-input
                            name="addToCatalog"
                            :check="0"
                            id="catalogNo"
                            labelFor="catalogNo"
                            label="No"
                            v-model="localProduct.displayRealtor"
                        />
                    </div>
                </div>
                <!-- Processing Time -->
                <div class="form-group">
                    <label>Processing Time</label>

                    <div class="inline-group">
                        <validation-provider
                            name="processingTime"
                            mode="passive"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <text-input
                                class="--extraShort"
                                v-model="localProduct.processingTime"
                                :readonly="localProduct.isDownload == 1"
                            />
                            <span class="errorMessage processingTime">{{
                                errors[0]
                            }}</span>
                        </validation-provider>
                        <div class="input-group">
                            <radio-input
                                name="processingTimePrecision"
                                check="days"
                                id="precisionDays"
                                labelFor="precisionDays"
                                label="Days"
                                v-model="processingTimePrecision"
                            />
                            <radio-input
                                name="processingTimePrecision"
                                check="hours"
                                id="precisionHours"
                                labelFor="precisionHours"
                                label="Hours"
                                v-model="processingTimePrecision"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Build fields/Instant Download -->
            <div class="col col2">
                <h1>Build the Fields</h1>
                <div class="questionContainer">
                    <!-- Is Instant Download? -->
                    <div class="form-group">
                        <label for="">Instant Download?</label>
                        <div class="input-group">
                            <radio-input
                                :check="1"
                                name="isDownload"
                                label="Yes"
                                labelFor="download_yes"
                                @input="onInstantDownloadSelected"
                                id="download_yes"
                                v-model="localProduct.isDownload"
                            />
                            <radio-input
                                :check="0"
                                name="isDownload"
                                label="No"
                                labelFor="download_no"
                                @input="onInstantDownloadDeselected"
                                id="download_no"
                                v-model="localProduct.isDownload"
                            />
                        </div>
                    </div>

                    <!-- Is Co-brandable Product? -->
                    <div v-if="localProduct.isDownload == 0" class="form-group">
                        <label for="">Co-brandable Product?</label>
                        <div class="input-group">
                            <radio-input
                                :check="1"
                                name="cobrandable"
                                label="Yes"
                                labelFor="cobrandable_yes"
                                v-model="localProduct.isCobrandable"
                                id="cobrandable_yes"
                            />
                            <radio-input
                                :check="0"
                                name="cobrandable"
                                label="No"
                                labelFor="cobrandable_no"
                                v-model="localProduct.isCobrandable"
                                id="cobrandable_no"
                            />
                        </div>
                    </div>
                </div>

                <!-- Instant Download Deliverables -->
                <div
                    v-if="localProduct.isDownload == 1"
                    class="uploadDocuments"
                >
                    <!-- <p class="label">Upload File</p> -->
                    <validation-provider
                        name="instantAsset"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                        ref="instantAssetProvider"
                    >
                        <single-file-input
                            button-text="Upload File"
                            :show-file-name="false"
                            name="instantAsset"
                            @input="instantDownloadChanged"
                        />
                        <div class="instantDownloadWrapper">
                            <img src="@/assets/images/document_icon.png" />
                            <a
                                :href="localProduct.instantAssetPath"
                                download
                                target="_blank"
                                >{{ instantDownloadName }}</a
                            >
                            <i
                                v-if="
                                    instantDownloadName !== 'No file uploaded'
                                "
                                class="fas fa-times-circle removalButton"
                                @click="removeInstantDownloadAsset"
                            />
                        </div>
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>

                <field-builder
                    v-if="localProduct.formFields"
                    :product="localProduct"
                    @field-changed="updateFormFields"
                    @field-deleted="onDeletedField"
                    @option-deleted="onDeletedFormFieldOption"
                />
            </div>

            <!-- Controls -->
            <div class="col col3">
                <app-button
                    classes="btn btn-orange"
                    @click.native="saveProduct"
                    text="Save Product"
                />
                <app-button
                    classes="btn btn-black"
                    @click.native="cancelManageProduct()"
                    text="Cancel"
                />
            </div>
        </validation-observer>

        <!-- Confirmation Modal -->
        <transition name="modal-scale">
            <confirmation-modal
                v-if="confirmModal.showing"
                :message="confirmModal.message"
                :event="confirmModal.event"
                @confirmation="handleConfirmModalEvent"
            />
        </transition>
    </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import isEqual from "lodash/isEqual";
// components
import Multiselect from "vue-multiselect";
import InlineEditor from "ruoff-ckeditor5-custom-inline/build/ckeditor";
import TextInput from "@/components/Shared/Inputs/TextInput";
import SingleFileInput from "@/components/Shared/Inputs/SingleFileInput";
import RadioInput from "@/components/Shared/Inputs/RadioInput";
import AppButton from "@/components/Shared/AppButton";

export default {
    name: "ProductInterface",

    components: {
        "multi-select": Multiselect,
        "field-builder": () =>
            import("@/components/Admin/ProductManagement/FieldBuilder"),
        "text-input": TextInput,
        "radio-input": RadioInput,
        "single-file-input": SingleFileInput,
        "app-button": AppButton,
        "confirmation-modal": () =>
            import("@/components/Shared/ConfirmationModal"),
    },

    data() {
        return {
            localProduct: {
                id: null,
                name: null,
                productImages: [],
                isDownload: 0,
                isActive: 1,
                isCobrandable: 0,
                description: null,
                sortOrder: 0,
                displayDiscover: 0,
                displayRealtor: 1,
                instantAssetPath: null,
                formFields: [],
                topics: [],
                requires3rdParty: 0,
                assignTo: null,
                secondaryAssignTo: null,
                processingTime: null,
                invoiceValue: null,
                invoiceDescription: null,
            },
            snapshot: null,
            editor: InlineEditor,
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
                link: {
                    // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
                    addTargetToExternalLinks: true,
                },
            },
            uploadInstantAsset: false,
            deletedImages: [],
            deletedFormFields: [],
            deletedFormFieldOptions: [],
            instantAssetFileName: "No file uploaded",
            confirmModal: {
                showing: false,
                message: "",
                event: "",
            },
            processingTimePrecision: "hours",
            action: "add",
            dataIsReady: false,
        };
    },

    computed: {
        ...mapState(["products"]),
        ...mapGetters([
            "allTopics",
            "allCategories_short",
            "allMarketingEmployees",
            "productById",
        ]),
        instantDownloadName() {
            const { instantAssetPath } = this.localProduct;
            if (instantAssetPath == null) {
                return "No file uploaded";
            }
            if (instantAssetPath.startsWith("data:")) {
                return this.instantAssetFileName;
            }
            if (typeof instantAssetPath == "string") {
                return instantAssetPath.split("/").pop();
            }
            if (instantAssetPath instanceof Object) {
                return instantAssetPath.name;
            }
            return "No file uploaded";
        },
        pageTitle() {
            if (this.action === "edit") {
                return "Edit Product";
            }
            return "Add Product";
        },
    },

    methods: {
        ...mapMutations(["EDIT_PRODUCT"]),
        ...mapActions(["manageProduct", "manageTopic", "updateProduct"]),
        async addNewTopic(topicName) {
            const topicObj = {
                description: "",
                isActive: 1,
                name: topicName.toLowerCase(),
            };
            const { response } = await this.manageTopic(topicObj);
            if (response.status == "200") {
                this.localProduct.topics.push(topicObj);
            }
        },
        productImagesChanged(e) {
            let inputtedFiles;
            // collect dropped images and create an object to push into local product images state
            if (e.dataTransfer) {
                inputtedFiles = e.dataTransfer.files;
            } else {
                inputtedFiles = e.target.files;
            }

            if (!inputtedFiles) return; // if we dont have files at this point, get out

            // convert FileList to array
            [...inputtedFiles].forEach((file) => {
                const obj = {
                    path: "",
                    primary:
                        this.localProduct.productImages.length == 0 ? 1 : 0,
                    id: null,
                    fileObject: file,
                    fileName: file.name,
                    filepaths: [
                        {
                            path: "",
                            type: "thumbnail",
                        },
                    ],
                };
                const reader = new FileReader();
                reader.onload = (fileEvent) => {
                    // the result image data
                    obj.path = fileEvent.target.result;
                    obj.filepaths[0].path = fileEvent.target.result;
                };
                reader.readAsDataURL(file);
                if (
                    !this.localProduct.productImages.some(
                        (image) => image.fileName == obj.fileName
                    )
                ) {
                    this.localProduct.productImages.push(obj);
                }
            });
            this.$refs.imagesProvider.syncValue(
                this.localProduct.productImages
            ); // this will let validitor know if files are present
        },
        removeProductImage(index) {
            const deletedImage = this.localProduct.productImages.splice(
                index,
                1
            );
            const { id, primary } = deletedImage[0];
            // check for an id - if it was new, we dont need to let server know
            if (id !== null) {
                this.deletedImages.push(id);
            }
            // if primary image was deleted, move primary to the next image
            if (primary == 1) {
                const image = this.localProduct.productImages[0];
                if (image) {
                    image.primary = 1;
                }
            }
        },
        setPrimaryProductImage(index) {
            this.localProduct.productImages.forEach((image, i) => {
                if (i == index) {
                    image.primary = 1;
                } else {
                    image.primary = 0;
                }
            });
        },
        getThumbnailFilepath(image) {
            const thumb = image.filepaths.find(
                (filepath) => filepath.type == "thumbnail"
            );
            return thumb ? thumb.path : "";
        },
        instantDownloadChanged(file) {
            const reader = new FileReader();
            reader.onload = (fileEvent) => {
                // the result image data
                this.localProduct.instantAssetPath = fileEvent.target.result;
                // let the field validator know about the new value
                this.$refs.instantAssetProvider.syncValue(
                    this.localProduct.instantAssetPath
                );
            };
            reader.readAsDataURL(file);
            this.instantAssetFileName = file.name;
            this.uploadInstantAsset = true;
        },
        removeInstantDownloadAsset() {
            this.localProduct.instantAssetPath = null;
            this.instantAssetFileName = "No file uploaded";
            this.uploadInstantAsset = false;
            this.$refs.instantAssetProvider.syncValue(
                this.localProduct.instantAssetPath
            );
        },
        updateFormFields(formFields) {
            this.localProduct.formFields = formFields;
        },
        onInstantDownloadSelected() {
            this.localProduct.processingTime = 0;
        },
        onInstantDownloadDeselected() {
            if (this.localProduct.processingTime == 0) {
                this.localProduct.processingTime = null;
            }
        },
        onDeletedField(fieldId) {
            this.deletedFormFields.push(fieldId);
        },
        onDeletedFormFieldOption(optionId) {
            this.deletedFormFieldOptions.push(optionId);
        },
        cancelManageProduct() {
            if (isEqual(this.snapshot, this.localProduct)) {
                this.$router.go(-1);
            } else {
                this.openConfirmModal(
                    "cancel",
                    "Changes you have made will be lost. Are you sure you want to cancel?"
                );
            }
        },
        openConfirmModal(event, message) {
            this.confirmModal.event = event;
            this.confirmModal.message = message;
            this.confirmModal.showing = true;
        },
        handleConfirmModalEvent(confirmed) {
            if (confirmed) {
                switch (this.confirmModal.event) {
                    case "cancel":
                        this.$router.go(-1);
                        break;
                    default:
                        return;
                }
            }
            this.confirmModal.message = "";
            this.confirmModal.showing = false;
        },
        async saveProduct() {
            // let the field validator know about the new value
            if (this.$refs.instantAssetProvider) {
                this.$refs.instantAssetProvider.syncValue(
                    this.localProduct.instantAssetPath
                );
            }
            const formValid = await this.$refs.observer.validate();
            if (formValid) {
                // copy objects from state into payload
                Vue.set(this.localProduct, "deletedImages", this.deletedImages);
                Vue.set(
                    this.localProduct,
                    "deletedFormFields",
                    this.deletedFormFields
                );
                Vue.set(
                    this.localProduct,
                    "deletedFormFieldOptions",
                    this.deletedFormFieldOptions
                );
                Vue.set(
                    this.localProduct,
                    "instantAssetFileName",
                    this.instantAssetFileName
                );
                Vue.set(
                    this.localProduct,
                    "uploadInstantAsset",
                    this.uploadInstantAsset
                );
                // if this is an instant download, clear the form fields
                if (this.localProduct.isDownload == 1) {
                    this.localProduct.formFields = [];
                }
                if (this.localProduct.isDownload == 0) {
                    this.localProduct.instantAssetPath = null;
                }
                // convert processing time to hours, if days were selected
                if (this.processingTimePrecision === "days") {
                    this.localProduct.processingTime =
                        this.localProduct.processingTime * 8;
                }
                // post the product
                const { response } = await this.manageProduct(
                    this.localProduct
                );
                if (response.status == "200") {
                    this.$router.push("/admin/product-management");
                }
            }
        },
    },

    async mounted() {
        if (this.$route.params.productId) {
            if (this.$route.name == "duplicateProduct") {
                this.action = "duplicate";
            } else {
                this.action = "edit";
            }

            const product = await this.productById(
                this.$route.params.productId
            );
            if (product) {
                this.localProduct = JSON.parse(JSON.stringify({ ...product }));
            } else {
                // product is not in store, attempt to load from API & route to 404 if doesnt exist
                const response = await this.updateProduct(
                    this.$route.params.productId
                );
                const data = response[0];
                if (response.length == 0) {
                    this.$router.push("/404");
                } else if (data.isActive == 0) {
                    this.$router.push("/404");
                } else {
                    this.localProduct = JSON.parse(
                        JSON.stringify({ ...response[0] })
                    );
                }
            }
        } else {
            // any conditional code for add products only
        }

        if (this.action == "duplicate") {
            this.localProduct.id = null;
            this.localProduct.name = "";
            this.localProduct.productImages = [];
            this.localProduct.formFields.forEach((field) => {
                field.id = null;
                field.options.forEach((option, index) => {
                    option.id = `temp ${index + 1}`;
                });
            });
        }

        // let validitor know if files are present
        this.$refs.imagesProvider.syncValue(this.localProduct.productImages);
        /* take a snapshot of the product object so we can notify user
            progress will be lost when they attempt to cancel */
        this.snapshot = JSON.parse(JSON.stringify({ ...this.localProduct }));
        Vue.nextTick(() => {
            this.dataIsReady = true;
        });
    },
};
</script>

<style lang="scss" scoped>
.addProduct {
    padding: 4rem 12rem 12rem;
}

form {
    display: flex;
    h1 {
        margin-bottom: 4rem;
    }
    input.--extraShort {
        width: 5.75rem;
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
    .inline-group {
        display: flex;
        .input-group {
            margin-left: 1rem;
        }
    }
    .errorMessage.processingTime {
        position: absolute;
    }
}

.col1 {
    width: 41%;
    .multiselect {
        width: 23rem;
    }
    .productImages {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;
        border: 1px solid $gray;
        padding: 1rem;
        background-color: #f7f7f7;
        height: 12rem;
        width: 100%;
        input[type="file"] {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            opacity: 0;
            min-width: unset;
            cursor: pointer;
        }
        .productImage {
            position: relative;
            margin: 0 2rem 1rem 0;
            cursor: pointer;
            z-index: 10;
            background-color: transparent;
            img {
                height: 80px;
                box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.3);
                padding: 3px;

                &.--primary {
                    background-color: $teal-light;
                }
            }
            .removeImage {
                position: absolute;
                bottom: 3px;
                right: -5px;
                color: $red;
                background-color: #fff;
                font-size: 25px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 11;
            }
        }
    }
}
.col2 {
    width: 35%;
    margin-left: 15rem;
    .questionContainer {
        display: flex;
        .form-group {
            margin-right: 2rem;
        }
    }
    .uploadDocuments {
        margin-top: 2rem;
        .label {
            margin-bottom: 1rem;
        }
        .instantDownloadWrapper {
            display: flex;
            align-items: center;
            margin-top: 2rem;
            a {
                display: block;
                // margin-top: 2rem;
                font-size: 12px;
                text-decoration: underline;
                color: $linkBlue;
                margin: 0 0.5rem;
            }
            i {
                color: $red;
                cursor: pointer;
            }
        }
    }
}
.col3 {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    button {
        margin-bottom: 2rem;
        margin-left: 2rem;
    }
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
