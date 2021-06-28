<template>
	<div class="productPage">
		<transition name="fadeInOut" mode="out-in">
			<div v-if="product.category" class="content-wrapper">
				<!-- PRODUCT DISPLAY -->
				<div class="productDisplay">
					<!-- Main Preview -->
					<a class="main" :href="selectedImageFullscreenPath" target="_blank">
						<img class="main" :src="selectedImagePreviewPath" />
					</a>
					<!-- Thumbnails -->
					<div class="productDisplay__thumbDock">
						<img
							v-for="image in product.productImages"
							:key="image.id"
							:src="getThumbnailPath(image)"
							class="thumb"
							@click="selectedImageId = image.id"
						/>
					</div>
					<!-- Product Info -->
					<div class="productInfo">
						<div class="productInfo__infoBlock">
							<label>Category:</label>
							<span v-if="product.category">{{ product.category.name }}</span>
						</div>
						<div class="productInfo__infoBlock">
							<label>Processing Time:</label>
							<span>{{ processTime }}</span>
						</div>
					</div>
				</div>

				<!-- ORDER DETAILS -->
				<div class="orderDetails">
					<h1>{{ product.name }}</h1>
					<ul class="statRow">
						<li class="statRow__reviews">
							<star-rating
								:star-size="25"
								:show-rating="false"
								:increment="0.5"
								:read-only="true"
								:rating="product.rating"
							/>
							<router-link :to="`/product/${$route.params.productId}/reviews`">
								{{ product.reviewCount }} Review
								<span v-if="product.reviewCount > 1">s</span>
							</router-link>
						</li>
						<li class="statRow__orderCount">{{ product.orderCount }} orders</li>
					</ul>
					<h3>Product Details</h3>
					<p class="productDescription" v-html="product.description"></p>

					<!-- *User provided details* -->
					<ValidationObserver ref="observer" tag="form" class="fieldHolder">
						<!-- Ordered For -->
						<div class="form-group">
							<label>Order For:</label>
							<ValidationProvider
								mode="passive"
								rules="required"
								v-slot="{ errors }"
								class="multiselect-wrapper"
							>
								<multi-select
									v-model="localOrder.orderedFor"
									label="fullName"
									track-by="employeeNumber"
									selectLabel=""
									deselectLabel=""
									:preserve-search="true"
									:options="assists"
									:taggable="false"
								/>
								<span class="errorMessage">{{ errors[0] }}</span>
							</ValidationProvider>
						</div>

						<!-- *Co-brand* -->
						<div
							v-if="product.isCobrandable == 1 && cobrandFields.length > 0"
							class="form-group cobrandGroup"
						>
							<!-- Is cobranded? -->
							<div class="form-group">
								<label>{{ cobrandFields[0].label }}</label>
								<div class="input-group">
									<radio-input
										v-for="option in cobrandFields[0].options"
										:key="option.label"
										:check="option.value"
										:label="option.value"
										:label-for="`cobrand-${option.value}`"
										:id="`cobrand-${option.value}`"
										v-model="cobrandFields[0].value"
										name="cobrandable"
									/>
								</div>
							</div>
							<!-- Cobrand inputs -->
							<div v-if="cobrandFields[0].value == 'Yes'" class="cobrandInputs">
								<div v-for="(field, index) in cobrandFields" :key="field.label">
									<div
										v-if="index > 0 && field.type == 'text' && field.label !== 'Realtor Website'"
										class="form-group"
									>
										<label>{{ field.label }}*</label>
										<ValidationProvider
											:name="`cobrand${index}`"
											mode="passive"
											v-slot="{ errors }"
											rules="required"
										>
											<text-input :field="field" v-model="field.value" />
											<span class="errorMessage">{{ errors[0] }}</span>
										</ValidationProvider>
									</div>

									<div v-if="index > 0 && field.label == 'Realtor Website'" class="form-group">
										<label>{{ field.label }}</label>
										<text-input :field="field" v-model="field.value" />
									</div>

									<div v-if="index > 0 && field.type == 'file'" class="form-group">
										<label>{{ field.label }}</label>
										<single-file-input
											v-if="field.type == 'file'"
											:field="field"
											buttonText="Upload"
											:file-name="field.fileName"
											@input="cobrandFileChanged($event, index)"
										/>
									</div>
								</div>
							</div>
						</div>

						<!-- *Details* -->
						<div v-for="(field, index) in localOrder.details" :key="field.sortOrder" class="form-group">
							<ValidationProvider
								:ref="`input${index}`"
								:name="`detail${index}`"
								mode="passive"
								v-slot="{ errors }"
								:rules="field.required == 1 ? 'required' : ''"
							>
								<label>
									{{ field.label }}
									<i v-if="field.required" class="fas fa-asterisk asterisk"></i>
								</label>

								<!-- Text Input -->
								<text-input
									v-if="field.type == 'text'"
									:placeholder="field.placeholder"
									:field="field"
									v-model="field.value"
								/>

								<!-- Dropdown -->
								<div v-if="field.type == 'dropdown'" class="multiselect-wrapper">
									<multi-select
										v-model="field.value"
										selectLabel=""
										deselectLabel=""
										:preserve-search="true"
										:options="field.options.map((option) => option.value)"
										:taggable="false"
									/>
								</div>

								<!-- Date input -->
								<date-time-picker
									v-if="field.type == 'date'"
									v-model="field.value"
									color="#f38e36"
									:no-label="true"
									label="Select date"
									:only-date="true"
									:no-weekends-days="true"
								/>

								<!-- Radio -->
								<div v-if="field.type == 'radio'" class="input-group">
									<radio-input
										v-for="option in field.options"
										:key="option.label"
										:check="option.value"
										:label="option.value"
										:label-for="`${field.label.split(' ').join('')}-${option.value}`"
										:id="`${field.label.split(' ').join('')}-${option.value}`"
										v-model="field.value"
										:name="field.label.split(' ').join('')"
									/>
								</div>

								<!-- Textbox -->
								<text-area
									v-if="field.type == 'textbox'"
									:placeholder="field.placeholder"
									v-model="field.value"
								/>

								<!-- Single File Upload -->
								<single-file-input
									v-if="field.type == 'file'"
									:field="field"
									buttonText="Upload"
									@input="detailFileChanged($event, index)"
								/>

								<span class="errorMessage">{{ errors[0] }}</span>
							</ValidationProvider>
						</div>
					</ValidationObserver>

					<!-- CONTROLS -->
					<div class="button-group">
						<app-button classes="btn btn-green" @click.native="placeOrder" text="Place Order" />
						<app-button
							classes="btn btn-black"
							@click.native="$router.push({ path: '/library', query: { ...$route.query } })"
							text="Cancel"
						/>
					</div>
				</div>
			</div>

			<loading-dots v-else loading-text="Loading product details" />
		</transition>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import moment from "moment";
