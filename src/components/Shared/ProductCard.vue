<template>
    <div class="productCard">
        <img :src="primaryPreviewPath" />
        <div class="productCard__footer">
            <div class="nameContainer">
                <h2
                    @mouseover="checkOverflow()"
                    @mouseleave="tooltipShowing = false"
                >
                    {{ nameEllipsis }}
                </h2>
                <transition name="tooltip">
                    <span v-if="tooltipShowing" class="tooltip">{{
                        details.name
                    }}</span>
                </transition>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "ProductCard",
    props: {
        details: Object,
        type: String,
    },
    data() {
        return {
            tooltipShowing: false,
        };
    },
    computed: {
        ...mapState(["products"]),
        primaryPreviewPath() {
            try {
                const primaryImage = this.details.productImages.find(
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
        nameEllipsis() {
            let name = this.details.name;
            if (name.length > 25) {
                return name.substring(0, 25) + "...";
            } else {
                return name;
            }
        },
    },
    methods: {
        editProduct(id) {
            this.$emit("edit", id);
        },
        checkOverflow() {
            if (this.details.name.length > 25) {
                this.tooltipShowing = true;
            } else {
                this.tooltipShowing = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.productCard {
    position: relative;
    margin: 0 0 8rem;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
    width: $prodCard-width;
    transition: transform 0.6s;
    backface-visibility: hidden;
    transform: scale(.97) translate3d(0,0,0) perspective(1px);
    -webkit-font-smoothing: subpixel-antialiased;
    img {
        display: block;
        width: 100%;
        margin: 0 auto;
        object-fit: cover;
        height: $prodCard-height;
    }
    &:before {
        content: "";
        position: absolute;
        z-index: -1;
        top: -1px;
        left: -1px;
        height: 0;
        width: 0;
        padding: 1px;
        background-color: transparent;
        transition: background-color 0.3s, height 0.5s, width 0.5s;
    }
    &:hover:before {
        background-color: $teal-light;
        height: 100%;
        width: 100%;
    }
    &:hover {
        transform: translateY(-1rem) scale(1) translate3d(0,0,0);
    }
    &__footer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1.5rem 2rem 1rem;
        background-color: #fff;
        .nameContainer {
            position: relative;
            h2 {
                font-size: 1.6rem;
                cursor: default;
            }
            .tooltip {
                position: absolute;
                bottom: 3rem;
                color: #fff;
                background-color: rgba(0, 0, 0, 0.8);
                border-radius: 2rem;
                padding: 1rem 2rem;
            }
        }
    }
    button.duplicate {
        margin-left: 1rem;
    }
}

@include slideUpEnter("tooltip", 0, 3rem);
</style>


