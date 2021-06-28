<template>
    <div
        v-if="activeUser.email"
        class="profilePage"
    >
        <!-- Avatar & Name -->
        <div class="heading">
            <img
                :src="buildAvatarUrl(activeUser.email, '150', 'ShortcutIcon')"
                class="avatar"
            />
            <h1 class="name">{{ activeUser.fullName }}</h1>
        </div>
        <form ref="profileForm">
            <div class="inner-content">
                <!-- Info column -->
                <div class="info-column">
                    <div class="infoBlock">
                        <span class="line">{{ activeUser.position }}</span>
                        <span class="line">{{ activeUser.cellPhone }}</span>
                        <span class="line">{{ activeUser.email }}</span>
                        <div class="infoBlock__address">
                            <span class="line">{{ activeUser.branch.address1 }} {{ activeUser.branch.address2 }}</span>
                            <span class="line">{{ activeUser.branch.city }}, {{ activeUser.branch.state }}
                                {{ activeUser.branch.zip }}</span>
                        </div>
                    </div>
                    <!-- LO specific -->
                    <div
                        v-if="userIsLoanOfficer"
                        class="lo-preferences"
                    >
                        <!-- Magazine Gift Program -->
                        <div class="form-group">
                            <label>Magazine Gift Program?</label>
                            <div class="input-group">
                                <div class="input-group">
                                    <radio-input
                                        check="1"
                                        name="magazineProgram"
                                        id="magProgram-yes"
                                        labelFor="magProgram-yes"
                                        label="Yes"
                                        @input="postMagazineGiftProgram"
                                        v-model="localUser.isMagazineGiftProgramParticipant"
                                    />
                                </div>
                                <div class="input-group">
                                    <radio-input
                                        check="0"
                                        name="magazineProgram"
                                        id="magProgram-no"
                                        labelFor="magProgram-no"
                                        label="No"
                                        @input="postMagazineGiftProgram"
                                        v-model="localUser.isMagazineGiftProgramParticipant"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- Referral Partner Email  -->
                        <div class="form-group">
                            <label>Referral Partner Email Campaign?</label>
                            <div class="input-group">
                                <div class="input-group">
                                    <radio-input
                                        check="1"
                                        name="rpEmailCampaign"
                                        id="rpEmailCampaign-yes"
                                        labelFor="rpEmailCampaign-yes"
                                        label="Yes"
                                        @input="postReferralPartnerPreferences"
                                        v-model="rpCampaignParticipant"
                                    />
                                </div>
                                <div class="input-group">
                                    <radio-input
                                        check="0"
                                        name="rpEmailCampaign"
                                        id="rpEmailCampaign-no"
                                        labelFor="rpEmailCampaign-no"
                                        label="No"
                                        @input="postReferralPartnerPreferences"
                                        v-model="rpCampaignParticipant"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- RP rates in emails -->
                        <div class="form-group">
                            <label>Send rates in emails?</label>
                            <div class="input-group">
                                <radio-input
                                    name="emailRates"
                                    :check="0"
                                    id="emailRatesYes"
                                    labelFor="emailRatesYes"
                                    label="Yes"
                                    @input="postReferralPartnerPreferences"
                                    v-model="localUser.useAlternateContent"
                                />
                                <radio-input
                                    name="emailRates"
                                    :check="1"
                                    id="emailRatesNo"
                                    labelFor="emailRatesNo"
                                    label="No"
                                    @input="postReferralPartnerPreferences"
                                    v-model="localUser.useAlternateContent"
                                />
                            </div>
                        </div>
                        <!-- Signature Preferences -->
                        <div class="form-group emailSignature">
                            <label>Email Signature Preferences</label>
                            <checkbox-input
                                v-for="option in emailSignatureOptions"
                                :key="option.id"
                                :label="option.name"
                                :labelFor="option.name.split(' ').join('')"
                                :id="option.name.split(' ').join('')"
                                :check="1"
                                v-model="localUser[option.name.split(' ').join('_')]"
                            />

                            <app-button
                                classes="btn btn-green editButton"
                                text="Save"
                                @click.native="postSignaturePreferences"
                            />
                        </div>
                    </div>
                    <!-- Availablitiy (admin) -->
                    <div
                        v-if="userIsAdmin && localUser.availability"
                        class="availability"
                    >
                        <label>Status</label>
                        <div class="input-group">
                            <!-- Active -->
                            <div class="input-group">
                                <radio-input
                                    check="active"
                                    name="userAvailability"
                                    id="statusActive"
                                    labelFor="statusActive"
                                    label="Active"
                                    @input="clearAvailabilityDates"
                                    v-model="localUser.availability"
                                />
                            </div>
                            <!-- Away -->
                            <div class="input-group">
                                <radio-input
                                    check="away"
                                    name="userAvailability"
                                    id="statusAway"
                                    labelFor="statusAway"
                                    label="Away"
                                    @input="clearAvailabilityDates"
                                    v-model="localUser.availability"
                                />
                            </div>
                            <!-- Busy -->
                            <div class="input-group">
                                <radio-input
                                    check="busy"
                                    name="userAvailability"
                                    id="statusBusy"
                                    labelFor="statusBusy"
                                    label="Busy"
                                    @input="clearAvailabilityDates"
                                    v-model="localUser.availability"
                                />
                            </div>
                        </div>
                        <!-- Away date range -->
                        <div
                            v-if="localUser.availability == 'away'"
                            class="inline-group"
                        >
                            <!-- Away Start Date -->
                            <div class="form-group">
                                <label class="subLabel">Away From:</label>
                                <date-time-picker
                                    color="#16af8c"
                                    :no-label="true"
                                    label="Select date & time"
                                    :no-weekends-days="true"
                                    v-model="localUser.awayStartDatetime"
                                />
                            </div>
                            <!-- Away End Date -->
                            <div class="form-group">
                                <label class="subLabel">Away Until:</label>
                                <date-time-picker
                                    color="#16af8c"
                                    :no-label="true"
                                    label="Select date & time"
                                    :no-weekends-days="true"
                                    v-model="localUser.awayEndDatetime"
                                />
                            </div>
                        </div>

                        <app-button
                            classes="btn btn-green editButton"
                            text="Save Status"
                            @click.native="postAvailability"
                        />
                    </div>
                </div>

                <!-- Notifications -->
                <div
                    v-if="localUser.notificationPreferences"
                    class="notifications"
                >
                    <h2 class="heading">Notification Preferences</h2>
                    <div class="column-wrapper">
                        <!-- Notification column 1 -->
                        <div class="notifications__column-1">
                            <!-- Order Preferences -->
                            <div class="notification-group">
                                <h2 class="group-header">Order Preferences</h2>
                                <div
                                    v-for="preference in orderPreferences"
                                    :key="preference.id"
                                    class="input-block"
                                >
                                    <label>{{ preference.name }}</label>
                                    <div class="input-group">
                                        <checkbox-input
                                            check="1"
                                            :id="`${preference.name.split(' ').join('')}-email`"
                                            :labelFor="`${preference.name.split(' ').join('')}-email`"
                                            label="Email"
                                            v-model="preference.receiveEmail"
                                        />
                                        <checkbox-input
                                            check="1"
                                            :id="`${preference.name.split(' ').join('')}-notifCenter`"
                                            :labelFor="`${preference.name.split(' ').join('')}-notifCenter`"
                                            label="Notification Center"
                                            v-model="preference.receiveNotification"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Notification column 2 -->
                        <div class="notifications__column-2">
                            <!-- Client/Referral Partner Preferences -->
                            <div
                                v-if="userIsLoanOfficer"
                                class="notification-group"
                            >
                                <h2 class="group-header">Client/Referral Partner Preferences</h2>
                                <div
                                    v-for="preference in loPreferences"
                                    :key="preference.id"
                                    class="input-block"
                                >
                                    <label>{{ preference.name }}</label>
                                    <div class="input-group">
                                        <checkbox-input
                                            check="1"
                                            :id="`${preference.name.split(' ').join('')}-email`"
                                            :labelFor="`${preference.name.split(' ').join('')}-email`"
                                            label="Email"
                                            v-model="preference.receiveEmail"
                                        />
                                        <checkbox-input
                                            check="1"
                                            :id="`${preference.name.split(' ').join('')}-notifCenter`"
                                            :labelFor="`${preference.name.split(' ').join('')}-notifCenter`"
                                            label="Notification Center"
                                            v-model="preference.receiveNotification"
                                        />
                                    </div>
                                </div>
                            </div>
                            <!-- Admin Preferences -->
                            <div
                                v-if="userIsAdmin"
                                class="notification-group"
                            >
                                <h2 class="group-header">Admin Preferences</h2>
                                <div
                                    v-for="preference in adminPreferences"
                                    :key="preference.id"
                                    class="input-block"
                                >
                                    <label>{{ preference.name }}</label>
                                    <div class="input-group">
                                        <checkbox-input
                                            check="1"
                                            :id="`${preference.name.split(' ').join('')}-email`"
                                            :labelFor="`${preference.name.split(' ').join('')}-email`"
                                            label="Email"
                                            v-model="preference.receiveEmail"
                                        />
                                        <checkbox-input
                                            check="1"
                                            :id="`${preference.name.split(' ').join('')}-notifCenter`"
                                            :labelFor="`${preference.name.split(' ').join('')}-notifCenter`"
                                            label="Notification Center"
                                            v-model="preference.receiveNotification"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <app-button
                        type="button"
                        classes="btn btn-green saveProfile"
                        text="Save Notification Preferences"
                        @click.native="postNotificationPreferences"
                    />
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
// mixins
import { avatars } from "@/mixins";
// modules
import api from "../store/api";

