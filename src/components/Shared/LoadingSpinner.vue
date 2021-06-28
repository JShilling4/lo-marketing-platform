<template>
    <div class="loader"></div>
</template>

<script>
export default {
    name: "LoadingSpinner",
};
</script>

<style lang="scss" scoped>
.loader {
    position: fixed;
    top: 2rem;
    left: 3rem;
    z-index: 1000;
    animation: rotate 2s infinite;
    height: 60px;
    width: 60px;
    @media screen and (max-width: 1674px) {
        position: absolute;
        left: 25rem;
    }
    @include breakpoint(tablet-port) {
        left: 17rem;
    }
    @include breakpoint(mobile-small) {
        left: 6rem;
        top: 8rem;
    }
}

.loader:before,
.loader:after {
    border-radius: 50%;
    content: "";
    display: block;
    height: 30px;
    width: 30px;
}
.loader:before {
    animation: ball1 1s infinite;
    background-color: $orange;
    box-shadow: 45px 0 0 $blue-green;
    margin-bottom: 10px;
}
.loader:after {
    animation: ball2 1s infinite;
    background-color: $teal-light;
    box-shadow: 45px 0 0 $blue-dark;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) scale(0.5);
    }
    50% {
        transform: rotate(360deg) scale(0.8);
    }
    100% {
        transform: rotate(720deg) scale(0.5);
    }
}

@keyframes ball1 {
    0% {
        box-shadow: 45px 0 0 $blue-dark;
    }
    50% {
        box-shadow: 0 0 0 $blue-dark;
        margin-bottom: 0;
        transform: translate(15px, 15px);
    }
    100% {
        box-shadow: 45px 0 0 $blue-dark;
        margin-bottom: 10px;
    }
}

@keyframes ball2 {
    0% {
        box-shadow: 45px 0 0 $blue-green;
    }
    50% {
        box-shadow: 0 0 0 $blue-green;
        margin-top: -30px;
        transform: translate(15px, 15px);
    }
    100% {
        box-shadow: 45px 0 0 $blue-green;
        margin-top: 0;
    }
}
</style>
