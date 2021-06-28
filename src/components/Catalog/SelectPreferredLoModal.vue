<template>
    <div class="preferredLoModal">
        <p class="heading">
            We see you don't have a preferred Loan Officer selected.
        </p>
        <p class="subheading">Select from the list below.</p>
        <!-- Preferred LO -->
        <div class="form-group">
            <div class="multiselect-wrapper">
                <multi-select
                    v-model="localPreferredLo"
                    track-by="employeeNumber"
                    label="fullName"
                    placeholder="Select Loan Officer"
                    selectLabel=""
                    deselectLabel=""
                    selectedLabel=""
                    :preserve-search="true"
                    :options="users.loanOfficers"
                >
                </multi-select>
            </div>
        </div>

        <div class="controls">
            <app-button
                @click.native="savePreferredLo"
                class="btn btn-green"
                text="Submit"
            />
            <app-button
                @click.native="$emit('close')"
                class="btn btn-black"
                text="Cancel"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "PreferredLoModal",
    components: {
        "multi-select": () => import("vue-multiselect"),
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    data() {
        return {
            localPreferredLo: null,
        };
    },
    computed: {
        ...mapState(["users"]),
    },
    methods: {
        ...mapActions(["fetchLoanOfficers"]),
        savePreferredLo() {
            localStorage.setItem(
                "preferredLo",
                JSON.stringify({
                    employeeNumber: this.localPreferredLo.employeeNumber,
                    name: this.localPreferredLo.fullName,
                })
            );
            this.$emit("submit");
        },
    },
    mounted() {
        this.fetchLoanOfficers();
    },
};
</script>

<style lang="scss" scoped>
.preferredLoModal {
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

@include slideDownEnter("selectPreferredLo", 10rem, 15rem);
</style>
