<template>
	<div class="editUser">
		<transition name="fadeInOut" mode="out-in">
			<div class="content-wrapper" v-if="!localDataLoading && localUser.email">
				<div class="column1">
					<!-- Avatar & Name -->
					<div class="heading">
						<app-avatar
							:avatar-url="buildAvatarUrl(localUser.email, '150', 'ShortcutIcon')"
							alt="Picture of Assignee"
						/>
						<h1 class="name">{{ localUser.fullName }}</h1>
					</div>

					<!-- Static User Info -->
					<div v-if="localUser.branch" class="staticInfo-container">
						<div class="infoBlock">
							<span class="line">{{ localUser.position }}</span>
							<span v-if="localUser.nmls !== null" class="line">NMLS: {{ localUser.nmls }}</span>
						</div>

						<div class="infoBlock">
							<span class="line">C: {{ localUser.cellPhone }}</span>
							<span class="line">O: {{ localUser.branch.phone }}</span>
							<span class="line">F: {{ localUser.branch.fax }}</span>
						</div>

						<div class="infoBlock">
							<span class="line">{{ localUser.email }}</span>
						</div>

						<div class="infoBlock">
							<span class="line">{{ localUser.branch.address1 }} {{ localUser.branch.address2 }}</span>
							<span class="line">
								{{ localUser.branch.city }} {{ localUser.branch.state }} {{ localUser.branch.zip }}
							</span>
						</div>
					</div>

					<div class="column1-inputs">
						<!-- MGP  -->
						<div v-if="userIsLoanOfficer" class="mgp-rpEmail">
							<!-- Magazine Gift Program -->
							<div class="form-group">
								<label>Magazine Gift Program?</label>
								<div class="input-group">
									<div class="input-group">
										<radio-input
											:check="1"
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
											:check="0"
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
						</div>

						<!-- Assistants -->
						<div v-if="userIsLoanOfficer" class="form-group assistants">
							<label>Assistants</label>
							<div class="multiselect-wrapper">
								<multi-select
									v-model="localUser.assistants"
									:multiple="true"
									track-by="employeeNumber"
									placeholder="Select assistants"
									label="fullName"
									selectLabel=""
									deselectLabel=""
									:close-on-select="false"
									:preserve-search="true"
									:options="users.users"
									:taggable="false"
								>
									<template slot="selection" slot-scope="{ values, isOpen }">
										<span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">
											{{ values.length }} selected
										</span>
									</template>
								</multi-select>
							</div>
							<app-button classes="btn btn-orange" text="Save" @click.native="postAssistants" />
						</div>

						<!-- Signature Preferences -->
						<div v-if="userIsLoanOfficer" class="form-group emailSignature">
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

							<app-button classes="btn btn-orange" text="Save" @click.native="postSignaturePreferences" />
						</div>
					</div>
				</div>

				<div class="column2">
					<!-- Website Bio -->
					<div v-if="localUser.websiteBio" class="form-group bio">
						<label>Website Bio</label>
						<ckeditor :editor="editor" v-model="localUser.websiteBio" :config="editorConfig" />
						<app-button classes="btn btn-orange" text="Save" @click.native="postWebsiteBio" />
					</div>

					<!-- User Access -->
					<div class="form-group userAccess">
						<label>User Access Level</label>
						<div class="input-group">
							<radio-input
								name="userAccess"
								check="user"
								id="accessUser"
								labelFor="accessUser"
								label="User"
								@input="postUserAccess"
								v-model="accessLevel"
							/>
							<radio-input
								name="userAccess"
								check="ruoffEmployee"
								id="accessEmployee"
								labelFor="accessEmployee"
								label="Ruoff Employee"
								@input="postUserAccess"
								v-model="accessLevel"
							/>
							<radio-input
								name="userAccess"
								check="marketingEmployee"
								id="accessAdmin"
								labelFor="accessAdmin"
								label="Marketing Employee"
								@input="postUserAccess"
								v-model="accessLevel"
							/>
							<radio-input
								name="userAccess"
								check="branchManager"
								id="accessBranchManager"
								labelFor="accessBranchManager"
								label="Branch Manager"
								@input="postUserAccess"
								v-model="accessLevel"
							/>
							<radio-input
								name="userAccess"
								check="regionalManager"
								id="accessRegionalManager"
								labelFor="accessRegionalManager"
								label="Regional Manager"
								@input="postUserAccess"
								v-model="accessLevel"
							/>
							<radio-input
								name="userAccess"
								check="executiveManager"
								id="accessExecutiveManager"
								labelFor="accessExecutiveManager"
								label="Executive Manager"
								@input="postUserAccess"
								v-model="accessLevel"
							/>
							<radio-input
								name="userAccess"
								check="superAdmin"
								id="accessSuperadmin"
								labelFor="accessSuperadmin"
								label="Super Admin"
								@input="postUserAccess"
								v-model="accessLevel"
							/>
						</div>
					</div>

					<!-- Referral Partners -->
					<div v-if="userIsLoanOfficer" class="referralPartners rps">
						<div class="inline-group">
							<!-- RP email opt in/out -->
							<div class="form-group">
								<label>Opt Referral Partners into email campaign?</label>
								<div class="input-group">
									<radio-input
										name="rpEmailOptin"
										:check="1"
										id="optinYes"
										labelFor="optinYes"
										label="Yes"
										@input="postReferralPartnerPreferences"
										v-model="rpCampaignParticipant"
									/>
									<radio-input
										name="rpEmailOptin"
										:check="0"
										id="optinNo"
										labelFor="optinNo"
										label="No"
										@input="postReferralPartnerPreferences"
										v-model="rpCampaignParticipant"
									/>
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
						</div>

						<!-- CSV template -->
						<div class="form-group">
							<div class="rp-csv-container">
								<p>Please use the provided CSV template for uploading a referral partner list.</p>
								<a href="/docs/rp-list-template.csv" target="_blank">Download CSV template</a>
							</div>
						</div>
						<!-- CSV upload -->
						<div class="form-group">
							<label>Referral Partner Upload</label>

							<div class="csv-upload">
								<single-file-input
									buttonText="Upload CSV"
									@input="addReferralPartnersByCSV"
									:show-file-name="false"
								/>
								<div class="uploadStatus-wrapper">
									<i
										class="fas"
										:class="{
											'fa-check-circle': uploadStatus == 'Success!',
											'fa-times': uploadStatus == 'Error!',
										}"
									/>
									<span
										class="uploadStatus"
										:class="{
											'--success': uploadStatus == 'Success!',
											'--error': uploadStatus == 'Error!',
										}"
									>
										{{ uploadStatus }}
										<span>&nbsp;{{ statusMessage }}</span>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="column3">
					<app-button classes="btn btn-black" text="Back" @click.native="$router.go(-1)" />
				</div>
			</div>

			<loading-dots v-else loading-text="Loading user details" />
		</transition>
	</div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import api from "@/store/api";
