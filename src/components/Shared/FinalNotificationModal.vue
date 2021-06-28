<template>
    <div class="backdrop">
        <div class="thankyouModal">
            <h1>{{ finalNotification.heading }}</h1>

            <p v-if="finalNotification.message">{{ finalNotification.message }}</p>

            <router-link to="/">
                Go to marketing site <i class="fas fa-angle-right"></i>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "FinalNotificationModal",
    props: {
        finalNotification: {
            type: Object,
        },
        showHomeLink: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
}
.thankyouModal {
    position: absolute;
    z-index: 1000;
    top: 20rem;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    padding: 4rem 6rem;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
    text-align: center;
    h1 {
        font-weight: 600;
        color: $teal-light;
    }
    p {
        color: $gray-dark;
        margin-top: 2rem;
    }
    a {
        display: block;
        margin-top: 4rem;
        color: $gray;
        font-weight: 600;
        font-size: 2rem;
        transition: color 0.3s;
        &:hover {
            color: $orange;
        }
    }
}
</style>