export default {
    name: "ProfilePage",
    mixins: [avatars],
    components: {
        "radio-input": () => import("@/components/Shared/Inputs/RadioInput"),
        "checkbox-input": () =>
            import("@/components/Shared/Inputs/CheckboxInput"),
        "app-button": () => import("@/components/Shared/AppButton"),
        "date-time-picker": () => import("vue-ctk-date-time-picker"),
    },
    data() {
        return {
            localUser: {},
            emailSignatureOptions: [],
        };
    },
    computed: {
        ...mapState(["users"]),
        ...mapGetters(["allLoanOfficers"]),
        activeUser() {
            return this.users.activeUser;
        },
        userIsAdmin() {
            try {
                return this.activeUser.userRoles.includes(
                    "ROLE_MARKETING_EMPLOYEE"
                );
            } catch (error) {
                /* handle error if needed */
            }
            return false;
        },
        userIsLoanOfficer() {
            if (this.activeUser.nmls !== null) {
                return true;
            }
            return false;
        },
        rpCampaignParticipant: {
            get() {
                const { emailSubscriptions } = this.localUser;
                if (emailSubscriptions.length > 0) {
                    return emailSubscriptions.some(
                        (sub) => sub.type == "Referral Partner"
                    )
                        ? 1
                        : 0;
                }
                return false;
            },
            set(newValue) {
                this.localUser.referralPartnerCampaign = newValue;
            },
        },
        adminPreferences() {
            return this.localUser.notificationPreferences.filter((preference) => preference.type == 'admin')
        },
        loPreferences() {
            return this.localUser.notificationPreferences.filter((preference) => preference.type == 'loanOfficer')
        },
        orderPreferences() {
            return this.localUser.notificationPreferences.filter((preference) => preference.type == 'order' && this.userHasAccess(preference))
        }
    },
    watch: {
        activeUser(newValue) {
            this.localUser = { ...newValue, ...this.localUser };
        },
    },
    methods: {
        ...mapActions([
            "fetchEmployee",
            "fetchLoanOfficers",
            "setActiveUser",
            "updateActiveUser",
            "updateAvailability",
            "updateNotificationPreferences",
            "updateUserRpCampaign",
            "updateSignaturePreferences",
            "updateUserMagazineGiftProgram",
            "fetchEmployees",
            "postNotification",
        ]),
        userHasAccess(preference) {
            if (preference.isAdminOnly == 1) {
                if (this.userIsAdmin) {
                    return true;
                }
                return false;
            }
            if (preference.isNonAdmin == 1) {
                if (!this.userIsAdmin) {
                    return true;
                }
                return false;
            }
            return true;
        },
        clearAvailabilityDates() {
            if (this.localUser.availability !== "away") {
                this.localUser.awayStartDatetime = null;
                this.localUser.awayEndDatetime = null;
            }
        },
        async postAvailability() {
            const {
                employeeNumber,
                availability,
                awayStartDatetime,
                awayEndDatetime,
            } = this.localUser;
            // only send the request if user made a change
            if (availability !== this.activeUser.availability) {
                this.updateAvailability({
                    employeeNumber,
                    availability,
                    awayStartDatetime,
                    awayEndDatetime,
                });
                this.updateActiveUserObject();

                const recipients = [];

                const res = await api.users.fetchMarketingEmployees_short();
                const marketingEmployees =
                    res.data.data.marketingV1GetMarketingEmployees;
                marketingEmployees.forEach((emp) => {
                    const pref = emp.notificationPreferences.find(
                        (np) => np.id == 7
                    );
                    if (
                        emp.employeeNumber !== this.activeUser.employeeNumber &&
                        pref?.receiveNotification == 1
                    ) {
                        recipients.push(emp.employeeNumber);
                    }
                });

                // build the notification object
                const notification = {
                    id: null,
                    recipients,
                    isRead: 0,
                    createdDatetime: null,
                    message: `
                        <strong>${this.activeUser.fullName}</strong> has updated their status to <strong>
                        ${
                            availability.charAt(0).toUpperCase() +
                            availability.slice(1)
                        }
                        </strong>
                    `,
                    destinationUrl: "",
                    isAvailabilityNotice: true,
                };

                const response = await this.postNotification(notification);
                if (response.status == 200) {
                    if (this.$socket) {
                        notification.id = response.data.id;
                        notification.createdDatetime =
                            response.data.createdDatetime;
                        this.$socket.emit("createNotification", notification);
                    }
                }
            }
        },
        postMagazineGiftProgram() {
            const {
                employeeNumber,
                isMagazineGiftProgramParticipant,
            } = this.localUser;
            this.updateUserMagazineGiftProgram({
                employeeNumber,
                isMagazineGiftProgramParticipant,
            });
            this.updateActiveUserObject();
        },
        postNotificationPreferences() {
            const { employeeNumber, notificationPreferences } = this.localUser;
            this.updateNotificationPreferences({
                employeeNumber,
                notificationPreferences,
            });
            this.updateActiveUserObject();
        },
        postReferralPartnerPreferences() {
            const {
                employeeNumber,
                referralPartnerCampaign,
                useAlternateContent,
            } = this.localUser;
            this.updateUserRpCampaign({
                employeeNumber,
                referralPartnerCampaign,
                useAlternateContent,
            });
            if (this.localUser.referralPartnerCampaign == 1) {
                this.localUser.emailSubscriptions.push({
                    type: "Referral Partner",
                });
            } else {
                const subscriptionIndex = this.localUser.emailSubscriptions.findIndex(
                    (sub) => sub.type == "Referral Partner"
                );
                this.localUser.emailSubscriptions.splice(subscriptionIndex, 1);
            }
            this.updateActiveUserObject();
        },
        postSignaturePreferences() {
            const { employeeNumber } = this.localUser;
            const emailSignatureOptions = [];
            this.localUser.signatureOption = [];
            this.emailSignatureOptions.forEach((option) => {
                if (this.localUser[option.name.split(" ").join("_")] == 1) {
                    emailSignatureOptions.push(option.id);
                    this.localUser.signatureOption.push({ name: option.name });
                }
            });
            this.updateSignaturePreferences({
                employeeNumber,
                emailSignatureOptions,
            });
            this.updateActiveUserObject();
        },
        updateActiveUserObject() {
            this.updateActiveUser(this.localUser.employeeNumber);
        },
        saveProfile() {},
    },
    async created() {
        const user = JSON.parse(localStorage.getItem("mv3"));
        if (user) {
            this.localUser = user;
        }

        // set an rpCampaign prop based off of email preferences for easier processing
        Vue.set(
            this.localUser,
            "referralPartnerCampaign",
            this.rpCampaignParticipant
        );

        this.fetchLoanOfficers();
        this.fetchEmployees();

        // get user's signature preferences
        api.users.fetchUserSignaturePreferences().then((response) => {
            this.emailSignatureOptions =
                response.data.data.marketingV1GetEmailSignatureOptions;
            this.emailSignatureOptions.forEach((option) => {
                const formattedOptionName = option.name.split(" ").join("_");

                if (
                    this.localUser.emailSignatureOption.some(
                        (locOp) => locOp.name == option.name
                    )
                ) {
                    Vue.set(this.localUser, formattedOptionName, 1);
                } else {
                    Vue.set(this.localUser, formattedOptionName, 0);
                }
            });
        });
    },
};
</script>

