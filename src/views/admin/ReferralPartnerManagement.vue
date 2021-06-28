<template>
  <div class="rp-mgmt">
    <h1 class="heading">Referral Partner Management</h1>

    <div class="utilityBar">
      <div class="multiselect-wrapper">
        <multi-select
          v-model="loanOfficerQuery"
          :multiple="true"
          track-by="employeeNumber"
          label="fullName"
          placeholder="Loan Officers"
          selectLabel=""
          deselectLabel=""
          :close-on-select="false"
          :preserve-search="true"
          :options="allLoanOfficers"
        >
          <template slot="selection" slot-scope="{ values, search, isOpen }">
            <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">
              {{ values.length }} selected
            </span>
          </template>
        </multi-select>
      </div>

      <div class="search">
        <i class="fas fa-search icon"></i>
        <text-input type="text" v-model="searchQuery" @keyup.enter.native="searchData" />
      </div>

      <app-button classes="btn btn-orange" @click.native="searchData" text="Search" />
    </div>

    <transition name="fadeInOut" appear>
      <div class="resultsTable">
        <vue-good-table
          :columns="tableColumns"
          :rows="displayedRows"
          :row-style-class="rowStyleClass"
          styleClass="vgt-table"
          :search-options="{
            enabled: false
          }"
          :sort-options="{
            enabled: false
          }"
        >
          <!-- Custom Headers -->
          <template slot="table-column" slot-scope="props">
            <span
              v-if="
                props.column.label == 'Name' ||
                  props.column.label == 'Email' ||
                  props.column.label == 'Company' ||
                  props.column.label == 'Loan Officers'
              "
              class="tableHeader"
              :class="{ '--active': activeSort == props.column.label }"
              @click="sortTableData(props.column.label)"
            >
              {{ props.column.label }}
            </span>
            <span v-else>{{ props.column.label }}</span>
          </template>
          <!-- Dynamic table rows -->
          <template slot="table-row" slot-scope="props">
            <!-- Is Subscribed -->
            <span v-if="props.column.field == 'isSubscribed'" :class="isSubscribedColor(props.row)">
              {{ props.formattedRow[props.column.field] }}
              <app-button
                v-if="props.row.isSubscribed == 1"
                classes="btn btn-red --unsubscribe"
                text="Unsubscribe"
                @click.native="unsubscribe(props.row.id)"
              />
            </span>
            <!-- "Edit" -->
            <span v-else-if="props.column.field == 'edit'">
              <img
                class="tableIcon"
                src="@/assets/images/edit_icon.png"
                @click="openEditModal(props.row)"
                alt
              />
            </span>
            <!-- Delete -->
            <span v-else-if="props.column.field == 'delete'">
              <i
                class="fas fa-times-circle deleteRp"
                @click="onDeleteReferralPartner(props.row.id)"
              ></i>
            </span>

            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
          </template>
        </vue-good-table>
        <base-pagination
          v-if="displayedRows.length > 0"
          :current-page="currentPage"
          :page-count="pageCount"
          class="pagination"
          @nextPage="handlePageChange('next')"
          @previousPage="handlePageChange('previous')"
          @loadPage="handlePageChange"
        />
        <!-- <div class="pagination">
          <span v-for="(n, index) in rowChunks" :key="index" class="paginationNum" @click="showPage(n)">
            {{ n }}
          </span>
        </div> -->
      </div>
    </transition>

    <transition name="addEditRpModal">
      <add-edit-referral-partner
        v-if="editModalShowing"
        :rp="selectedRP"
        @close="editModalShowing = false"
      />
    </transition>

    <!-- Confirmation Modal -->
    <transition name="modal-scale">
      <confirmation-modal
        v-if="confirmModal.showing"
        :message="confirmModal.message"
        :event="confirmModal.event"
        @confirmation="handleConfirmModalEvent"
      />
    </transition>
  </div>
</template>

<script>
// dependencies
import { mapGetters, mapActions, mapState } from 'vuex';
import moment from 'moment';
// components
import VueGoodTable from '@/components/Shared/Table/Table';
import AddEditReferralPartner from '@/components/Admin/ReferralPartners/AddEditReferralPartner';

