<template>
    <div class="activity">
        <span class="activity__text">{{ activity.note }}</span>
        <span class="activity__timeStamp">{{ timestamp }}</span>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "OrderActivity",
    props: {
        activity: Object,
    },
    data() {
        return {
            timestamp: "",
        };
    },
    mounted() {
        this.timestamp = moment(this.activity.datetime).fromNow();
        // update the comment timestamp every minute
        // eslint-disable-next-line no-return-assign
        setInterval(
            () => (this.timestamp = moment(this.activity.datetime).fromNow()),
            60000
        );
    },
};
</script>

<style lang="scss" scoped>
.activity {
    display: flex;
    @include breakpoint(tablet-land) {
        flex-wrap: wrap;
        margin-bottom: 1.75rem;
    }
    &__text {
        display: block;
        color: $gray;
        font-size: 1.4rem;
        font-weight: 600;
        margin: 0 1rem 1.75rem 0;
        @include breakpoint(tablet-land) {
            font-size: 1.2rem;
            margin-bottom: 0;
        }
    }
    &__timeStamp {
        font-size: 1.2rem;
        color: $teal-light;
        padding-top: 1px;
        @include breakpoint(tablet-land) {
            font-size: 1rem;
        }
    }
}
</style>
