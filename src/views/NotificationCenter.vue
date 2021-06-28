<template>
    <div class="notificationCenter">
        <h1 class="heading">Notification Center</h1>

        <div class="utilityBar"></div>

        <transition
            name="fadeInOut"
            appear
        >
            <div
                v-if="users.activeUser.notifications"
                class="resultsTable"
            >
                <vue-good-table
                    :columns="tableColumns"
                    :rows="users.activeUser.notifications"
                    @on-row-click="goToDestinationUrl"
                    styleClass="vgt-table"
                    :search-options="{
            enabled: true
          }"
                    :pagination-options="{
            enabled: true,
            mode: 'pages'
          }"
                    :sort-options="{
            enabled: true,
            initialSortBy: { field: 'createdDatetime', type: 'desc' }
          }"
                >
                    <!-- Custom column header -->
                    <template
                        slot="table-column"
                        slot-scope="props"
                    >
                        <span v-if="props.column.field == 'clear'">
                            <app-button
                                class="btn btn-red-fill"
                                text="Clear All"
                                @click.native="clearAllNotifications"
                            />
                        </span>
                        <span v-else>
                            {{ props.column.label }}
                        </span>
                    </template>
                    <!-- Dynamic table rows -->
                    <template
                        slot="table-row"
                        slot-scope="props"
                    >
                        <span
                            v-if="props.column.field == 'message'"
                            v-html="props.row.message"
                            :class="[
                { '--read': props.row.isRead == 1 },
                { message: props.column.field == 'message' }
              ]"
                        ></span>
                        <span v-else-if="props.column.field == 'clear' && props.row.isRead == 0">
                            <app-button
                                text="Clear"
                                classes="btn btn-orange-fill"
                                @click.native="toggleIsRead($event, props.row)"
                            />
                        </span>
                        <span
                            v-else
                            :class="[
                { '--read': props.row.isRead == 1 },
                { dateCreated: props.column.field == 'createdDatetime' }
              ]"
                        >
                            {{
                props.column.field == "createdDatetime"
                  ? formatDate(props.formattedRow[props.column.field], "MMM D, YYYY [at] hh:mm a")
                  : props.formattedRow[props.column.field]
              }}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueGoodTable from "@/components/Shared/Table/Table";
// mixins
import { format } from "@/mixins";

export default {
    name: "NotificationCenter",
    components: {
        "vue-good-table": VueGoodTable,
        "app-button": () => import("@/components/Shared/AppButton"),
    },
    mixins: [format],
    data() {
        return {
            tableColumns: [
                {
                    label: "Time",
                    width: "250px",
                    field: "createdDatetime",
                    thClass: "th-time",
                    tdClass: "td-time",
                },
                {
                    label: "Notification",
                    field: "message",
                    thClass: "th-notification",
                    tdClass: "td-notification",
                },
                {
                    label: "Clear All",
                    width: "120px",
                    field: "clear",
                    tdClass: "vgt-center-align",
                    thClass: "vgt-center-align clearAll",
                    sortable: false,
                },
            ],
        };
    },
    computed: {
        ...mapState(["users"]),
    },
    watch: {},
    methods: {
        ...mapActions(["updateNotifications"]),
        goToDestinationUrl(params) {
            if (params.row.destinationUrl !== null) {
                this.$router.push(params.row.destinationUrl);
            }
        },
        toggleIsRead(event, notification) {
            const { id } = notification;
            event.stopPropagation();
            this.updateNotifications({
                notificationIds: [id],
                isRead: 1,
                employeeNumber: this.users.activeUser.employeeNumber,
            });
        },
        clearAllNotifications() {
            const notificationIds = [];
            this.users.activeUser.notifications.forEach((notification) => {
                if (notification.isRead == 0) {
                    const { id } = notification;
                    notificationIds.push(id);
                }
            });
            this.updateNotifications({
                notificationIds,
                isRead: 1,
                employeeNumber: this.users.activeUser.employeeNumber,
            });
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.notificationCenter {
    padding: $standard-view;
    @include breakpoint(ipadPro) {
        padding-right: 4rem;
        padding-left: 4rem;
    }
    @include breakpoint(tablet-port) {
        padding-right: 2rem;
        padding-left: 2rem;
    }
    .heading {
        font-weight: 700;
    }
}
.resultsTable {
    margin-top: 8rem;
    ::v-deep .th-time,
    ::v-deep .td-time,
    ::v-deep .vgt-center-align,
    ::v-deep .vgt-center-align clearAll {
        @include breakpoint(wide) {
            width: 300px;
        }
    }
    ::v-deep .th-time,
    ::v-deep .td-time,
    ::v-deep .vgt-center-align,
    ::v-deep .vgt-center-align clearAll {
        @include breakpoint(desktop) {
            width: 250px;
        }
    }
    ::v-deep .th-time,
    ::v-deep .td-time,
    ::v-deep .vgt-center-align,
    ::v-deep .vgt-center-align clearAll {
        @include breakpoint(laptop) {
            width: 200px;
        }
    }
    ::v-deep .th-notification,
    ::v-deep .td-notification {
        @include breakpoint(laptop) {
            width: 300px;
        }
    }
    ::v-deep .th-time,
    ::v-deep .td-time,
    ::v-deep .th-notification,
    ::v-deep .td-notification {
        @include breakpoint(tablet-port) {
            font-size: 0.6em;
        }
    }
    ::v-deep .vgt-center-align,
    ::v-deep .vgt-center-align clearAll {
        @include breakpoint(tablet-port) {
            width: 150px;
            font-size: 0.6em;
        }
    }
    ::v-deep .vgt-center-align,
    ::v-deep .vgt-center-align clearAll {
        @include breakpoint(mobile) {
            width: 125px;
            padding-left: 5px;
            padding-right: 5px;
        }
    }
    span {
        &.dateCreated {
            color: $teal-light;
            @include breakpoint(laptop) {
                width: 200px;
            }
            &.--read {
                color: $gray;
            }
        }
        &.message {
            color: #333;
            &.--read {
                color: $gray;
                /deep/ span {
                    color: $gray !important;
                }
            }
        }
    }
    ::v-deep .clearAll {
        color: $orange;
        cursor: pointer;
    }
    .btn {
        @include breakpoint(tablet-port) {
            font-size: 0.8em;
        }
        @include breakpoint(mobile) {
            min-width: 60px;
            font-size: 0.8em;
        }
    }
}
</style>
