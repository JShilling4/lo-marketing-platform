<template>
    <transition name="fadeInOut" appear>
        <div class="resourceCard">
            <a :href="resource.targetUrl" target="_blank">
                <img :src="resource.imagePath" />
                <div class="cta-container">
                    <p class="heading">{{ resource.subject }}</p>
                    <a
                        :href="resource.targetUrl"
                        target="_blank"
                        class="btn btn-orange"
                        >{{ resource.ctaText }}</a
                    >
                </div>
            </a>
        </div>
    </transition>
</template>

<script>
export default {
    name: "ResourceCard",
    props: {
        resource: Object,
    },
};
</script>

<style lang="scss" scoped>
.resourceCard {
    margin: 0 0 6rem;
    box-shadow: $dropdownShadow;
    text-align: center;
    font-size: 1.3rem;
    width: 275px;
    position: relative;
    transition: transform 0.6s;
    backface-visibility: hidden;
    transform: scale(.97) translate3d(0,0,0) perspective(1px);
    -webkit-font-smoothing: subpixel-antialiased;
    img {
        display: block;
        max-width: 100%;
        height: auto;
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
    .cta-container {
        padding: 3rem 0;
        background-color: #fff;
        .heading {
            font-weight: 600;
            margin-bottom: 1rem;
        }
    }
    .btn {
        background-color: transparent;
        border: 1px solid #000;
        border-radius: 2rem;
        font-weight: 600;
        padding: 0.5rem 2rem 0.25rem;
        text-align: center;
        min-width: 9rem;
        transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
        cursor: pointer;
        font-size: 12px;
        &:focus,
        &:active {
            outline: none;
        }
        &.btn-orange {
            color: $orange;
            border-color: $orange;
            transition: background-color 0.3s ease-in-out,
                color 0.3s ease-in-out;
            &:hover {
                background-color: $orange;
                color: #fff;
            }

            &-fill {
                background-color: $orange;
                border-color: #fff;
                color: #fff;
            }
        }
    }
}
</style>
