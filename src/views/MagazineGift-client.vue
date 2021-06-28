<template>
  <div class="magazineGiftClient">
    <h1 class="heading">Select Your Magazine Gift</h1>

    <!-- Table -->
    <transition name="fadeInOut" appear>
      <div class="resultsTable">
        <vue-good-table
          :columns="tableColumns"
          :rows="magazines.magazines"
          styleClass="vgt-table"
          :search-options="{
            enabled: true
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 5,
          }"
          :sort-options="{
            enabled: true,
            initialSortBy: { field: 'title', type: 'asc' }
          }"
        >
          <!-- Dynamic table rows -->
          <template slot="table-row" slot-scope="props">
            <!-- Magazine -->
            <span v-if="props.column.field === 'image'">
              <img :src="props.row.image" class="magazineThumb" />
            </span>

            <!-- Edit -->
            <span v-else-if="props.column.field === 'select'">
              <app-button classes="btn btn-green" @click.native="openConfirmModal(props.row)" text="Select" />
            </span>

            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
          </template>
        </vue-good-table>
      </div>
    </transition>

    <transition name="editBorrower">
      <confirm-info-modal
        v-if="confirmModalShowing"
        @close="confirmModalShowing = false"
        @thankyou="sendFinalNotification('thankyou')"
        :loan-info="borrowerInfo"
        :magazine="selectedMagazine"
      />
    </transition>

    <transition name="editBorrower">
      <final-notification-modal
        v-if="finalNotificationModalShowing"
        :final-notification="finalNotification"
      />
    </transition>
  </div>
</template>

<script>
import api from "@/store/api";
import { mapActions, mapState } from "vuex";
// components
import VueGoodTable from "@/components/Shared/Table/Table";
import FinalNotificationModal from "@/components/Shared/FinalNotificationModal";

export default {
    name: "MagazineGift-client",
    components: {
        "vue-good-table": VueGoodTable,
        "final-notification-modal": FinalNotificationModal,
        "app-button": () => import("@/components/Shared/AppButton"),
        "confirm-info-modal": () =>
            import("@/components/MagazineProgram/ConfirmInfoModal"),
    },
    data() {
        return {
            addEditShowing: false,
            action: "",
            selectedItem: undefined,
            tableColumns: [
                {
                    label: "Image",
                    field: "image",
                    width: "200px",
                },
                {
                    label: "Title",
                    field: "title",
                    width: "350px",
                },
                {
                    label: "Description",
                    field: "description",
                },
                {
                    label: "",
                    field: "select",
                    width: "150px",
                    thClass: "vgt-right-align",
                    tdClass: "vgt-right-align",
                },
            ],
            borrowerInfo: null,
            confirmModalShowing: false,
            selectedMagazine: null,
            finalNotificationModalShowing: false,
            finalNotification: {
                heading: null,
                message: null,
            },
        };
    },
    computed: {
        ...mapState(["magazines"]),
    },
    methods: {
        ...mapActions(["updateMagazines"]),
        openConfirmModal(magazine) {
            this.selectedMagazine = magazine;
            this.confirmModalShowing = true;
        },
        sendFinalNotification(type) {
            if (type == "thankyou") {
                this.finalNotification.heading =
                    "Thank you for choosing a magazine!";
                this.finalNotification.message =
                    "You should be receiving your first magazine in 2-3 months!";
            } else {
                this.finalNotification.heading =
                    "Sorry, but you have already made a magazine selection and it is on the way.";
                this.finalNotification.message = null;
            }
            this.finalNotificationModalShowing = true;
        },
    },

    async created() {
        await this.updateMagazines();
    },

    async mounted() {
        await api.magazines
            .fetchClosedLoansByLoanNumber(this.$route.query.loanNumber)
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response.data;
                    this.borrowerInfo = data.marketingV1GetLoan;
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        this.$router.push("/404");
                    }
                    if (error.response.status === 403) {
                        this.sendFinalNotification("selection-made");
                    }
                }
            });
    },
};
</script>

<style lang="scss" scoped>
.magazineGiftClient {
    padding: $standard-view;
    h1.heading {
        font-weight: 800;
    }
    .resultsTable {
        margin-top: 7rem;
        .magazineThumb {
            width: 70px;
        }
        ::v-deep .vgt-responsive {
            table.vgt-table {
                td {
                    font-weight: 600;
                }
            }
        }
    }
}
</style>
