<template>
    <div
        class="addEditMagazine"
        v-on-clickaway="close"
    >
        <p class="heading">
            {{ magazine.title }} will be sent to you! Please make sure that the following information is correct. If it is correct, select 'send magazine'.
        </p>
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
            <app-button
                @click.native="postSelection"
                class="btn btn-orange"
                text="Send Magazine"
            />
            <app-button
                @click.native="close"
                class="btn btn-orange"
                text="Pick a Different Magazine"
            />
        </div>

    </div>
</template>

<script>
// dependencies
import { mapMutations } from "vuex";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";
// components
import TextInput from "@/components/Shared/Inputs/TextInput";
import AppButton from "@/components/Shared/AppButton";
// mixins
import { mixin as clickaway } from "vue-clickaway";

export default {
    name: "ConfirmInfoModal",
    mixins: [clickaway],
    props: {
        loanInfo: {
            type: Object,
        },
        magazine: {
            type: Object,
        },
    },
    components: {
        "text-input": TextInput,
        "app-button": AppButton,
    },
    data() {
        return {
            localLoanInfo: { ...this.loanInfo },
            thankyouModalShowing: false,
        };
    },
    computed: {},
    methods: {
        ...mapMutations(["SET_LOADING"]),
        close() {
            this.$emit("close");
        },
        async postSelection() {
            const payload = [
                {
                    loanNumber: this.$route.query.loanNumber,
                    loanNumberIsEncoded: true,
                    magazine: {
                        id: this.magazine.id,
                    },
                },
            ];
            const response = await this.saveBorrowerInfo();
            if (response.status === 200) {
                this.saveMagazineChoice(payload);
            }
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
                return api.magazines
                    .manageBorrowerInformation(borrowerInfo)
                    .then((response) => response)
                    .catch((error) => {
                        handleApiError(error);
                    });
            }
            return 0;
        },
        saveMagazineChoice(payload) {
            api.magazines
                .setMagazineChoice(payload)
                .then((response) => {
                    if (response.status === 200) {
                        this.SET_LOADING(false, { root: true }); // start loading spinner
                        this.$emit("thankyou");
                        this.$emit("close");
                    }
                })
                .catch((error) => {
                    handleApiError(error);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.addEditMagazine {
    position: fixed;
    top: 15rem;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    padding: 4rem 6rem;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
    .heading {
        color: $gray-dark;
        text-align: center;
        font-size: 2.2rem;
        margin-bottom: 3rem;
        font-weight: 800;
    }
}

.inline-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .form-group {
        width: 45%;
    }
}
label {
    font-weight: 700;
}

.form-controls {
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
    .btn {
        margin-right: 1.5rem;
        cursor: pointer;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
}

@include slideDownEnter("editBorrower", 10rem, 15rem);
</style>
