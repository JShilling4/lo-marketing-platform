<template>
    <div class="editCobrandInvoice">
        <h2 class="heading">{{ invoice.id == null ? "New Invoice" : `Invoice # ${invoice.id} ` }}</h2>
        <ValidationObserver
            ref="observer"
            v-slot="{ invalid }"
            tag="form"
        >
            <div class="input-column">
                <!-- Order Number -->
                <ValidationProvider
                    mode="passive"
                    v-slot="{ errors }"
                    rules="required"
                    class="form-group"
                    tag="div"
                >
                    <label>Order Number </label>
                    <text-input
                        v-focus
                        type="text"
                        v-model="invoice.order.id"
                    />
                    <span class="errorMessage">{{ errors[0] }}</span>
                </ValidationProvider>

                <!-- LO Name -->
                <ValidationProvider
                    mode="passive"
                    v-slot="{ errors }"
                    rules="required"
                >
                    <div class="form-group">
                        <label>Loan Officer</label>
                        <multi-select
                            v-model="localInvoice.loanOfficer"
                            track-by="employeeNumber"
                            label="fullName"
                            selectLabel=""
                            deselectLabel=""
                            :options="allLoanOfficers"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </div>
                </ValidationProvider>

                <!-- Product Description -->
                <ValidationProvider
                    mode="passive"
                    v-slot="{ errors }"
                    rules="required"
                    class="form-group"
                    tag="div"
                >
                    <label>Product Description</label>
                    <text-input v-model="localInvoice.productDescription" />
                    <span class="errorMessage">{{ errors[0] }}</span>
                </ValidationProvider>

                <!-- RP Name -->
                <ValidationProvider
                    mode="passive"
                    v-slot="{ errors }"
                    rules="required"
                >
                    <div class="form-group">
                        <label> Co-brandee Name </label>
                        <text-input v-model="localInvoice.careOf.fullName" />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </div>
                </ValidationProvider>

                <!-- Special Notes -->
                <div class="form-group textArea">
                    <label>Special Notes For This Order</label>
                    <text-area v-model="localInvoice.notes" />
                </div>
            </div>
            <!-- Proof of Ad -->
            <div class="input-column proofOfAd">
                <validation-provider
                    name="instantAsset"
                    mode="passive"
                    v-slot="{ errors }"
                    class="form-group fileUpload"
                    tag="div"
                >
                    <label>Proof of ad preview</label>
                    <img
                        v-if="renderByFileType(localInvoice.proofOfAd) !== null"
                        :src="renderByFileType(localInvoice.proofOfAd)"
                    />
                    <span
                        v-else
                        class="noneLabel"
                    >No image to display</span>

                    <label>Proof of ad file</label>
                    <div class="uploadGroup">
                        <single-file-input
                            button-text="Upload File"
                            :show-file-name="false"
                            @input="imageUploaded"
                        />
                        <div
                            v-if="localInvoice.proofOfAd !== null"
                            class="instantDownloadWrapper"
                        >
                            <img src="@/assets/images/document_icon.png" />
                            <a
                                :href="localInvoice.proofOfAd"
                                download
                                target="_blank"
                            >{{ localInvoice.proofOfAd.split("/").pop() }}</a>
                            <i
                                class="fas fa-times-circle removalButton"
                                @click="removeProofOfAdImage"
                            />
                        </div>
                    </div>
                    <span class="errorMessage">{{ errors[0] }}</span>
                </validation-provider>

                <!-- RP Email -->
                <ValidationProvider
                    mode="passive"
                    v-slot="{ errors }"
                    rules="required"
                >
                    <div class="form-group">
                        <label>Co-brandee Email</label>
                        <text-input v-model="localInvoice.careOf.email" />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </div>
                </ValidationProvider>

                <!-- Status -->
                <div class="form-group">
                    <label>Status</label>
                    <validation-provider
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <div class="multiselect-wrapper">
                            <multi-select
                                v-model="localInvoice.status"
                                :options="['Ordered', 'Invoiced']"
                                placeholder="Select status"
                                selectLabel=""
                                deselectLabel=""
                            />
                        </div>
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </validation-provider>
                </div>

                <!-- Date Ordered -->
                <div class="form-group dateOrdered">
                    <label>Date Invoiced:</label>
                    <date-time-picker
                        :no-value-to-custom-elem="true"
                        :no-button-now="true"
                        :no-button="true"
                        :no-weekends-days="true"
                        color="#16af8c"
                        button-color="#16af8c"
                        v-model="localInvoice.invoicedDatetime"
                        :only-date="true"
                        :auto-close="true"
                        format="YYYY-MM-DD"
                    >
                        <button
                            type="button"
                            class="pickerTrigger"
                        >
                            {{
                localInvoice.invoicedDatetime !== null
                  ? formatDate(localInvoice.invoicedDatetime, "MM-DD-YYYY")
                  : "None"
              }}
                        </button>
                    </date-time-picker>
                </div>
            </div>
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
// dependencies
import { mapGetters, mapActions } from "vuex";
// components
import TextInput from "@/components/Shared/Inputs/TextInput";
import TextArea from "@/components/Shared/Inputs/TextArea";
import SingleFileInput from "@/components/Shared/Inputs/SingleFileInput";
import Multiselect from "vue-multiselect";
import DateTimePicker from "vue-ctk-date-time-picker";
// mixins
import { format, renderByFileType } from "@/mixins";