import api from "@/store/api";

export default {
	name: "ProductPage",
	components: {
		"star-rating": () => import("vue-star-rating"),
		"text-input": () => import("@/components/Shared/Inputs/TextInput"),
		"multi-select": () => import("vue-multiselect"),
		"radio-input": () => import("@/components/Shared/Inputs/RadioInput"),
		"text-area": () => import("@/components/Shared/Inputs/TextArea"),
		"single-file-input": () => import("@/components/Shared/Inputs/SingleFileInput"),
		"date-time-picker": () => import("vue-ctk-date-time-picker"),
		"app-button": () => import("@/components/Shared/AppButton"),
		"loading-dots": () => import("@/components/Shared/LoadingDots"),
	},
	data() {
		return {
			product: {},
			localOrder: {
				id: null,
				product: {},
				orderedBy: {},
				orderedFor: {},
				dueDate: null,
				assignedTo: {},
				followers: [],
				orderActivity: [],
				comments: [],
				status: "Assigned",
				completedDatetime: null,
				orderedDatetime: moment().toISOString(),
				details: [],
				deliverables: [],
			},
			cobrandFields: [
				{
					id: null,
					type: "radio",
					label: "Are you co-branding this product?",
					value: "No",
					fileName: null,
					options: [{ value: "Yes" }, { value: "No" }],
				},
				{
					id: null,
					type: "text",
					label: "Realtor Name",
					value: "",
					fileName: null,
				},
				{
					id: null,
					type: "text",
					label: "Realtor Phone Number",
					value: "",
					fileName: null,
				},
				{
					id: null,
					type: "text",
					label: "Realtor Email",
					value: "",
					fileName: null,
				},
				{
					id: null,
					type: "text",
					label: "Real Estate Company",
					value: "",
					fileName: null,
				},
				{
					id: null,
					type: "text",
					label: "Realtor Website",
					value: "",
					fileName: null,
				},
				{
					id: null,
					type: "file",
					label: "Realtor Photo",
					value: "",
					fileName: null,
				},
				{
					id: null,
					type: "file",
					label: "Realtor Logo",
					value: "",
					fileName: null,
				},
			],
			assists: [],
			orderIsCobranded: 0,
			productDataLoaded: false,
			selectedImageId: null,
		};
	},
	computed: {
		...mapState(["users"]),
		...mapGetters(["productById", "allLoanOfficers", "activeUser"]),
		processTime() {
			const { processingTime } = this.product;
			const dayCount = processingTime / 8;
			const hourCount = Math.floor(processingTime % 8);
			if (dayCount == 0) {
				return "Instant";
			}
			if (dayCount == 1) {
				return `${dayCount} Business Day`;
			}
			if (dayCount <= 1) {
				return `${hourCount} hour(s)`;
			}
			return `${dayCount} Business Days`;
		},
		selectedImagePreviewPath() {
			if (this.selectedImageId !== null) {
				const selectedImage = this.product.productImages.find((image) => image.id == this.selectedImageId);
				const preview = selectedImage.filepaths.find((filepath) => filepath.type == "preview");
				return preview.path;
			}
			try {
				const primaryImage = this.product.productImages.find((image) => image.primary == 1);
				const preview = primaryImage.filepaths.find((filepath) => filepath.type == "preview");
				return preview.path;
			} catch (error) {
				/* shhhh */
			}
			return undefined;
		},
		selectedImageFullscreenPath() {
			if (this.selectedImageId !== null) {
				const selectedImage = this.product.productImages.find((image) => image.id == this.selectedImageId);
				const fullScreen = selectedImage.filepaths.find((filepath) => filepath.type == "fullScreen");
				return fullScreen.path;
			}
			try {
				const primaryImage = this.product.productImages.find((image) => image.primary == 1);
				const fullScreen = primaryImage.filepaths.find((filepath) => filepath.type == "fullScreen");
				return fullScreen.path;
			} catch (error) {
				/* shhhh */
			}
			return undefined;
		},
		activeUser() {
			return this.users.activeUser;
		},
		assigneeGetsNotification() {
			return (
				this.localOrder.assignedTo.notificationPreferences.find((pref) => pref.name === "Order Assignment")
					.receiveNotification === 1
			);
		},
	},
	watch: {
		product() {
			if (!this.productDataLoaded) {
				this.setOrderData();
				this.productDataLoaded = true;
			}
		},
		activeUser() {
			this.populateOrderedFor();
		},
	},
	methods: {
		...mapActions(["createOrder", "updateProduct", "postNotification"]),
		detailFileChanged(file, index) {
			const reader = new FileReader();
			reader.onload = (fileEvent) => {
				// the result image data
				this.localOrder.details[index].value = fileEvent.target.result;
				this.$refs[`input${index}`][0].syncValue(this.localOrder.details[index].value); // this will let validitor know if files are present
			};
			reader.readAsDataURL(file);
			this.localOrder.details[index].fileName = file.name;
		},
		cobrandFileChanged(file, index) {
			const reader = new FileReader();
			reader.onload = (fileEvent) => {
				// the result image data
				this.cobrandFields[index].value = fileEvent.target.result;
			};
			reader.readAsDataURL(file);
			this.cobrandFields[index].fileName = file.name;
		},
		async placeOrder() {
			const formValid = await this.$refs.observer.validate();
			if (formValid) {
				// create a deliverable if this is an instant download product
				if (this.product.isDownload == 1) {
					const delObj = {
						id: null,
						filepath: this.product.instantAssetPath,
						status: "final",
					};
					this.localOrder.deliverables.push(delObj);
					this.localOrder.status = "Completed";
				}

				// add the cobrand fields to the details array if they exist
				if (this.product.isCobrandable == 1) {
					if (this.cobrandFields[0].value == "Yes") {
						const holder = [...this.cobrandFields];
						this.cobrandFields = [];
						this.localOrder.details.unshift(...holder);
					} else {
						const holder = this.cobrandFields[0];
						this.cobrandFields = [];
						this.localOrder.details.unshift(holder);
					}
				}

				// post the order request & route to the order page
				const { response } = await this.createOrder(this.localOrder);
				if (response.status == 200) {
					// determine the notification recipients
					const recipients = [];
					if (
						this.activeUser.employeeNumber !== this.localOrder.assignedTo.employeeNumber &&
						this.assigneeGetsNotification
					) {
						recipients.push(this.localOrder.assignedTo.employeeNumber); // only need employeeNumber
					}

					// if someone gets the notification, proceed with the post
					if (recipients.length > 0) {
						delete recipients[0].availability;
						delete recipients[0].notificationPreferences;
						// build the notification object
						const notification = {
							id: null,
							recipients,
							isRead: 0,
							createdDatetime: null,
							message: `
              ${this.localOrder.assignedTo.fullName} has been assigned to <strong>order #${response.data.id}</strong>
            `,
							destinationUrl: `/orders/${response.data.id}`,
						};
						const res = await this.postNotification(notification);
						if (res.status == 200) {
							if (this.$socket) {
								notification.id = res.data.id;
								notification.createdDatetime = res.data.createdDatetime;
								this.$socket.emit("createNotification", notification);
							}
						}
					}

					this.$router.push(`/orders/${response.data.id}`);
				}
			}
		},
		setOrderData() {
			// populate the order locally
			this.localOrder.orderedBy = {
				employeeNumber: this.activeUser.employeeNumber,
				fullName: this.activeUser.fullName,
			};
			this.localOrder.orderedFor = {
				employeeNumber: this.activeUser.employeeNumber,
				fullName: this.activeUser.fullName,
			};
			this.localOrder.secondaryAssignTo = this.product.secondaryAssignTo;
			this.localOrder.dueDate = moment()
				.add(this.product.processingTime, "h")
				.toDate()
				.toISOString();
			this.localOrder.product.id = this.product.id;
			this.localOrder.product.name = this.product.name;
			this.localOrder.details = JSON.parse(JSON.stringify(this.product.formFields));
			// this.localOrder.details.forEach((detail, index) => {
			//   Vue.set(this.localOrder.details[index], 'fileName', null);
			// });
			this.primaryImage = this.product.productImages.find((image) => image.primary == 1);
		},
		getThumbnailPath(image) {
			const thumb = image.filepaths.find((filepath) => filepath.type == "thumbnail");
			return thumb.path;
		},
		populateOrderedFor() {
			if (this.activeUser.assists) {
				const obj = {
					employeeNumber: this.activeUser.employeeNumber,
					fullName: this.activeUser.fullName,
				};
				this.assists = JSON.parse(JSON.stringify([...this.activeUser.assists]));
				this.assists.push(obj);
				this.localOrder.orderedFor = obj;
				this.localOrder.orderedBy = obj;
			}
		},
	},
	async created() {
		// first check if we have this product loaded in the store
		const product = await this.productById(this.$route.params.productId);
		if (product) {
			this.product = JSON.parse(JSON.stringify({ ...product }));
		} else {
			// product is not in store, attempt to load from API & route to 404 if doesnt exist
			const response = await this.updateProduct(this.$route.params.productId);
			const data = response[0];
			if (response.length == 0) {
				this.$router.push("/404");
			} else if (data.isActive == 0) {
				this.$router.push("/404");
			} else {
				this.product = JSON.parse(JSON.stringify({ ...response[0] }));
			}
		}
		api.users
			.fetchEmployeeNotificationPreferences(this.product.assignTo.employeeNumber)
			.then((primaryAssigneeData) => {
				[this.localOrder.assignedTo] = primaryAssigneeData.data.data.marketingV1GetEmployee;
				if (this.localOrder.assignedTo.availability !== "active") {
					api.users
						.fetchEmployeeNotificationPreferences(this.product.secondaryAssignTo.employeeNumber)
						.then((secondaryAssigneeData) => {
							[this.localOrder.assignedTo] = secondaryAssigneeData.data.data.marketingV1GetEmployee;
							if (this.localOrder.assignedTo.availability !== "active") {
								api.users
									.fetchSuperAdminNotificationPreferences(
										this.product.secondaryAssignTo.employeeNumber
									)
									.then((tertiaryAssigneeData) => {
										this.localOrder.assignedTo =
											tertiaryAssigneeData.data.data.marketingV1GetMarketingAdmin;
									});
							}
						});
				}
			});

		// if this is a reorder, the props will be on the route for pre-populating a re-order
		const { details } = this.$route.params;
		if (details) {
			details.forEach((detail) => {
				// transfer the props from the route into the form
				this.product.formFields.forEach((field) => {
					if (field.label == detail.label) {
						field.value = detail.value;
					}
				});
				this.cobrandFields.forEach((field) => {
					if (field.label == detail.label) {
						field.value = detail.value;
					}
				});
			});
		}
	},
	mounted() {
		window.scrollTo(0, 0);
		this.populateOrderedFor();
	},
};
</script>

