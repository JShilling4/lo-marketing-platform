<template>
    <div class="addEditEmail">
        <!-- Inputs -->
        <div
            v-if="action !== 'view'"
            class="col col1"
        >
            <ValidationObserver
                ref="observer"
                tag="form"
                @submit.prevent="handleSubmit()"
            >
                <h1>Create Email:</h1>
                <!-- Audience -->
                <div class="form-group">
                    <label for="">Audience</label>
                    <div class="input-group">
                        <div class="input-group">
                            <radio-input
                                check="Referral Partners"
                                name="audience"
                                id="referralPartners"
                                labelFor="referralPartners"
                                label="Referral Partners"
                                v-model="email.audience"
                            />
                        </div>
                        <div class="input-group">
                            <radio-input
                                check="Loan Officers"
                                name="audience"
                                id="loanOfficers"
                                labelFor="loanOfficers"
                                label="Loan Officers"
                                v-model="email.audience"
                            />
                        </div>
                    </div>
                </div>

                <!-- Send to -->
                <div class="form-group">
                    <label for="">Send To</label>
                    <div class="input-group input-group--sendTo">
                        <!-- all -->
                        <div class="input-group">
                            <radio-input
                                check="all"
                                name="recipients"
                                id="recipientsAll"
                                labelFor="recipientsAll"
                                label="All"
                                v-model="email.sendTo"
                            />
                        </div>
                        <!-- custom list -->
                        <div class="input-group input-group--customList">
                            <radio-input
                                check="custom"
                                name="recipients"
                                id="recipientsCustom"
                                labelFor="recipientsCustom"
                                label="Custom"
                                v-model="email.sendTo"
                            />
                            <transition name="slide">
                                <multi-select
                                    v-if="email.sendTo == 'custom'"
                                    v-model="email.recipients"
                                    :multiple="true"
                                    track-by="employeeNumber"
                                    label="fullName"
                                    selectLabel=""
                                    deselectLabel=""
                                    :close-on-select="false"
                                    :preserve-search="true"
                                    :options="allLoanOfficers"
                                >
                                    <template
                                        slot="selection"
                                        slot-scope="{ values, isOpen }"
                                    >
                                        <span
                                            class="multiselect__single"
                                            v-if="values.length && !isOpen"
                                        >
                                            {{ values.length }} selected
                                        </span>
                                    </template>
                                </multi-select>
                            </transition>
                        </div>
                    </div>
                </div>

                <!-- Email Type -->
                <div class="form-group">
                    <label for>Email Type</label>
                    <ValidationProvider
                        name="Email Type"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <div class="multiselect-wrapper">
                            <multi-select
                                v-model="email.emailType"
                                label="type"
                                track-by="id"
                                selectLabel=""
                                deselectLabel=""
                                placeholder=""
                                :options="templates.emailTypes"
                                class="single"
                            />
                        </div>
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

                <!-- Email Template -->
                <div class="form-group">
                    <label for>Select Template</label>
                    <ValidationProvider
                        name="Email Template"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <div class="multiselect-wrapper">
                            <multi-select
                                v-model="base"
                                label="name"
                                track-by="id"
                                selectLabel=""
                                deselectLabel=""
                                placeholder=""
                                :options="templates.baseTemplates"
                                @input="onBaseChange"
                                :disabled="action == 'edit'"
                                class="single"
                            />
                        </div>
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

                <!-- Attachment -->
                <div class="form-group">
                    <label>Attachment</label>
                    <single-file-input
                        type="file"
                        buttonText="Attach File"
                        :file-name="email.attachmentPath"
                        @input="changeAttachment"
                    >
                        <template #removal-button>
                            <i
                                v-if="email.attachmentPath !== '' && email.attachmentPath != null"
                                class="fas fa-times-circle removalButton"
                                @click="removeAttachment"
                            />
                        </template>
                    </single-file-input>
                </div>

                <!-- Subject line -->
                <div class="form-group">
                    <label for>Subject Line</label>
                    <ValidationProvider
                        name="Subject Line"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <text-input
                            type="text"
                            name="subjectLine"
                            v-model="email.campaignName"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

                <!-- Variables -->
                <email-variable-input
                    v-for="variable in localVariables"
                    :key="variable.name"
                    :variable="variable"
                    @input-text="variableTextChanged"
                    @input-image="variableFileChanged"
                    @remove-image="variableFileRemoved"
                    @input-link="variableLinkChanged"
                />
                <!-- Send date -->
                <div class="form-group form-group--short">
                    <label>Send Date</label>
                    <ValidationProvider
                        name="Send Date"
                        mode="passive"
                        rules="required"
                        v-slot="{ errors }"
                    >
                        <date-time-picker
                            v-model="email.sendDatetime"
                            color="#f38e36"
                            :no-label="true"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

            </ValidationObserver>
        </div>
        <!-- Email preview -->
        <div
            class="col col2"
            :style="action == 'view' ? 'margin-left:28%' : ''"
        >
            <h1>{{ action == 'view' ? 'View Sent Email:' : 'Preview Email:' }}</h1>
            <div
                v-show="email.baseTemplate !== ''"
                class="col2__button-block"
            >
                <app-button
                    v-if="baseSelected"
                    classes="btn btn-blue"
                    class="sendTest"
                    @click.native="onSendTestEmail"
                    text="Send Test"
                />
                <span
                    v-else-if="action !== 'view'"
                    class="noPreview"
                >Select a template to see the preview.</span>
            </div>
            <div class="previewContainer">
                <div
                    ref="content"
                    v-html="email.content"
                    class="content"
                ></div>
                <div
                    ref="altContent"
                    v-html="email.alternateContent"
                    class="altContent"
                ></div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="col col3">
            <app-button
                v-if="baseSelected"
                classes="btn btn-green"
                @click.native="submitEmail"
                text="Submit"
            />
            <app-button
                v-if="baseSelected"
                classes="btn btn-orange"
                @click.native="saveEmail"
                text="Save Draft"
            />
            <app-button
                classes="btn btn-black"
                @click.native="
                    openConfirmModal(
                        'cancel',
                        'Unsaved changes will be lost. Are you sure you want to continue?'
                    )
                "
                :text="this.action == 'view' ? 'Back' : 'Cancel'"
            />
            <app-button
                v-if="this.action !== 'create' && this.action !== 'duplicate' && baseSelected"
                classes="btn btn-red"
                @click.native="
                    openConfirmModal(
                        'delete',
                        'Deleting this email is permanent. Are you sure you want to continue?'
                    )
                "
                text="Delete"
            />

        </div>

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
// reactivity dependencies
import Vue from "vue";
import { mapGetters, mapActions, mapState } from "vuex";
// components
import Multiselect from "vue-multiselect";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import EmailVariableInput from "@/components/Admin/EmailManagement/EmailVariableInput";
import TextInput from "@/components/Shared/Inputs/TextInput";
import RadioInput from "@/components/Shared/Inputs/RadioInput";
import SingleFileInput from "@/components/Shared/Inputs/SingleFileInput";
// method dependencies
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";
import { marketingS3bucket } from "../../../env";
// external stylesheets
import "@/scss/vendor/vue-ctk-date-time-picker.scss";

