<template>
    <div class="addEditReferralPartner">
        <h1
            v-if="this.action === 'edit'"
            class="heading"
        >
            {{ `${localRP.firstName} ${localRP.lastName}` }}
        </h1>
        <h1
            v-else-if="this.action === 'add'"
            class="heading"
        >
            New Referral Partner
        </h1>
        <h1
            v-else
            class="heading"
        >Upload Referral Partner List</h1>
        <validation-observer
            ref="observer"
            tag="form"
        >
            <div v-if="this.action == 'edit' || this.action == 'add'">
                <div class="inline-group">
                    <!-- First Name -->
                    <div class="form-group">
                        <label>First Name</label>
                        <validation-provider
                            name="firstName"
                            mode="passive"
                            :rules="{ required: true, regex: /^[a-z\-'A-Z\x20\.]*$/ }"
                            v-slot="{ errors }"
                        >
                            <text-input
                                v-focus
                                type="text"
                                name="firstName"
                                v-model="localRP.firstName"
                            />
                            <span class="errorMessage">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <!-- Last Name -->
                    <div class="form-group">
                        <label>Last Name</label>
                        <validation-provider
                            name="lastName"
                            mode="passive"
                            :rules="{ required: true, regex: /^[a-z\-'A-Z\x20\.\,]*$/ }"
                            v-slot="{ errors }"
                        >
                            <text-input
                                type="text"
                                name=""
                                v-model="localRP.lastName"
                            />
                            <span class="errorMessage">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                </div>

                <div class="inline-group">
                    <!-- Company -->
                    <div class="form-group">
                        <label>Company</label>
                        <text-input
                            type="text"
                            name="company"
                            v-model="localRP.company"
                        />
                    </div>
                    <!-- Email -->
                    <div class="form-group">
                        <label>Email</label>
                        <validation-provider
                            name="email"
                            mode="passive"
                            rules="required|email"
                            v-slot="{ errors }"
                        >
                            <text-input
                                type="email"
                                name="email"
                                v-model="localRP.email"
                            />
                            <span class="errorMessage">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                </div>
            </div>

            <!-- LO selector -->
            <div
                v-if="userIsLOA && action != 'edit'"
                class="multiselect-wrapper"
            >
                <div class="form-group">
                    <label>Loan Officer <small>(leave empty to add for yourself)</small></label>
                    <multi-select
                        v-model="loanOfficerToAddFor"
                        :options="activeUser.assists"
                        placeholder="Select Loan Officer"
                        track-by="employeeNumber"
                        label="fullName"
                        selectLabel=""
                        selectedLabel=""
                        deselectLabel=""
                    />
                </div>
            </div>

            <!-- File upload for Upload action -->
            <div
                v-if="action == 'upload'"
                class="csv-upload"
            >
                <single-file-input
                    buttonText="Upload CSV"
                    @input="validateUploadFile"
                    :show-file-name="false"
                />
                <div class="uploadStatus-wrapper">
                    <i
                        class="fas"
                        :class="{
              'fa-check-circle': uploadStatus == 'Success!',
              'fa-times': uploadStatus == 'Error!'
            }"
                    />
                    <span
                        class="uploadStatus"
                        :class="{
              '--success': uploadStatus == 'Success!',
              '--error': uploadStatus == 'Error!'
            }"
                    >
                        {{ uploadStatus }} <span>&nbsp;{{ statusMessage }}</span>
                    </span>
                </div>
            </div>

            <!-- Controls -->
            <div class="form-controls">
                <span
                    v-if="action != 'upload'"
                    @click="saveItem"
                    class="control --save"
                >Save</span>
                <span
                    @click="close"
                    class="control --cancel"
                >Cancel</span>
            </div>

        </validation-observer>
    </div>
</template>

<script>
// dependencies
import { mapActions, mapState } from "vuex";

