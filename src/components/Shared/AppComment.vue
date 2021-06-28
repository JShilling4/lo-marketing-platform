<template>
    <div class="comment">
        <div class="comment__heading">
            <app-avatar
                :avatar-url="buildAvatarUrl(comment.employee.email, '100', 'ShortcutIcon')"
                size="small"
            />
            <h2>{{ comment.employee.fullName }}</h2>
            <span class="timeStamp">{{ timestamp }}</span>
            <div
                v-if="showMenu"
                class="menu"
            >
                <i class="fas fa-edit icon" />
                <ul class="menu__optionList">
                    <li
                        class="option"
                        @click="removeComment"
                    >Delete</li>
                </ul>
            </div>

        </div>
        <div class="comment__body">
            <span
                v-html="comment.comment"
                class="text"
            />
            <div
                v-if="comment.filepath !== null"
                class="comment__imageContainer"
            >
                <img
                    v-if="validImage"
                    :src="comment.filepath"
                    height="75"
                    class="image"
                >
                <a
                    :href="comment.filepath"
                    target="_blank"
                    class="imageLink"
                >{{ comment.filepath.split('/').pop()}}</a>
            </div>
        </div>
    </div>
</template>

<script>
import AppAvatar from "@/components/Shared/AppAvatar";
import moment from "moment";
import { avatars, renderByFileType } from "@/mixins";

export default {
    name: "AppComment",
    mixins: [avatars, renderByFileType],
    components: {
        "app-avatar": AppAvatar,
    },
    props: {
        comment: Object,
        showMenu: Boolean,
        isAdmin: [Number, String],
    },
    data() {
        return {
            timestamp: "",
        };
    },
    computed: {
        validImage() {
            const allowedFileTypes = new RegExp(
                "(.*?).(jpg|jpeg|png|tiff|gif)$"
            );

            if (allowedFileTypes.test(this.comment.filepath.toLowerCase())) {
                return true;
            }
            return false;
        },
    },
    methods: {
        removeComment() {
            this.$emit("delete-comment", this.comment.id);
        },
    },
    mounted() {
        this.timestamp = moment(this.comment.datetime).fromNow();
        // update the comment timestamp every minute
        // eslint-disable-next-line no-return-assign
        setInterval(
            () => (this.timestamp = moment(this.comment.datetime).fromNow()),
            60000
        );
    },
};
</script>

<style lang="scss" scoped>
.comment {
    margin-bottom: 1.75rem;
    &__heading {
        display: flex;
        img {
            height: 35px;
        }
        h2 {
            margin: 0 1rem;
            font-size: 1.5rem;
            @include breakpoint(tablet-land) {
                font-size: 1.2rem;
            }
        }
        .timeStamp {
            font-size: 1.2rem;
            color: $teal-light;
            padding-top: 1px;
            @include breakpoint(tablet-land) {
                font-size: 1rem;
            }
        }
        .menu {
            position: relative;
            width: 5rem;
            cursor: pointer;
            &:hover .menu__optionList {
                display: block;
            }
            .icon {
                margin-left: 1rem;
                font-size: 13px;
                color: $gray;
            }
            &__optionList {
                position: absolute;
                top: 1px;
                right: -4rem;
                display: none;
                background-color: #fff;
                .option {
                    padding: 0.1rem 1rem 0;
                    font-size: 11px;
                    cursor: pointer;
                    border-radius: 2rem;
                    border: 1px solid $red;
                    color: $red;
                    &:hover {
                        background-color: $red;
                        color: #fff;
                    }
                }
            }
        }
    }
    &__body {
        display: flex;
        flex-wrap: wrap;
        padding-left: 4.5rem;
        font-size: 1.4rem;
        margin-top: -1.5rem;
        @include breakpoint(tablet-land) {
            font-size: 1.2rem;
            margin-top: -2rem;
        }
        .text {
            display: flex;
            flex-wrap: wrap;
        }
    }
    &__imageContainer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        P .image {
            margin-top: 0.5rem;
            max-height: 75px;
        }
        .imageLink {
            display: inline-block;
            color: $linkBlue;
            margin: 0.5rem 0 0 0;
        }
    }
    .revisionTag {
        color: $orange;
    }
}
</style>