// component data & scripts
export default {
    name: "AddEditEmail",
    components: {
        "multi-select": Multiselect,
        "email-variable-input": EmailVariableInput,
        "date-time-picker": VueCtkDateTimePicker,
        "text-input": TextInput,
        "radio-input": RadioInput,
        "single-file-input": SingleFileInput,
        "confirmation-modal": ConfirmationModal,
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    props: {
        selectedEmail: {
            type: Object,
            required: false,
        },
        selectedBase: {
            type: Object,
        },
        action: {
            type: String,
        },
    },
    data() {
        return {
            email: JSON.parse(JSON.stringify({ ...this.selectedEmail })), // prop to local variable conversion
            base: { ...this.selectedBase }, // prop to local variable conversion
            baseSelected: false, // tells the UI if user has selected a template
            fileObjects: [], // we store variables that have files here
            localVariables: null, // template variables pulled from the html on load
            sendTest: false, // flag determines if a test email should be sent
            testRecipientEmail: null, // user email to send test to
            confirmModal: {
                showing: false,
                message: "",
                event: "",
            },
        };
    },
    computed: {
        ...mapState(["users", "templates"]),
        ...mapGetters(["baseTemplateById", "allLoanOfficers"]),
        /**
         * @desc Determines what to display for the attachment file name
         *
         */
        attachmentFilename() {
            if (this.email.attachmentPath == null) {
                return "No file selected";
            }
            if (this.email.attachmentPath instanceof File) {
                return this.email.attachmentPath.name;
            }
            return this.email.attachmentPath.split("/").pop();
        },
    },
    methods: {
        ...mapActions(["createEmail", "deleteEmail", "reserveBatchId"]),
        /**
         * @desc When a base template is selected from the dropdown, this function will
         * adjust the UI, update the preview html, create a local container for template variables,
         * update the alt html, and copy template id into the email object
         *
         */
        onBaseChange() {
            this.baseSelected = true; // toggles the edit buttons on
            this.base = this.baseTemplateById(this.base.id); // find this template in the store
            this.localVariables = JSON.parse(
                JSON.stringify([...this.base.variables])
            ); // create a holder for local variables
            this.email.content = this.base.baseContent; // start our html off with the base html
            this.email.alternateContent = this.base.alternateBaseContent; // load the alternate html
            this.email.template.id = this.base.id; // copy the base id into the email template id (needed for post)
        },
        /**
         * @desc This method sets the attachment file from user input in the email object
         * @param {object} file The attachment file object
         *
         */
        changeAttachment(file) {
            this.email.attachmentPath = file;
        },
        removeAttachment() {
            this.email.attachmentPath = "";
        },
        /**
         * @desc Gets new text variables from the editor inputs, strips out html tags,
         * and updates the preview html & alternate html
         * @param {string} text input coming in from ckeditor
         * @param {string} varName the variables identifier in the html
         *
         */
        variableTextChanged(text, varName) {
            const targets = document.querySelectorAll(
                `[data-variable='${varName}`
            );

            targets.forEach((target) => {
                target.innerHTML = text;
                // add a margin to editor paragraphs (more accurate preview->email relation)
                Array.from(target.children).forEach((child, index) => {
                    if (index < target.children.length - 1) {
                        child.classList.add("editorParagraph");
                    }
                });
            });
        },
        /**
         * @desc Gets user uploaded files from inputs, uses FileReader API to inject base64 into
         * html for live preview of image uploads
         * @param {object} file the image just added to input
         * @param {string} varName the variable identifier in the html
         *
         */
        variableFileChanged(file, varName) {
            const targets = document.querySelectorAll(
                `[data-variable='${varName}`
            );
            // grab the image from the file input and inject into preview html
            targets.forEach((target) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // determine if file is for an img or anchor tag
                    if (target.dataset.type == "image") {
                        target.src = e.target.result;
                    } else {
                        target.href = e.target.result;
                    }
                };
                reader.readAsDataURL(file); // base64 the image
            });

            // store the variable info in case this email is posted
            if (!this.fileObjects.some((obj) => obj.name == varName)) {
                this.fileObjects.push({ name: varName, value: file });
            } else {
                // user changed the file, delete old and replace with new
                const index = this.fileObjects
                    .map((obj) => obj.name)
                    .indexOf(varName);
                this.fileObjects.splice(index, 1);
                this.fileObjects.push({ name: varName, value: file });
            }
        },
        variableFileRemoved(varName) {
            const index = this.fileObjects
                .map((obj) => obj.name)
                .indexOf(varName);
            this.fileObjects.splice(index, 1);
        },
        /**
         * @desc Gets new link value from input (could be file or URL), determines it's type - if it
         * is an image it will pass its values to the variable image handler, else it updates the href in the html
         * @param {string} value input coming in from input
         * @param {string} varName the variables identifier in the html
         *
         */
        variableLinkChanged(value, varName) {
            if (value instanceof Object) {
                // if this is a file, forward values to our file variable handler
                this.variableFileChanged(value, varName);
            } else {
                // the link is a URL, update the hrefs in the preview & alt html
                const targets = document.querySelectorAll(
                    `[data-variable='${varName}`
                );
                targets.forEach((target) => {
                    target.href = value;
                });
            }
        },
        /**
         * @desc An email has been scheduled.  Updates the email status, starts form validation, calls method
         * that handles the server request
         *
         */
        async submitEmail() {
            this.email.status = "Scheduled";
            const isValid = await this.$refs.observer.validate();
            if (!isValid) {
                // console.log('there are validation errors...');
            } else {
                this.handleSubmit();
            }
        },
        /**
         * @desc Flags the new email as a draft before calling method to handle server request
         * Validation is bypassed
         *
         */
        saveEmail() {
            this.email.status = "Draft";
            this.handleSubmit();
        },
        /**
         * @desc Calls deleteEmail vuex action with the email id. Removes email from UI and DB
         *
         */
        onDeleteEmail() {
            this.deleteEmail(this.email.id);
            this.$emit("close");
        },
        /**
         * @desc Prepares the email data to post to the server
         */
        async handleSubmit() {
            const formData = new FormData();
            this.email.variables = this.fileObjects; // variables are in the html, but we need to send file objects separately
            // if present, get the attachment file object and key/value it
            if (this.email.attachmentPath instanceof File) {
                // wrap the attachment up in a form object
                formData.append("attachmentFile", this.email.attachmentPath);
            }

            // loop through variables and replace html with file path
            this.fileObjects.forEach((obj) => {
                const { name, value } = obj;
                const targets = document.querySelectorAll(
                    `[data-variable='${name}`
                );
                // here we look at our file variables and change the appropriate src attributes to
                // the path where the images will exist shortly
                targets.forEach((target) => {
                    if (target.dataset.type == "image") {
                        target.src = `https://${marketingS3bucket}.s3.amazonaws.com/files/emails/${this.email.id}/${value.name}`;
                    } else {
                        target.href = `https://${marketingS3bucket}.s3.amazonaws.com/files/emails/${this.email.id}/${value.name}`;
                    }
                });
                formData.append(name, value); // we need to wrap them up in a form wrapper for the post
            });
            // grab the html from the preview (this is the email html)
            this.email.content = this.$refs.content.innerHTML;
            this.email.alternateContent = this.$refs.altContent.innerHTML;

            // get the post payload ready
            const payload = JSON.parse(JSON.stringify({ ...this.email })); // needs a deep copy for nested data
            formData.append("payload", JSON.stringify(payload));

            // post the form submit / send test email if it was clicked
            this.$store.commit("SET_LOADING", true, { root: true }); // start loading spinner

            // close the edit view if a test was not requested
            if (!this.sendTest) {
                this.$emit("close");
            }

            const createResp = await this.createEmail(formData); // wait for email post before sending a test
            this.$store.commit("SET_LOADING", false, { root: true }); // close loading spinner

            // send the test email if it is flagged
            if (createResp.status == "200" && this.sendTest) {
                api.emails
                    .sendTestEmail(this.email.id, this.testRecipientEmail)
                    .then((response) => {
                        // if create email successful, commit to store
                        if (response.status == "200") {
                            Vue.toasted.success("Test email is on the way!");
                        }
                    })
                    .catch((error) => {
                        handleApiError(error);
                    });
                this.$refs.content.innerHTML = this.email.content;
                this.$refs.altContent.innerHTML = this.email.alternateContent;
            }
            this.sendTest = false;
        },
        /**
         * @desc Sets send test flag to true and grabs the active user's email before
         * calling saveEmail()
         *
         */
        onSendTestEmail() {
            this.sendTest = true;
            this.testRecipientEmail = this.users.activeUser.email;
            this.saveEmail();
        },
        /**
         * @desc this method provides the multiselect component with a custom label for the dropdown
         * items. It concats props inside the object that the component takes for options
         * @param {string} firstName
         * @param {string} lastName
         *
         */
        customLabel({ firstName, lastName }) {
            return `${firstName} ${lastName}`;
        },
        openConfirmModal(event, message) {
            if (this.action !== "view") {
                this.confirmModal.event = event;
                this.confirmModal.message = message;
                this.confirmModal.showing = true;
            } else {
                this.$emit("close");
            }
        },
        handleConfirmModalEvent(confirmed) {
            if (confirmed) {
                switch (this.confirmModal.event) {
                    case "cancel":
                        this.$emit("close");
                        break;
                    case "delete":
                        this.onDeleteEmail();
                        break;
                    default:
                        return;
                }
            }
            this.confirmModal.message = "";
            this.confirmModal.showing = false;
        },
    },
    mounted() {
        this.localVariables = []; // reset local variables when edit opened
        // if this is a new email we hit an endpoint and use response as the batch id
        if (this.action == "create" || this.action == "duplicate") {
            this.reserveBatchId().then((response) => {
                this.email.id = response.data.id;
            });
        }
        // clear certain fields on a duplicate
        if (this.action == "duplicate") {
            this.email.content = this.selectedBase.baseContent; // start our html off with the base html
            this.email.alternateContent = this.selectedBase.alternateBaseContent; // load the alternate html
        }

        // this is an edit, so lets create variables to bind inputs with the preview values
        const locVars = document.querySelectorAll(".content [data-variable]");
        locVars.forEach((lv) => {
            const locVar = {};
            locVar.name = lv.dataset.variable;
            locVar.type = lv.dataset.type;

            if (this.action == "edit") {
                if (lv.dataset.type == "text") {
                    locVar.value = lv.innerHTML;
                } else if (lv.dataset.type == "image") {
                    locVar.value = lv.src;
                } else if (lv.dataset.type == "link") {
                    locVar.value = lv.href;
                }
            }

            this.localVariables.push(locVar);
        });
        // tell the ui a template has been selected, if it has
        if (this.action == "edit" || this.action == "duplicate") {
            this.baseSelected = true;
        }
    },
};
</script>