<style lang="scss" scoped>
.productPage {
	display: flex;
	justify-content: space-between;
	padding: 4rem 20% 10rem;
	@include breakpoint(desktop) {
		padding: 4rem 10% 10rem;
	}
	@include breakpoint(laptop) {
		padding: 4rem 4rem 10rem;
	}
	@include breakpoint(tablet-land) {
		padding: 6rem 4rem 10rem;
		flex-wrap: wrap;
	}
	@include breakpoint(tablet-land) {
		padding: 6rem 2rem 10rem;
	}
}
.content-wrapper {
	display: flex;
	justify-content: space-between;
	@include breakpoint(tablet-land) {
		flex-wrap: wrap;
	}
}
.productDisplay {
	width: 40%;
	min-width: 42rem;
	@include breakpoint(laptop) {
		min-width: 38rem;
	}
	@include breakpoint(mobile) {
		min-width: unset;
		width: 100%;
	}
	a.main {
		display: block;
		width: 90%;
		max-width: 375px;
		@include breakpoint(laptop) {
			min-width: 34rem;
		}
		@include breakpoint(mobile) {
			min-width: unset;
			width: 100%;
		}
	}
	img.main {
		width: 100%;
		object-fit: cover;
	}
	img.thumb {
		height: 100px;
		width: 100px;
		margin: 2rem 2rem 1rem 0;
		cursor: pointer;
		object-fit: cover;
		&.--selected {
			border: 4px solid $teal-light;
		}
	}
	&__thumbDock {
		display: flex;
		flex-wrap: wrap;
		max-width: 375px;
	}
	.productInfo {
		margin-top: 2rem;
		&__infoBlock {
			display: flex;
			margin-bottom: 1rem;
			label {
				margin-right: 1rem;
				font-weight: 700;
			}
		}
	}
}

