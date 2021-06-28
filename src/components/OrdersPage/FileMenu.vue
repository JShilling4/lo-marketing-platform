<template>
    <div class="file-menu">
        <div
            v-if="fileHasError"
            class="error-message"
            v-on-clickaway="closeError"
        >
            Only images can be reviewed in the proof viewer. If this file needs reviewed, please delete,
            then re-add with one of the following file extensions: jpg,jpeg,png,tiff,gif
        </div>
        <div
            v-if="selectedProof.status !== 'uploaded'"
            class="option"
            @click="$refs.replaceDeliverable.click()"
        >
            Add New Version
            <input
                type="file"
                ref="replaceDeliverable"
                @input="onInput($event)"
                class="replaceDeliverable"
                title=" "
            />
        </div>
        <div
            v-if="selectedProof.status !== 'final'"
            class="option --final"
            @click="$emit('edit', 'final')"
        >
            Move to Downloads
        </div>
        <div
            v-if="!isProof"
            class="option --uploaded"
            @click="validateFileForProofViewer"
        >
            Needs Reviewed
        </div>
        <div
            v-if="selectedProof.status !== 'uploaded'"
            class="option --uploaded"
            @click="resetStatus"
        >
            Reset Status
        </div>
        <div
            class="option"
            @click="$emit('remove')"
        >Delete</div>
    </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
    name: "FileMenu",
    mixins: [clickaway],
    props: {
        selectedProof: {
            type: Object,
        },
    },
    data() {
        return {
            fileHasError: false,
        };
    },
    computed: {
        isProof() {
            return (
                this.selectedProof.status !== "final" &&
                this.selectedProof.status !== "uploaded"
            );
        },
    },
    methods: {
        validateFileForProofViewer() {
            const allowedFileTypes = new RegExp(
                "(.*?).(jpg|jpeg|png|tiff|gif)$"
            );

            if (
                allowedFileTypes.test(
                    this.selectedProof.assets[0].filepath.toLowerCase()
                )
            ) {
                this.$emit("edit", "underReview");
                this.$emit("close");
            } else {
                this.fileHasError = true;
            }
        },
        resetStatus() {
            this.$emit("edit", "uploaded");
            this.$emit("close");
        },
        onInput(e) {
            this.$emit("input", e);
        },
        closeError() {
            this.fileHasError = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.file-menu {
    position: absolute;
    top: 4rem;
    right: -0.2rem;
    z-index: 10;
    text-align: right;
    margin-right: 100%;
    min-width: 20rem;
    .option {
        display: table;
        margin-left: auto;
        padding: 0.5rem 1.5rem 0.5rem 1.5rem;
        font-weight: 600;
        font-size: 14px;
        border-radius: 2rem;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
        &:first-child {
            color: $orange;
        }
        &.--final,
        &.--approved {
            color: $approved;
        }
        &.--uploaded {
            color: #333;
        }
        &:last-child {
            color: $red;
        }
    }
    .replaceDeliverable {
        display: none;
    }
    .error-message {
        position: absolute;
        background-color: $red;
        color: #fff;
        bottom: 10rem;
        padding: 1rem;
        border-radius: 5px;
        width: 30rem;
        text-align: center;
    }
}
</style>
