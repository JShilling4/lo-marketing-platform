<template>
    <div
        v-if="product"
        class="productPage"
    >
        <div class="content-wrapper">
            <!-- PRODUCT DISPLAY -->
            <div class="productDisplay">
                <!-- Main Preview -->
                <a
                    class="main"
                    :href="selectedImageFullscreenPath"
                    target="_blank"
                >
                    <img
                        class="main"
                        :src="selectedImagePreviewPath"
                    />
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
                <!-- <ul class="statRow__statList">
          <li>
            <star-rating
              :star-size="25"
              :show-rating="false"
              :increment="0.5"
              :read-only="true"
              :rating="product.rating"
            />
          </li>
          <li>10 orders</li>
        </ul> -->
                <h3>Product Details</h3>
                <p
                    class="productDescription"
                    v-html="product.description"
                ></p>

                <div class="controls">
                    <app-button
                        classes="btn btn-green"
                        @click.native="handleInterestClick"
                        text="I'm Interested!"
                    />
                    <app-button
                        classes="btn btn-black"
                        @click.native="$router.push('/catalog/library')"
                        text="Back to Library"
                    />
                </div>
            </div>

            <transition name="selectPreferredLo">
                <select-preferred-lo
                    v-if="preferredLoModalShowing"
                    @close="preferredLoModalShowing = false"
                    @submit="submitProductInterest"
                />
            </transition>

            <transition name="interestConfirmation">
                <interest-confirmation
                    v-if="interestConfirmationModalShowing"
                    @close="interestConfirmationModalShowing = false"
                />
            </transition>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import api from '@/store/api';
import { handleApiError } from '@/store/helpers';

export default {
    name: "CatalogProductDetail",
    components: {
        // 'star-rating': () => import('vue-star-rating'),
        "select-preferred-lo": () =>
            import("@/components/Catalog/SelectPreferredLoModal"),
        "interest-confirmation": () =>
            import("@/components/Catalog/InterestConfirmationModal"),
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    data() {
        return {
            product: {},
            selectedImageId: null,
            preferredLoModalShowing: false,
            interestConfirmationModalShowing: false,
        };
    },
    computed: {
        ...mapState(["users"]),
        ...mapGetters(["productById", "activeUser"]),
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
                const selectedImage = this.product.productImages.find(
                    (image) => image.id == this.selectedImageId
                );
                const preview = selectedImage.filepaths.find(
                    (filepath) => filepath.type == "preview"
                );
                return preview.path;
            }
            try {
                const primaryImage = this.product.productImages.find(
                    (image) => image.primary == 1
                );
                const preview = primaryImage.filepaths.find(
                    (filepath) => filepath.type == "preview"
                );
                return preview.path;
            } catch (error) {
                /* shhhh */
            }
            return undefined;
        },
        selectedImageFullscreenPath() {
            if (this.selectedImageId !== null) {
                const selectedImage = this.product.productImages.find(
                    (image) => image.id == this.selectedImageId
                );
                const fullScreen = selectedImage.filepaths.find(
                    (filepath) => filepath.type == "fullScreen"
                );
                return fullScreen.path;
            }
            try {
                const primaryImage = this.product.productImages.find(
                    (image) => image.primary == 1
                );
                const fullScreen = primaryImage.filepaths.find(
                    (filepath) => filepath.type == "fullScreen"
                );
                return fullScreen.path;
            } catch (error) {
                /* shhhh */
            }
            return undefined;
        },
        activeUser() {
            return this.users.activeUser;
        },
    },
    methods: {
        ...mapActions(["updateProduct"]),
        getThumbnailPath(image) {
            const thumb = image.filepaths.find(
                (filepath) => filepath.type == "thumbnail"
            );
            return thumb.path;
        },
        handleInterestClick() {
            const preferredLo = localStorage.getItem("preferredLo");
            if (preferredLo && preferredLo !== null) {
                this.submitProductInterest();
            } else {
                this.preferredLoModalShowing = true;
            }
        },
        getPreferredLo() {
            this.preferredLoModalShowing = true;
        },
        submitProductInterest() {
            this.preferredLoModalShowing = false;
            // post product order (lo employee number & product id)
            const preferredLo = JSON.parse(localStorage.getItem("preferredLo"));
            const payload = {
                productId: this.product.id,
                preferredLo: preferredLo.employeeNumber,
                user: this.activeUser,
            };
            this.$store.commit("SET_LOADING", true, { root: true }); // start loading spinner
            api.catalog
                .sendProductInterest(payload)
                .then((response) => {
                    if (response.status === 200) {
                        this.interestConfirmationModalShowing = true;
                    }
                    this.$store.commit("SET_LOADING", false, { root: true }); // stop loading spinner
                })
                .catch((error) => {
                    handleApiError(error, error.response.data.detail);
                });
        },
    },
    async created() {
        const product = await this.productById(this.$route.params.productId);
        if (product) {
            this.product = JSON.parse(JSON.stringify({ ...product }));
        } else {
            const response = await this.updateProduct(
                this.$route.params.productId
            );
            if (response.length == 0) {
                this.$router.push("/404");
            } else {
                this.product = JSON.parse(JSON.stringify({ ...response[0] }));
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.productPage {
    display: flex;
    justify-content: center;
    padding: $standard-view;
    @include breakpoint(ipadPro) {
        padding: 4rem 4rem 10rem;
    }
    @include breakpoint(tablet-port) {
        padding: 4rem 2rem 10rem;
    }
    .content-wrapper {
        width: 1024px;
        margin-right: 6rem;
        display: flex;
        justify-content: space-around;
        @include breakpoint(tablet-land) {
            margin-top: 4rem;
        }
        @include breakpoint(ipadPro) {
            width: 100%;
        }
        @include breakpoint(tablet-land) {
            margin-right: 0;
        }
        @include breakpoint(tablet-port) {
            flex-wrap: wrap;
            justify-content: flex-start;
        }
    }
}
.productDisplay {
    margin-right: 2rem;

    a.main {
        display: block;
        width: 100%;
    }
    img.main {
        max-width: 100%;
        height: auto;
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
    margin-left: 2rem;
    @include breakpoint(tablet-port) {
        margin-left: 0;
        margin-top: 2rem;
    }
    .productDescription {
        max-width: 40rem;
        font-size: 14px;
        margin-bottom: 3rem;
    }
    h1 {
        margin-bottom: 4rem;
        font-weight: 800;
        @include breakpoint(tablet-land) {
            position: absolute;
            top: 13rem;
            left: 4rem;
            padding-right: 2rem;
        }
        @include breakpoint(tablet-port) {
            left: 2rem;
        }
    }
    h3 {
        margin-bottom: 2rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid $gray;
        font-size: 1.8rem;
        color: #333;
        font-weight: 800;
    }
}

.controls {
    button:first-of-type {
        margin-right: 2rem;
        margin-bottom: 2rem;
    }
    button {
        font-weight: 700;
        font-family: 'Nunito Sans', sans-serif;
    }
}
</style>
