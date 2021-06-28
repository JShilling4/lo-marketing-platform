<template>
    <div
        class="editBorrowerInfo"
        v-on-clickaway="close"
    >
        <h2 class="heading">Edit Borrower Info</h2>
        <ValidationObserver
            ref="observer"
            tag="form"
        >
            <div class="inline-group">
                <!-- Borrower First Name -->
                <div class="form-group">
                    <label>Borrower First Name </label>
                    <ValidationProvider
                        name="borrowerFirstName"
                        mode="passive"
                        v-slot="{ errors }"
                        rules="required"
                    >
                        <text-input
                            v-focus
                            type="text"
                            name="borrowerFirstName"
                            v-model="localLoanInfo.firstName"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <!-- Borrower Last Name -->
                <div class="form-group">
                    <label>Borrower Last Name </label>
                    <ValidationProvider
                        name="borrowerLastName"
                        mode="passive"
                        v-slot="{ errors }"
                        rules="required"
                    >
                        <text-input
                            v-focus
                            type="text"
                            name="borrowerLastName"
                            v-model="localLoanInfo.lastName"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            </div>

            <div class="inline-group">
                <!-- Email -->
                <div class="form-group">
                    <label>Email</label>
                    <ValidationProvider
                        name="email"
                        mode="passive"
                        v-slot="{ errors }"
                        rules="required"
                    >
                        <text-input
                            type="text"
                            name="email"
                            v-model="localLoanInfo.email"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

                <!-- Address -->
                <div class="form-group">
                    <label>Address</label>
                    <ValidationProvider
                        name="address"
                        mode="passive"
                        v-slot="{ errors }"
                        rules="required"
                    >
                        <text-input
                            type="text"
                            name="address"
                            v-model="localLoanInfo.address"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            </div>

            <div class="inline-group">
                <!-- City -->
                <div class="form-group">
                    <label>City</label>
                    <ValidationProvider
                        name="city"
                        mode="passive"
                        v-slot="{ errors }"
                        rules="required"
                    >
                        <text-input
                            type="text"
                            name="city"
                            v-model="localLoanInfo.city"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

                <!-- State -->
                <div class="form-group">
                    <label>State</label>
                    <ValidationProvider
                        name="state"
                        mode="passive"
                        v-slot="{ errors }"
                        rules="required"
                    >
                        <text-input
                            type="text"
                            name="state"
                            v-model="localLoanInfo.state"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>

            </div>

            <!-- Zip -->
            <div class="inline-group">
                <div class="form-group">
                    <label>Zip</label>
                    <ValidationProvider
                        name="zip"
                        mode="passive"
                        v-slot="{ errors }"
                        rules="required"
                    >
                        <text-input
                            type="text"
                            name="zip"
                            v-model="localLoanInfo.zip"
                        />
                        <span class="errorMessage">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            </div>
        </ValidationObserver>

        <div class="form-controls">
            <span
                @click="saveBorrowerInfo"
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
import Vue from "vue";
import { mapMutations } from "vuex";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";
// components
import TextInput from "@/components/Shared/Inputs/TextInput";
// mixins
import { mixin as clickaway } from "vue-clickaway";

export default {
    name: "EditBorrowerInfo",
    mixins: [clickaway],
    props: {
        loanInfo: {
            type: Object,
        },
    },
    components: {
        "text-input": TextInput,
    },
    data() {
        return {
            localLoanInfo: { ...this.loanInfo },
        };
    },
    computed: {},
    methods: {
        ...mapMutations(["SET_LOADING"]),
        close() {
            this.$emit("close");
        },
        async saveBorrowerInfo() {
            const formValid = await this.$refs.observer.validate();
            const borrowerInfo = {
                loanNumber: this.localLoanInfo.loanNumber,
                firstName: this.localLoanInfo.firstName,
                lastName: this.localLoanInfo.lastName,
                email: this.localLoanInfo.email,
                address: this.localLoanInfo.address,
                city: this.localLoanInfo.city,
                state: this.localLoanInfo.state,
                zip: this.localLoanInfo.zip,
            };
            if (formValid) {
                this.SET_LOADING(true, { root: true }); // start loading spinner
                api.magazines
                    .manageBorrowerInformation(borrowerInfo)
                    .then((response) => {
                        if (response.status === 200) {
                            Vue.toasted.success(
                                "Borrower info successfully saved."
                            );
                            this.SET_LOADING(false, { root: true }); // stop loading spinner
                        }
                    })
                    .catch((error) => {
                        handleApiError(error);
                    });

                this.$emit("update", this.localLoanInfo);
                this.close();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.editBorrowerInfo {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 200;
    transform: translate(-50%, -50%);
    width: 600px;
    padding: 4rem 6rem;
    max-height: 98%;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
    @include breakpoint(tablet-land) {
        width: 85%;
    }
    @include breakpoint(tablet-port) {
        width: 90%;
        padding-left: 3rem;
        padding-right: 3rem;
    }
    .heading {
        margin-bottom: 2rem;
        font-weight: 800;
    }
}

.inline-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    @include breakpoint(mobile) {
        flex-wrap: wrap;
        display: block;
        flex-direction: row;
    }
    .form-group {
        width: 45%;
        @include breakpoint(mobile) {
            margin-bottom: 1rem;
            width: 75%;
        }
        label {
            @include breakpoint(mobile) {
                font-size: 1rem;
            }
        }
        .textInput {
            @include breakpoint(mobile) {
                height: 3rem;
                font-size: 10px;
            }
        }
    }
}
label {
    font-weight: 700;
}

.form-controls {
    display: flex;
    justify-content: flex-start;
    margin-top: 2rem;
    @include breakpoint(mobile) {
        margin-top: 3rem;
    }
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