.orderDetails {
	width: 40%;
	min-width: 35rem;
	@include breakpoint(tablet-land) {
		margin-top: 2rem;
	}
	@include breakpoint(mobile) {
		min-width: unset;
		width: 100%;
	}
	h1 {
		margin-bottom: 2rem;
		font-weight: 800;
	}
	.statRow {
		&__reviews {
			display: flex;
			align-items: center;
			width: 25rem;
			margin: 0 0 0.5rem;
			a {
				margin-left: 1rem;
				font-size: 1.4rem;
				color: $gray-mid;
				&:hover {
					color: $teal-light;
				}
			}
		}
		&__orderCount {
			margin-bottom: 2rem;
			color: $gray-mid;
		}
	}
	.productDescription {
		font-size: 14px;
		margin-bottom: 3rem;
	}
	h3 {
		width: 40%;
		margin-bottom: 2rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid $gray;
		font-size: 1.8rem;
		color: #333;
		font-weight: 800;
	}
	p {
		width: 75%;
	}
}

.fieldHolder {
	margin-top: 3rem;
	max-width: 75%;
	.form-group {
		position: relative;
		label {
			font-weight: 700;
		}
		.field-controls {
			position: absolute;
			top: 0;
			right: 0;
			.fas {
				font-size: 14px;
				cursor: pointer;
				-webkit-font-smoothing: antialiased;
				transition: transform 0.1s ease;
				&:hover {
					transform: scale(1.3);
				}
			}
			.deleteIcon {
				color: $red;
				margin-left: 1rem;
			}
			.editIcon {
				color: $linkBlue;
			}
		}
	}
}

.button-group {
	display: flex;
	margin-top: 4rem;
	button {
		margin-bottom: 2rem;
		min-width: 11rem;
		margin-right: 2rem;
		font-family: "Nunito Sans", Arial, sans-serif;
		font-weight: 700;
	}
}

::v-deep p.loading {
	text-align: left;
}
</style>