export default {
  name: 'ReferralPartnerManagement',
  components: {
    'vue-good-table': VueGoodTable,
    'add-edit-referral-partner': AddEditReferralPartner,
    'base-pagination': () => import('@/components/Shared/Pagination/BasePagination'),
    'multi-select': () => import('vue-multiselect'),
    'text-input': () => import('@/components/Shared/Inputs/TextInput'),
    'confirmation-modal': () => import('@/components/Shared/ConfirmationModal'),
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  data() {
    return {
      searchQuery: '',
      loanOfficerQuery: [],
      editModalShowing: false,
      selectedRP: {},
      activeSort: 'Name',
      tableColumns: [
        {
          label: 'Edit',
          field: 'edit',
        },
        {
          label: 'Name',
          field: this.formatName,
        },
        {
          label: 'Company',
          field: 'company',
        },
        {
          label: 'Email',
          field: 'email',
        },
        {
          label: 'Subscribed Date',
          field: 'subscribedDatetime',
          formatFn: this.formatDate,
        },
        {
          label: 'Unsubscribed Date',
          field: 'unsubscribedDatetime',
          formatFn: this.formatDate,
        },
        {
          label: 'Is Subscribed?',
          field: 'isSubscribed',
          formatFn: this.formatIsSubscribed,
          tdClass: this.isSubscribedColor,
          sortable: false,
        },
        {
          label: 'Loan Officer',
          field: 'employee',
          // width: '400px',
          formatFn: this.formatLoanOfficerArray,
          sortable: false,
        },
        {
          label: 'Delete',
          field: 'delete',
          sortable: false,
          thClass: 'vgt-right-align',
          tdClass: 'vgt-right-align',
        },
      ],
      currentPage: 1,
      visibleItemsPerPageCount: 10,
      confirmModal: {
        showing: false,
        message: '',
        event: '',
      },
    };
  },
  computed: {
    ...mapGetters(['allReferralPartners', 'referralPartnerById', 'allLoanOfficers']),
    ...mapState(['referralPartners']),
    pageCount() {
      if (this.totalRows > 0) {
        return Math.ceil(this.totalRows / this.visibleItemsPerPageCount);
      }
      return 0;
    },
    totalRows() {
      return this.referralPartners.referralPartners.length;
    },
    displayedRows: {
      get() {
        const max = this.currentPage * this.visibleItemsPerPageCount;
        const baseRps = JSON.parse(JSON.stringify([...this.allReferralPartners]));
        const sortedRps = this.sortReferralPartners(this.activeSort, baseRps);
        const slicedRps = this.referralPartnersByRange(
          max - this.visibleItemsPerPageCount,
          max,
          sortedRps,
        );
        return slicedRps;
      },
      set() {},
    },
  },
  methods: {
    ...mapActions([
      'updateReferralPartners',
      'fetchLoanOfficers',
      'editReferralPartner',
      'deleteReferralPartner',
    ]),
    handlePageChange(value) {
      switch (value) {
        case 'next':
          if (this.currentPage + 1 <= this.pageCount) {
            this.currentPage += 1;
          }
          break;
        case 'previous':
          if (this.currentPage - 1 >= 1) {
            this.currentPage -= 1;
          }
          break;
        default:
          this.currentPage = value;
      }
    },
    openEditModal(row) {
      this.selectedRP = this.referralPartnerById(row.id);
      this.editModalShowing = true;
    },
    formatLoanOfficerArray(rowObj) {
      return rowObj.fullName;
    },
    formatName(rowObj) {
      const delimiter = rowObj.lastName !== '' && rowObj.firstName !== '' ? ', ' : '';
      return `${rowObj.lastName}${delimiter}${rowObj.firstName} `;
    },
    formatDate(value) {
      return value ? moment(value).format('MM/DD/YYYY') : '';
    },
    formatIsSubscribed(rowObj) {
      return rowObj == 1 ? 'Yes' : 'No';
    },
    isSubscribedColor(rowObj) {
      return rowObj.isSubscribed == 1 ? '--subscribed' : '';
    },
    openConfirmModal(event, message) {
      this.confirmModal.event = event;
      this.confirmModal.message = message;
      this.confirmModal.showing = true;
    },
    handleConfirmModalEvent(confirmed) {
      if (confirmed) {
        switch (this.confirmModal.event) {
          case 'cancel':
            this.$emit('close');
            break;
          case 'unsubscribe':
            this.selectedRP.isSubscribed = 0;
            this.editReferralPartner(this.selectedRP);
            this.confirmModal.showing = false;
            break;
          case 'delete':
            this.deleteReferralPartner({
              employeeId: this.selectedRP.employee.employeeNumber,
              referralPartnerId: this.selectedRP.id,
            });
            this.confirmModal.showing = false;
            break;
          default:
            return;
        }
      }
      this.confirmModal.message = '';
      this.confirmModal.showing = false;
    },
    onDeleteReferralPartner(id) {
      this.selectedRP = JSON.parse(JSON.stringify({ ...this.referralPartnerById(id) }));
      this.openConfirmModal('delete', 'Deleting a referral partner is permananent. Are you sure?');
    },
    referralPartnersByRange(start, end, rps) {
      return rps.slice(start, end);
    },
    rowStyleClass() {
      return 'VGT-row';
    },
    async searchData() {
      const employees = this.loanOfficerQuery.map((lo) => String(lo.employeeNumber));
      const employeeString = employees.join(',');
      const payload = {
        searchQuery: this.searchQuery,
        employees: employeeString,
      };
      await this.updateReferralPartners(payload);
    },
    sortReferralPartners(column, rps) {
      switch (column) {
        case 'Company': {
          const results = rps.sort((a, b) => (String(a.company).toLowerCase() > String(b.company).toLowerCase() ? 1 : -1));
          return results;
        }
        case 'Name': {
          const results = rps.sort((a, b) => (String(a.lastName).toLowerCase() > String(b.lastName).toLowerCase() ? 1 : -1));
          return results;
        }
        case 'Email': {
          const results = rps.sort((a, b) => (String(a.email).toLowerCase() > String(b.email).toLowerCase() ? 1 : -1));
          return results;
        }
        case 'Loan Officers': {
          const results = rps.sort((a, b) => (String(a.employees[0].fullName).toLowerCase()
            > String(b.employees[0].fullName).toLowerCase()
            ? 1
            : -1));
          return results;
        }
        default: {
          return [];
        }
      }
    },
    sortTableData(column) {
      this.activeSort = column;
    },
    unsubscribe(id) {
      this.selectedRP = JSON.parse(JSON.stringify({ ...this.referralPartnerById(id) }));
      this.openConfirmModal('unsubscribe', 'Unsubscribing will be permanent. Are you sure?');
    },
  },
  mounted() {
    this.fetchLoanOfficers();
  },
};
</script>

<style lang="scss" scoped>
.rp-mgmt {
  padding: $standard-view;
    .heading {
        font-weight: 800;
    }
  .resultsTable {
    .btn.--unsubscribe {
      display: inline-block;
      text-align: center;
      font-size: 1.1rem;
      margin-left: 1rem;
      padding: 0.25rem 1rem;
        font-weight: 700;
        font-family: 'Nunito Sans', sans-serif;
    }
    .deleteRp {
      color: $red;
      font-size: 2rem;
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
.utilityBar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 4rem 0 2rem;

  .multiselect {
    margin-right: 3rem;
    width: 20rem;
  }
  .search {
    position: relative;
    width: 20rem;
    .icon {
      position: absolute;
      top: 50%;
      left: 5px;
      transform: translateY(-50%);
      color: $gray;
    }
    ::v-deep .textInput {
      padding-left: 3rem;
    }
  }
  button {
    margin-left: 2rem;
    height: 2.6rem;
      font-family: 'Nunito Sans', sans-serif;
      font-weight: 700;
    &:hover {
      background-color: $orange;
      color: #fff;
    }
  }
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 4rem;
}

@include slideDownEnter("addEditRpModal", 35%, 50%);
</style>
