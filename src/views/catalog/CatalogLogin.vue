<template>
    <div class="loginPage">
        <div class="loginBox">
            <img
                class="loginLogo"
                src="https://webresources.ruoff.com/ruoff-marketing-logo-color/png/0/70"
                alt="Ruoff Marketing Logo"
            />

            <h1>Catalog Site</h1>

            <input style="display:none" />
            <input
                type="password"
                style="display:none"
            />
            <!-- Login Form -->
            <ValidationObserver
                ref="loginObserver"
                tag="form"
            >
                <div
                    v-if="formType == 'login'"
                    class="loginForm"
                >
                    <div class="form-group">
                        <label for="username">User Name</label>
                        <ValidationProvider
                            name="Username"
                            mode="passive"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <text-input
                                v-model="username"
                                type="text"
                                name="username"
                            />
                            <span class="errorMessage">{{ errors[0] }}</span>
                        </ValidationProvider>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <ValidationProvider
                            name="Password"
                            mode="passive"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <text-input
                                v-model="password"
                                type="password"
                                name="password"
                            />
                            <span class="errorMessage">{{ errors[0] }}</span>
                        </ValidationProvider>
                    </div>
                    <app-button
                        type="button"
                        class="btn btn-green"
                        text="Log In"
                        @click.native="login"
                    />
                </div>
            </ValidationObserver>

            <!-- Register Form -->
            <ValidationObserver
                ref="registerObserver"
                tag="form"
            >
                <div
                    v-if="formType == 'register'"
                    class="registerForm"
                >
                    <!-- Name -->
                    <div class="inline-group">
                        <div class="form-group">
                            <label for="username">First Name</label>
                            <ValidationProvider
                                name="firstName"
                                mode="passive"
                                rules="required"
                                v-slot="{ errors }"
                            >
                                <text-input
                                    v-model="firstName"
                                    type="text"
                                    name="firstName"
                                />
                                <span class="errorMessage">{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                        <div class="form-group">
                            <label for="username">Last Name</label>
                            <ValidationProvider
                                name="lastName"
                                mode="passive"
                                rules="required"
                                v-slot="{ errors }"
                            >
                                <text-input
                                    v-model="lastName"
                                    type="text"
                                    name="lastName"
                                />
                                <span class="errorMessage">{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="form-group">
                        <label for="username">Email</label>
                        <ValidationProvider
                            name="email"
                            mode="passive"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <text-input
                                v-model="email"
                                type="text"
                                name="email"
                            />
                            <span class="errorMessage">{{ errors[0] }}</span>
                        </ValidationProvider>
                    </div>

                    <!-- Preferred LO -->
                    <div class="form-group">
                        <label for="">Preferred Loan Officer</label>
                        <div class="multiselect-wrapper">
                            <multi-select
                                v-model="preferredLo"
                                track-by="employeeNumber"
                                label="fullName"
                                :custom-label="customLabel"
                                placeholder="Select Loan Officer"
                                selectLabel=""
                                deselectLabel=""
                                selectedLabel=""
                                :preserve-search="true"
                                :options="users.loanOfficers"
                            >
                            </multi-select>
                        </div>
                    </div>

                    <app-button
                        type="button"
                        class="btn btn-green"
                        text="Register"
                        @click.native="register"
                    />
                </div>
            </ValidationObserver>

            <!-- Forgot Password Form -->
            <ValidationObserver
                ref="forgotPasswordObserver"
                tag="form"
            >
                <div
                    v-if="formType == 'forgot'"
                    class="loginForm"
                >
                    <div class="form-group">
                        <label for="username">Email</label>
                        <ValidationProvider
                            name="email"
                            mode="passive"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <text-input
                                v-model="email"
                                type="text"
                                name="email"
                            />
                            <span class="errorMessage">{{ errors[0] }}</span>
                        </ValidationProvider>
                    </div>
                    <app-button
                        type="button"
                        class="btn btn-green"
                        text="Send Email"
                        @click.native="sendForgotPasswordEmail"
                    />
                </div>
            </ValidationObserver>

            <!-- Controls -->
            <div class="navControls">
                <span
                    v-if="formType !== 'forgot'"
                    class="link"
                    @click="changeForms('forgot')"
                >
                    Forgot Password
                </span>
                <span v-if="formType !== 'forgot'">|</span>
                <span
                    v-if="formType !== 'login'"
                    class="link"
                    @click="changeForms('login')"
                >
                    Login
                </span>
                <span v-if="formType == 'forgot'">|</span>
                <span
                    v-if="formType !== 'register'"
                    class="link"
                    @click="changeForms('register')"
                >
                    Register
                </span>
            </div>

            <transition name="slide">
                <div
                    class="error"
                    v-if="auth.status == 'error'"
                >
                    {{ authError }}
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
// dependencies
import Vue from "vue";
import { mapActions, mapState, mapMutations } from "vuex";
import api from "@/store/api";
import { handleApiError } from "@/store/helpers";

export default {
    name: "CatalogLogin",
    components: {
        "text-input": () => import("@/components/Shared/Inputs/TextInput"),
        "app-button": () => import("@/components/Shared/AppButton"),
        "multi-select": () => import("vue-multiselect"),
    },
    data() {
        return {
            formType: "login",
            username: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            email: "",
            preferredLo: localStorage.getItem("preferredLo") || null,
            authFailed: false,
            authError: "Invalid username or password",
        };
    },
    computed: {
        ...mapState(["auth", "users"]),
    },
    methods: {
        ...mapActions(["logIn", "fetchLoanOfficers"]),
        ...mapMutations(["AUTH_PENDING", "SET_LOADING"]),
        changeForms(type) {
            this.formType = type;
            this.resetForms();
        },
        async login() {
            const isValid = await this.$refs.loginObserver.validate();
            if (isValid) {
                const creds = {
                    username: this.username,
                    password: this.password,
                };
                await this.logIn(creds);
                this.$router.push("/catalog/library");
            }
        },
        async register() {
            const isValid = await this.$refs.registerObserver.validate();
            if (isValid) {
                const creds = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    username: this.email,
                    password: Math.random().toString(36).slice(-8),
                    preferredLo: this.preferredLo.employeeNumber || null,
                };
                this.SET_LOADING(true, { root: true }); // start loading spinner
                await api.catalog
                    .register(creds)
                    .then((response) => {
                        if (response.status === 200) {
                            if (this.preferredLo !== null) {
                                localStorage.setItem(
                                    "preferredLo",
                                    JSON.stringify({
                                        employeeNumber: this.preferredLo
                                            .employeeNumber,
                                        name: this.preferredLo.fullName,
                                    })
                                );
                            }

                            Vue.toasted.success(
                                "Thank you! Please check your email for further instructions."
                            );
                            this.formType = "login";

                            this.SET_LOADING(false, { root: true }); // stop loading spinner
                        }
                    })
                    .catch((error) => {
                        handleApiError(error, error.response.data.detail);
                    });
            }
        },
        async sendForgotPasswordEmail() {
            const isValid = await this.$refs.forgotPasswordObserver.validate();

            if (isValid) {
                this.SET_LOADING(true, { root: true }); // start loading spinner
                await api.catalog
                    .forgotPassword(this.email)
                    .then((response) => {
                        if (response.status === 200) {
                            Vue.toasted.success(
                                "Please check your email for further instructions."
                            );
                        }
                        this.formType = "login";
                        this.SET_LOADING(false, { root: true }); // stop loading spinner
                    })
                    .catch((error) => {
                        handleApiError(error);
                    });
            }
        },
        resetForms() {
            this.username = "";
            this.password = "";
            this.confirmPassword = "";
            this.firstName = "";
            this.lastName = "";
            this.email = "";
            this.AUTH_PENDING(); // reset auth status to clear error if present
        },
        customLabel({ firstName, lastName }) {
            return `${lastName}, ${firstName}`;
        },
    },
    created() {
        this.fetchLoanOfficers();
    },
};
</script>

<style lang="scss" scoped>
.loginPage {
    height: 100vh;
    width: 100vw;
    background-image: url("~@/assets/images/login/loginPage_bg.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    h1 {
        color: $teal-light;
        margin-bottom: 2rem;
        font-weight: 800;
    }
    .navControls {
        margin-top: 3rem;
        text-align: center;
        color: $gray;
        .link {
            // text-decoration: underline;
            cursor: pointer;
            transition: color 0.5s;
            &:hover {
                color: $orange;
            }
        }
    }
    .registerForm,
    .loginForm {
        width: 35rem;
        @include breakpoint(tablet-land) {
            width: 100%;
        }
    }
}
.loginLogo {
    display: block;
    margin: 0 0 4rem;
    @include breakpoint(tablet-land) {
        width: 80%;
    }
}
h2 {
    margin-bottom: 4rem;
}
.loginBox {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 47rem;
    padding: 2rem 6rem 4rem;
    background-color: #fff;
    @include breakpoint(tablet-port) {
        width: 92%;
        padding: 2rem 2rem 4rem;
    }
    @include breakpoint(mobile-small) {
        position: static;
        left: unset;
        top: unset;
        transform: none;
        margin: 0 auto;
    }
    label {
        color: #333;
        font-weight: 700;
    }
    button {
        width: 18rem;
        display: block;
        margin: 3rem auto 0;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
    .inline-group {
        display: flex;
        justify-content: space-between;
        width: 100%;
        @include breakpoint(mobile-small) {
            flex-wrap: wrap;
        }
        .form-group {
            width: 45%;
            @include breakpoint(mobile-small) {
                width: 100%;
            }
        }
    }
    .error {
        position: absolute;
        bottom: 12.1rem;
        font-size: 1.4rem;
        color: $red;
        font-weight: 600;
    }
}

// TRANSITIONS
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.slide-enter,
.slide-leave-to {
    transform: translateX(-3rem);
    opacity: 0;
}
</style>
