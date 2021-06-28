<template>
    <div class="interestConfirmationModal">
        <p class="heading">
            Great! We've sent {{ preferredLo }} an email that your interested in this product.
        </p>
        <p class="subheading">They will place the order for you.</p>

        <div class="controls">
            <app-button
                @click.native="$emit('close')"
                class="btn btn-orange"
                text="Keep Browsing!"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "InterestConfirmationModal",
    components: {
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    computed: {
        preferredLo() {
            const preferredLo = JSON.parse(localStorage.getItem("preferredLo"));
            return preferredLo.name;
        },
    },
};
</script>

<style lang="scss" scoped>
.interestConfirmationModal {
    position: fixed;
    top: 15rem;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    padding: 4rem 6rem;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
    .heading {
        color: $gray-dark;
        text-align: center;
        font-size: 2.2rem;
        margin-bottom: 2rem;
    }
    .subheading {
        color: $gray-dark;
        text-align: center;
        margin-bottom: 3rem;
    }
    .controls {
        display: flex;
        justify-content: space-around;
        margin-top: 4rem;
    }
}

@include slideDownEnter("interestConfirmation", 10rem, 15rem);
</style>