export default {
    name: "EditCobrandInvoice",
    mixins: [format, renderByFileType],
    props: {
        invoice: {
            type: Object,
            default: () => ({
                id: null,
                careOf: {
                    id: null,
                    fullName: "",
                    email: "",
                },
                invoicedDatetime: null,
                loanOfficer: null,
                order: {
                    id: null,
                },
                productDescription: "",
                proofOfAd: null,
                status: null,
                notes: "",
                upload: null,
            }),
        },
        action: {
            type: String,
        },
    },
    components: {
        "text-input": TextInput,
        "text-area": TextArea,
        "single-file-input": SingleFileInput,
        "multi-select": Multiselect,
        "date-time-picker": DateTimePicker,
    },
    data() {
        return {
            localInvoice: { ...this.invoice },
        };
    },
    computed: {
        ...mapGetters(["allLoanOfficers"]),
    },
    methods: {
        ...mapActions(["manageInvoice"]),
        close() {
            this.$emit("close");
        },
        imageUploaded(image) {
            const file = {
                path: "",
                name: image.name,
            };
            const reader = new FileReader();
            reader.onload = function (fileEvent) {
                // the result image data
                file.path = fileEvent.target.result;
                this.localInvoice.upload = file;
                this.localInvoice.proofOfAd = file.path;
            }.bind(this);
            reader.readAsDataURL(image);
        },
        removeProofOfAdImage() {
            this.localInvoice.proofOfAd = null;
            this.upload = null;
        },
        async saveItem() {
            const formValid = await this.$refs.observer.validate();
            if (formValid) {
                this.manageInvoice(this.localInvoice);
                this.close();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.editCobrandInvoice {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 650px;
    padding: 4rem 6rem;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
    h2.heading {
        margin-bottom: 2rem;
        font-weight: 800;
    }
}
form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.form-group {
    &.fileUpload {
        img {
            max-width: 100%;
        }
    }
    &.textArea {
        width: 100%;
        margin: 0;
    }
    &.dateOrdered {
        display: flex;
        flex-direction: column;
        .pickerTrigger {
            font-weight: 600;
            background-color: transparent;
            color: $teal-light;
            border: none;
            outline: none;
            padding: 0;
            margin: 0;
            font-size: 1.6rem;
            font-family: "Nunito Sans", sans-serif;
            cursor: pointer;
        }
    }
    label {
        font-weight: 700;
    }
    input {
        width: 100%;
    }
}
.input-column {
    width: 47%;
}

.proofOfAd {
    .noneLabel {
        color: $teal-light;
        font-weight: 600;
        display: block;
        padding-bottom: 0.5rem;
        font-size: 14px;
        margin-bottom: 1rem;
    }
}
.uploadGroup {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    a {
        font-size: 13px;
    }
    .instantDownloadWrapper {
        display: flex;
        align-items: center;
        margin-top: 1rem;
        max-width: 100%;
        a {
            display: block;
            font-size: 12px;
            text-decoration: underline;
            color: $linkBlue;
            margin: 0 0.5rem;
            white-space: nowrap;
            overflow-x: hidden;
            text-overflow: ellipsis;
        }
        i {
            color: $red;
            cursor: pointer;
        }
    }
}

    ::v-deep button {
        font-weight: 700;
        font-family: 'Nunito Sans', sans-serif;
    }
.form-controls {
    display: flex;
    justify-content: flex-start;
    margin-top: 3rem;
    .control {
        display: block;
        font-weight: 500;
        margin-right: 1.5rem;
        border-radius: 2rem;
        padding: 0.5rem 2rem 0.25rem;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        &.--save {
            color: $teal-light;
            &:hover {
                background-color: $teal-light;
                color: #fff;
            }
        }
        &.--cancel {
            color: #000;
            &:hover {
                background-color: #000;
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