// static components
import InlineEditor from "ruoff-ckeditor5-custom-inline/build/ckeditor";
// mixins
import { avatars } from "@/mixins";

export default {
	name: "EditUser",

	mixins: [avatars],

	components: {
		"app-avatar": () => import("@/components/Shared/AppAvatar"),
		"radio-input": () => import("@/components/Shared/Inputs/RadioInput"),
		"checkbox-input": () => import("@/components/Shared/Inputs/CheckboxInput"),
		"single-file-input": () => import("@/components/Shared/Inputs/SingleFileInput"),
		"multi-select": () => import("vue-multiselect"),
		"app-button": () => import("@/components/Shared/AppButton"),
		"loading-dots": () => import("@/components/Shared/LoadingDots"),
	},

	data() {
		return {
			localUser: {},
			// WYSIWYG editor
			editor: InlineEditor,
			editorConfig: {
				toolbar: ["bold", "italic", "underline", "|", "fontColor", "fontSize", "|", "link"],
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
			// UI
			localDataLoading: true,
			uploadStatus: "",
			statusMessage: "",
			emailSignatureOptions: [],
		};
	},
	computed: {
		...mapState(["users"]),
		...mapGetters(["allLoanOfficers", "userByEmployeeNumber"]),
		accessLevel: {
			get() {
				const { userRoles } = this.localUser;
				if (userRoles.includes("ROLE_MARKETING_ADMIN") || userRoles.includes("ROLE_IT")) {
					return "superAdmin";
				}
				if (userRoles.includes("ROLE_EXECUTIVE_MANAGER")) {
					return "executiveManager";
				}
				if (userRoles.includes("ROLE_REGIONAL_MANAGER")) {
					return "regionalManager";
				}
				if (userRoles.includes("ROLE_BRANCH_MANAGER")) {
					return "branchManager";
				}
				if (userRoles.includes("ROLE_MARKETING_EMPLOYEE")) {
					return "marketingEmployee";
				}
				if (userRoles.includes("ROLE_EMPLOYEE")) {
					return "ruoffEmployee";
				}
				return "user";
			},
			set(newValue) {
				switch (newValue) {
					case "superAdmin": {
						this.localUser.userRoles = [
							"ROLE_USER",
							"ROLE_EMPLOYEE",
							"ROLE_MARKETING_EMPLOYEE",
							"ROLE_MARKETING_ADMIN",
						];
						break;
					}
					case "branchManager": {
						this.localUser.userRoles = ["ROLE_USER", "ROLE_EMPLOYEE", "ROLE_BRANCH_MANAGER"];
						break;
					}
					case "regionalManager": {
						this.localUser.userRoles = ["ROLE_USER", "ROLE_EMPLOYEE", "ROLE_REGIONAL_MANAGER"];
						break;
					}
					case "executiveManager": {
						this.localUser.userRoles = ["ROLE_USER", "ROLE_EMPLOYEE", "ROLE_EXECUTIVE_MANAGER"];
						break;
					}
					case "marketingEmployee": {
						this.localUser.userRoles = ["ROLE_USER", "ROLE_EMPLOYEE", "ROLE_MARKETING_EMPLOYEE"];
						break;
					}
					case "ruoffEmployee": {
						this.localUser.userRoles = ["ROLE_USER", "ROLE_EMPLOYEE"];
						break;
					}
					case "user": {
						this.localUser.userRoles = ["ROLE_USER"];
						break;
					}
					default: {
						return undefined;
					}
				}
				return this.localUser.userRoles;
			},
		},
		rpCampaignParticipant: {
			get() {
				const { emailSubscriptions } = this.localUser;
				if (emailSubscriptions.length > 0) {
					return emailSubscriptions.some((sub) => sub.type == "Referral Partner") ? 1 : 0;
				}
				return false;
			},
			set(newValue) {
				this.localUser.referralPartnerCampaign = newValue;
			},
		},
		userIsLoanOfficer() {
			return this.localUser.nmls !== null;
		},
	},
	methods: {
		...mapActions([
			"bustEmployeeCache",
			"fetchEmployee",
			"fetchEmployees",
			"createReferralPartners",
			"updateUserMagazineGiftProgram",
			"updateUserRpCampaign",
			"updateUserWebsiteBio",
			"updateUserAssistants",
			"updateUserAccess",
			"updateSignaturePreferences",
		]),
		setAvatarFallback(e) {
			e.target.src = "https://webresources.ruoff.com/pinwheel-color/png/50/0";
		},
		async addReferralPartnersByCSV(file) {
			this.uploadStatus = null;
			if (file.name.split(".").pop() !== "csv") {
				this.uploadStatus = "Error!";
				this.statusMessage = "[File must be .CSV]";
			} else {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("employee", this.localUser.employeeNumber);
				this.createReferralPartners(formData);
			}
		},
		postMagazineGiftProgram() {
			const { employeeNumber, isMagazineGiftProgramParticipant } = this.localUser;
			this.updateUserMagazineGiftProgram({
				employeeNumber,
				isMagazineGiftProgramParticipant,
			});
		},
		postAssistants() {
			const { employeeNumber, assistants } = this.localUser;
			this.updateUserAssistants({
				employeeNumber,
				assistants,
			});
		},
		postWebsiteBio() {
			const { employeeNumber, websiteBio } = this.localUser;
			this.updateUserWebsiteBio({
				employeeNumber,
				websiteBio,
			});
		},
		postUserAccess() {
			const { employeeNumber, userRoles } = this.localUser;
			this.updateUserAccess({
				employeeNumber,
				userRoles,
			});
		},
		postReferralPartnerPreferences() {
			const { employeeNumber, referralPartnerCampaign, useAlternateContent } = this.localUser;
			this.updateUserRpCampaign({
				employeeNumber,
				referralPartnerCampaign,
				useAlternateContent,
			});
		},
		postSignaturePreferences() {
			const { employeeNumber } = this.localUser;
			const emailSignatureOptions = [];
			this.emailSignatureOptions.forEach((option) => {
				if (this.localUser[option.name.split(" ").join("_")] == 1) {
					emailSignatureOptions.push(option.id);
				}
			});
			this.updateSignaturePreferences({
				employeeNumber,
				emailSignatureOptions,
			});
		},
	},
	async created() {
		const employee = await this.fetchEmployee(this.$route.params.userId);
		this.localDataLoading = false;

		// if employee exists, load into local state, otherwise redirect to 404
		if (employee.length == 0) {
			this.$router.push("/404");
		} else {
			this.localUser = JSON.parse(JSON.stringify({ ...employee[0] }));
		}

		// TODO: move these two api requests into the user's store
		// get the user's website bio
		if (this.userIsLoanOfficer) {
			api.users
				.fetchUserWebsiteBio({
					firstName: this.localUser.firstName,
					lastName: this.localUser.lastName,
				})
				.then((response) => {
					const { data } = response.data;
					// write the new property to localUser for reactivity
					Vue.set(this.localUser, "websiteBio", data.marketingV1GetUserWebsiteBio);
					// set an rpCampaign prop based off of email preferences for easier processing
					Vue.set(this.localUser, "referralPartnerCampaign", this.rpCampaignParticipant);
				})
				.catch(() => {
					Vue.set(this.localUser, "websiteBio", null);
				});
		}

		// get user's signature preferences
		api.users.fetchUserSignaturePreferences().then((response) => {
			this.emailSignatureOptions = response.data.data.marketingV1GetEmailSignatureOptions;
			this.emailSignatureOptions.forEach((option) => {
				const formattedOptionName = option.name.split(" ").join("_");

				if (this.localUser.emailSignatureOption.some((locOp) => locOp.name == option.name)) {
					Vue.set(this.localUser, formattedOptionName, 1);
				} else {
					Vue.set(this.localUser, formattedOptionName, 0);
				}
			});
		});

		this.fetchEmployees(); // need this for assistants list
	},
};
</script>

<style lang="scss" scoped>
.editUser {
	padding: $standard-view;
	width: 1400px;
	margin: 0 auto;
    .content-wrapper {
        display: flex;
    }
	.inline-group {
		display: flex;
		.form-group:first-of-type {
			margin-right: auto;
		}
	}
	.column1,
	.column2 {
		button {
			margin-left: auto;
			display: block;
			margin-top: 0.5rem;
			padding: 0.2rem 1rem;
			font-size: 12px;
			font-family: "Nunito Sans", sans-serif;
			font-weight: 700;
		}
		label {
			font-weight: 700;
		}
	}
	.column1 {
		width: 40%;
		.assistants {
			button {
				margin-top: 1rem;
			}
		}
	}

	.column2 {
		margin-top: 7rem;
		width: 40%;
		.form-group.bio,
		.referralPartners {
			margin-bottom: 2rem;
		}
		.form-group.userAccess {
			margin-bottom: 4rem;
		}
		.input-group {
			flex-wrap: wrap;
		}
		.imageContainer {
			display: flex;
			img {
				margin-right: 2rem;
			}
		}
		.userAccess {
			.radio-group {
				width: 100%;
				margin-bottom: 0.25rem;
			}
		}
		.referralPartners {
			.rp-csv-container {
				font-size: 14px;
				a {
					font-size: 14px;
					line-height: 1.75;
					color: $teal-light;
					text-decoration: underline;
				}
			}
			.csv-upload {
				display: flex;
				align-items: center;
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
	}

	.column3 {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		width: 20%;
		button {
			margin-bottom: 2rem;
			font-family: "Nunito Sans", sans-serif;
			font-weight: 700;
		}
	}

	.heading {
		display: flex;
		align-items: center;
		.avatar {
			width: 7rem;
			margin-right: 2rem;
		}
		.name {
			font-weight: 800;
		}
	}

	.staticInfo-container {
		margin-left: 9rem;
		.infoBlock {
			margin-bottom: 2rem;
		}
		.line {
			display: block;
			line-height: 150%;
			font-size: 14px;
			font-weight: 600;
		}
	}

	.column1-inputs {
		width: 25rem;
		.mgp-rpEmail {
			margin-top: 4rem;
		}
	}
}

::v-deep {
	.loading-container {
		margin-top: 5rem;
	}
	p.loading {
		text-align: left;
	}
}

.ck-editor__editable {
	font-size: 12px;
	border: 1px solid $gray-light !important;
	border-radius: 5px !important;
	outline: none;
	height: 13rem;
	&:focus {
		border: 1px solid $teal-light !important;
		box-shadow: none !important;
	}
}
</style>