export default {
    name: "AddEditReferralPartner",
    props: {
        rp: {
            type: Object,
        },
        action: {
            type: String,
            default: "edit",
        },
    },
    components: {
        "text-input": () => import("@/components/Shared/Inputs/TextInput"),
        "multi-select": () => import("vue-multiselect"),
        "single-file-input": () =>
            import("@/components/Shared/Inputs/SingleFileInput"),
    },
    data() {
        return {
            localRP: JSON.parse(JSON.stringify({ ...this.rp })),
            loanOfficerToAddFor: null,
            uploadStatus: "",
            statusMessage: "",
        };
    },
    computed: {
        ...mapState(["users"]),
        activeUser() {
            return this.users.activeUser;
        },
        userIsLOA() {
            try {
                return this.activeUser.assists.length > 0;
            } catch {
                return false;
            }
        },
    },
    methods: {
        ...mapActions([
            "editReferralPartner",
            "createReferralPartner",
            "updateReferralPartners",
        ]),
        close() {
            this.$emit("close");
        },
        toggleSubscription(value) {
            if (value == 1) {
                this.localRP.isSubscribed = 0;
            } else {
                this.localRP.isSubscribed = 1;
            }
        },
        async saveItem() {
            const formValid = await this.$refs.observer.validate();
            if (formValid) {
                if (this.action == "edit") {
                    await this.editReferralPartner(this.localRP);
                }
                if (this.action == "add") {
                    this.localRP.employee =
                        this.loanOfficerToAddFor !== null
                            ? this.loanOfficerToAddFor
                            : this.activeUser;
                    await this.createReferralPartner(this.localRP);
                    this.$emit("success");
                }
                this.close();
            }
        },
        async validateUploadFile(file) {
            const loanOfficer =
                this.loanOfficerToAddFor !== null
                    ? this.loanOfficerToAddFor
                    : this.activeUser;
            if (file.name.split(".").pop() !== "csv") {
                this.uploadStatus = "Error!";
                this.statusMessage = "[File must be .CSV]";
            } else {
                this.$emit("file-uploaded", { file, loanOfficer });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.addEditReferralPartner {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 99;
    transform: translate(-50%, -50%);
    width: 600px;
    padding: 4rem 6rem;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
    @include breakpoint(tablet-land) {
        width: 85%;
    }
    @include breakpoint(tablet-port) {
        width: 90%;
        padding-left: 30px;
        padding-right: 30px;
    }
    @include breakpoint(mobile) {
        z-index: 200;
    }
    @include breakpoint(mobile-small) {
    }
    .heading {
        margin-bottom: 2rem;
        font-weight: 800;
    }
}

form {
    label {
        font-weight: 700;
    }
    .inline-group {
        display: flex;
        justify-content: space-between;
        width: 100%;
        @include breakpoint(tablet-port) {
            flex-wrap: wrap;
            display: block;
            flex-direction: row;
        }
        .form-group {
            width: 45%;
            @include breakpoint(tablet-port) {
                width: 85%;
                margin-bottom: 1rem;
            }
        }
    }
    .form-controls {
        display: flex;
        justify-content: flex-start;
        margin-top: 2rem;
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
    .multiselect-wrapper {
        height: 6rem;
        margin-bottom: 4rem;
        .multiselect {
            width: 45%;
            min-width: 20rem;
        }
        small {
            font-weight: normal;
            color: $gray;
        }
    }
    .csv-upload {
        display: flex;
        align-items: center;
        margin: 2rem 0 4rem;
        .uploadStatus-wrapper {
            display: flex;
            align-items: center;
            margin-left: 1rem;
            .fa-check-circle {
                margin-left: 1rem;
                color: $teal-light;
            }
            .fa-times {
                color: $red;
            }
            .uploadStatus {
                font-weight: 600;
                font-size: 14px;
                margin-left: 3px;
                &.--success {
                    color: $teal-light;
                }
                &.--error {
                    color: $red;
                }
            }
        }
    }
}
</style>