<style lang="scss" scoped>
.profilePage {
    padding: $standard-view;
    width: 85%;
    margin: 0 auto;
    @include breakpoint(ipadPro) {
        padding-right: 4rem;
        padding-left: 4rem;
        width: 100%;
    }
    @include breakpoint(tablet-port) {
        padding-right: 2rem;
        padding-left: 2rem;
    }
    .input-group {
        margin-bottom: 0.5rem;
    }
    .heading {
        display: flex;
        align-items: center;
        .avatar {
            width: 7rem;
            margin-right: 2rem;
            @include breakpoint(ipadPro) {
                display: none;
            }
        }
        .name {
            font-weight: 800;
            @include breakpoint(ipadPro) {
                padding-bottom: 3rem;
            }
        }
    }
    .editButton {
        display: block;
        margin-top: 1rem;
        padding: 0.2rem 1rem;
        font-size: 12px;
    }
    .inner-content {
        display: flex;
        margin: -1rem 0 0 9rem;
        @include breakpoint(ipadPro) {
            margin-left: 0rem;
        }
        @include breakpoint(tablet-port) {
            flex-wrap: wrap;
            flex-direction: row;
        }
        .subLabel {
            font-weight: normal;
        }
        .input-block {
            margin-bottom: 3rem;
        }
        .inline-group {
            display: flex;
            justify-content: space-between;
            .form-group {
                width: 47%;
                margin-bottom: 0;
            }
        }
        .info-column {
            width: 36%;
            margin-right: 8rem;
            @include breakpoint(ipadPro) {
                margin-right: 0rem;
            }
            @include breakpoint(tablet-land) {
                margin-right: 5rem;
                min-width: 230px;
            }
            .infoBlock {
                .line {
                    display: block;
                    line-height: 150%;
                    font-size: 14px;
                }
                &__address {
                    margin-top: 2rem;
                }
            }
            .availability {
                margin-top: 3rem;
                @include breakpoint(tablet-port) {
                    width: 240px;
                }
                label {
                    font-weight: 700;
                }
                .editButton {
                    margin-top: 1rem;
                    font-family: 'Nunito Sans', Arial, sans-serif;
                    font-weight: 700;
                }
            }
            .lo-preferences {
                margin-top: 4rem;
            }
        }
        .notifications {
            @include breakpoint(tablet-port) {
                padding-top: 4rem;
            }
            .column-wrapper {
                display: flex;
                @include breakpoint(tablet-land) {
                    flex-wrap: wrap;
                    flex-direction: row;
                    min-width: 200px;
                }
            }
            .heading {
                font-size: 16px;
                color: #333;
                font-weight: 800;
            }
            .group-header {
                margin: 2rem 0 1rem;
                font-size: 15px;
                color: $orange;
                font-weight: 700;
            }
            label {
                font-weight: 700;
            }
            &__column-2 {
                margin-left: 8rem;
                @include breakpoint(tablet-land) {
                    margin-left: 0rem;
                }
            }
            button {
                font-family: 'Nunito Sans', Arial, sans-serif;
                font-weight: 700;
            }
        }
    }
}
</style>
