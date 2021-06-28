<template>
    <div class="productReview">
        <transition name="fadeInOut" mode="out-in">
            <div v-if="product" class="content">
                <div class="product-info">
                    <img
                        :src="product.productImages[0].filepaths[1].path"
                        class="product-info__image"
                        alt=""
                    >
                    <h2 class="product-info__name">{{ product.name }}</h2>
                    <star-rating
                            :star-size="40"
                            :show-rating="false"
                            :increment="1"
                            v-model="rating"
                            active-color="#16af8c"
                            :padding="20"
                            class="product-info__rating"
                        />
                    <span v-if="rating == null">Click a star to rate this product</span>
                </div>

                <transition name="fadeInOut">
                    <div v-if="rating !== null" class="comment">
                        <p class="comment__label">
                            Please provide additional feedback <span>(optional)</span>
                        </p>
                        <text-area
                            v-model="comment"
                            class="comment__input"
                        />
                        <app-button
                            classes="btn btn-green comment__button"
                            text="Send Review"
                            @click.native="postReview()"
                        />
                    </div>
                </transition>
            </div>

            <loading-dots
                v-else
                loading-text="Loading product"
            />
        </transition>

        <transition name="fadeInOut">
            <final-notification-modal
                v-if="showFinalModal"
                :final-notification="{
                    heading: 'Thank you for providing feedback!'
                }"
            />
        </transition>
    </div>

</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "ReviewProduct",
    components: {
        "star-rating": () => import("vue-star-rating"),
        "text-area": () => import("@/components/Shared/Inputs/TextArea"),
        "app-button": () => import("@/components/Shared/AppButton"),
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
        "final-notification-modal": () =>
            import("@/components/Shared/FinalNotificationModal"),
    },
    data() {
        return {
            comment: null,
            rating: null,
            showFinalModal: false,
            isUpdating: false,
        };
    },
    computed: {
        ...mapState(["users"]),
        ...mapGetters(["productById"]),
        product() {
            return this.productById(this.$route.query.productId);
        },
        activeUser() {
            return this.users.activeUser;
        },
    },
    watch: {
        activeUser(newValue, oldValue) {
            if (!oldValue.employeeNumber) {
                this.getProductReview();
            }
        },
    },
    methods: {
        ...mapActions([
            "updateProduct",
            "createProductReview",
            "updateProductReview",
            "fetchProductReview",
        ]),
        async postReview() {
            const payload = {
                employeeId: this.activeUser.employeeNumber,
                productId: this.product.id,
                rating: this.rating,
                comment: this.comment,
            };
            const response = await this.createProductReview(payload);
            if (response.status == 200) {
                this.showFinalModal = true;
            }
        },
        async getProductReview() {
            // check if this product has a review from this user
            const response = await this.updateProductReview({
                employeeId: this.activeUser.employeeNumber,
                productId: this.product.id,
            });
            if (response.status == 200) {
                const { comment, rating } = response.data;
                this.rating = rating;
                this.comment = comment;
            }
        },
    },
    async mounted() {
        const queryProductId = this.$route.query.productId;
        // use query strings to fetch order & product, route 404 if product not found
        if (queryProductId) {
            const productResponse = await this.updateProduct(queryProductId);
            if (productResponse.length == 0) {
                this.$router.replace("/404");
            }
            if (this.activeUser.employeeNumber) {
                this.getProductReview();
            }
        } else {
            this.$router.replace("/404");
        }
    },
};
</script>

<style lang="scss" scoped>
.productReview {
    width: 900px;
    margin: 0 auto;
    padding: 6rem 4rem;
    @include breakpoint(ipadPro) {
        width: 80%;
    }
    @include breakpoint(tablet-port) {
        width: 100%;
    }
    @include breakpoint(mobile) {
        padding: 6rem 2rem;
    }
}
.product-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 700px;
    margin: 0 auto;
    @include breakpoint(ipadPro) {
        width: 100%;
    }
    &__image {
        width: 200px;
        margin-bottom: 2rem;
    }
    &__name {
        margin-bottom: 1rem;
        font-weight: 800;
        @include breakpoint(mobile) {
            font-size: 2rem;
        }
    }
    &__rating {
        margin-left: 2rem;
        margin-bottom: 4rem;
    }
}
.comment {
    &__label {
        margin-bottom: 1rem;
        font-weight: 700;
        span {
            color: $gray;
        }
    }
    &__button {
        display: block;
        margin: 1rem 0 0 auto;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
}
::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}
</style>