<style lang="scss" scoped>
.addEditEmail {
    display: flex;
    .noPreview {
        display: block;
        margin-top: 4rem;
        font-size: 1.8rem;
    }
    h1 {
        font-weight: 800;
    }
}
form {
    min-width: 36rem;
    h1 {
        margin-bottom: 4rem;
    }
    .form-group {
        &--short {
            width: 22rem;
        }
    }
    ::v-deep button {
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
    label {
        font-weight: 700;
    }
    .input-group {
        align-items: center;
        label {
            font-weight: normal;
            margin-bottom: 0;
            margin-left: 0.5rem;
            font-size: 12px;
        }
        &--sendTo {
            height: 3rem;
            margin-top: -0.75rem;
        }
        &--customList {
            .multiselect {
                margin-left: -1rem;
            }
        }
    }
    .multiselect {
        width: 22rem;
        transform-origin: left;
    }
    .field-input {
        font-size: 12px;
        max-height: 3.6rem;
        min-height: unset;
    }
    .ck-editor__editable_inline {
        margin: 9px 0;
    }
}
.previewContainer {
    position: relative;
    width: 100%;
    margin-top: 2rem;
    overflow: hidden;
    .content {
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        border: 0;
    }
    .altContent {
        display: none;
    }
    .editorParagraph {
        margin-bottom: 20px;
        &:not(:last-child) {
            margin-bottom: 20px;
        }
    }
}
.col1 {
    width: 30%;
    .removalButton {
        margin-left: 1rem;
        font-size: 16px;
        color: $red;
        cursor: pointer;
        z-index: 11;
    }
}
.col2 {
    position: relative;
    width: 60%;
    margin-left: 12rem;
    .sendTest {
        margin-top: 1rem;
        margin-left: 1rem;
    }
    button {
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
}
.col3 {
    width: 10%;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    button {
        margin-bottom: 2rem;
        width: 11rem;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
}

// transitions
.slide-enter-active {
    animation: slideRight 0.3s;
}
.slide-leave-active {
    animation: slideLeft 0.3s;
}

// animations
@keyframes slideRight {
    from {
        // margin-left: 0;
        transform: scaleX(0);
        opacity: 0;
    }
    to {
        // margin-left: 1rem;
        transform: scaleX(1);
        opacity: 1;
    }
}
@keyframes slideLeft {
    from {
        // margin-left: 0;
        transform: scaleX(1);
        opacity: 1;
    }
    to {
        // margin-left: 0;
        transform: scaleX(0);
        opacity: 0;
    }
}
</style>

<style lang="scss">
.previewContainer {
    .content {
        .editorParagraph {
            margin-bottom: 20px;
        }
    }
}
</style>
