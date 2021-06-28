<template>
    <div class="ideaCard">
        <div class="ideaCard__heading">
            <img
                class="avatar"
                :src="buildAvatarUrl(details.employee.email, '100', 'ShortcutIcon')"
                alt
            />
            <h2>{{ details.employee.fullName }}</h2>
            <span class="timeStamp">{{ timestamp }}</span>
        </div>

        <div class="ideaCard__idea">
            <p>{{ details.text }}</p>
        </div>

        <div class="statRow">
            <app-button
                classes="btn btn-green"
                @click.native="showComments = !showComments"
                text="Comment"
            />
            <ul class="statRow__statList">
                <li>
                    <i class="fas fa-heart"></i>17 likes
                </li>
                <li>{{ commentCount }}</li>
            </ul>
        </div>

        <div
            v-if="showComments"
            class="commentBox"
        >
            <transition-group
                name="commentShift"
                tag="span"
                appear
            >
                <app-comment
                    v-for="comment in details.comments"
                    :key="comment.id"
                    :comment="comment"
                />
            </transition-group>
            <div class="input">
                <textarea
                    v-focus
                    rows="10"
                    @keyup.enter="onCommentSubmit"
                    :value="newComment.comment"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { avatars } from "@/mixins";
import moment from "moment";
import AppComment from "@/components/Shared/AppComment.vue";

export default {
    name: "IdeaCard",
    mixins: [avatars],
    components: {
        "app-comment": () => import("@/components/Shared/AppComment.vue"),
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    props: {
        details: Object,
        activeUser: Object,
    },
    data() {
        return {
            showComments: false,
            newComment: {
                id: null,
                employeeName: `${this.activeUser.firstName} ${this.activeUser.lastName}`,
                employeeAvatar: this.activeUser.avatarUrl,
                datetime: "",
                comment: "",
            },
            timestamp: "",
        };
    },
    mounted() {
        this.timestamp = moment(this.details.datetime).fromNow();
        // update the comment timestamp every minute
        // eslint-disable-next-line no-return-assign
        setInterval(
            () => (this.timestamp = moment(this.details.datetime).fromNow()),
            60000
        );
    },
    computed: {
        timeSince() {
            return moment(this.details.datetime).fromNow();
        },
        commentCount() {
            if (this.details.comments != []) {
                const count = this.details.comments.length;
                return count == 1 ? "1 comment" : `${count} comments`;
            }
            return "0 comments";
        },
    },
    methods: {
        ...mapActions(["addCommentToIdea"]),
        onCommentSubmit(e) {
            const newComment = {
                id: Math.round(Math.random() * 1000),
                employee: {
                    employeeNumber: this.activeUser.employeeNumber,
                    fullName: this.activeUser.fullName,
                    email: this.activeUser.email,
                },
                filepath: null,
                comment: e.target.value,
                datetime: moment().toISOString(),
            };
            this.addCommentToIdea({
                ideaId: this.details.id,
                comment: newComment,
            });
            if (this.$socket) {
                this.$socket.emit("addIdeaComment", {
                    ideaId: this.details.id,
                    comment: newComment,
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.ideaCard {
    margin: 0 0 6rem;
    padding: 1rem 1.5rem 1.5rem;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
    &__heading {
        display: flex;
        align-items: center;
        img {
            height: 35px;
        }
        h2 {
            margin: 0 1.5rem 0 1rem;
            font-size: 1.6rem;
        }
        .timeStamp {
            font-size: 1.2rem;
        }
    }
    &__idea {
        margin: 1.5rem 0 1rem;
        padding: 0 0 1rem;
        font-size: 1.4rem;
        border-bottom: 2px solid $gray;
        p {
            line-height: 1.7;
            word-wrap: break-word;
        }
    }
    .statRow {
        margin: 1.5rem 0;
        display: flex;
        align-items: center;
        button {
            display: inline-block;
            padding: 0.5rem 1rem;
            &:hover {
                background-color: $teal-light;
                color: #fff;
            }
        }
        &__statList {
            display: flex;
            justify-content: space-around;
            margin-left: auto;
            li {
                margin-left: 3rem;
                font-size: 1.4rem;
                color: $gray-dark;
                .fa-heart {
                    margin-right: 0.5rem;
                    font-size: 1.2rem;
                }
            }
        }
    }
    .input {
        margin-top: 2rem;

        textarea {
            width: 100%;
            height: 6rem;
            padding: 1rem;
            font-family: "Nunito Sans", sans-serif;
            border: 2px solid $gray;
            border-radius: 5px;
            outline: none;
            resize: none;
        }
    }
}

// TRANSITIONS
.commentShift-enter-active,
.commentShift-leave-active {
    transition: transform 0.3s ease-in-out, opacity 0.5s ease-in-out;
    transform-origin: center;
}
.commentShift-enter,
.commentShift-leave-to {
    opacity: 0;
    transform: translateY(2rem);
}
</style>
