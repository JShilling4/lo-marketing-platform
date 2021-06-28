<template>
  <div class="testimonial-mgmt">
    <h1 class="heading">Testimonial Management</h1>

    <div class="search">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Search" ref="searchInput" @keyup="searchTable"/>
    </div>

    <div class="chipBar">
      <i class="fas fa-tag tagIcon"></i>
    </div>

    <div class="utilityBar"></div>

    <transition name="fadeInOut" appear>
      <div class="resultsTable">
        <vue-good-table
          :columns="tableColumns"
          :rows="allTestimonials"
          styleClass="vgt-table"
          :search-options="{
            enabled: true,
            externalQuery: searchString
          }"
          :pagination-options="{
            enabled: true,
            mode: 'pages'
          }"
          :sort-options="{
            enabled: true,
            initialSortBy: { field: 'createdDatetime', type: 'asc' }
          }"
        >
          <!-- Dynamic table rows -->
          <template slot="table-row" slot-scope="props">
            <!-- Graphic -->
            <span v-if="props.column.field == 'graphic'">
              <app-button classes="btn btn-orange" text="Make Graphic" />
            </span>

            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
          </template>
        </vue-good-table>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VueGoodTable from '@/components/Shared/Table/Table';

export default {
  name: 'TestimonialManagement',
  components: {
    'vue-good-table': VueGoodTable,
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  data() {
    return {
      tableColumns: [
        {
          label: 'Website',
          field: 'addToWebsite',
          width: '150px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
          sortable: false,
        },
        {
          label: 'Date',
          field: 'createdDatetime',
          width: '150px',
        },
        {
          label: 'Reviewer',
          field: 'reviewerName',
          width: '250px',
        },
        {
          label: 'Type',
          field: 'reviewType',
          width: '125px',
        },
        {
          label: 'Review',
          field: 'review',
          sortable: false,
        },
        {
          label: 'Social Media',
          field: 'graphic',
          sortable: false,
          width: '200px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
        },
      ],
      searchString: '',
    };
  },
  computed: {
    ...mapGetters(['allTestimonials']),
  },
  methods: {
    // ...mapActions(['']),
    searchTable() {
      this.searchString = this.$refs.searchInput.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.testimonial-mgmt {
  padding: $standard-view;
  .topicIcon {
    color: $gray;
  }
  .heading {
    margin-bottom: 4rem;
  }
  .resultsTable {
    margin-top: 6rem;
  }
  .search {
    position: relative;
    margin: 2rem 0 2rem;
    input {
      height: 2.5rem;
      width: 35rem;
      padding: 0 0.5rem 0 2.5rem;
      border-radius: 5rem;
      border: 1px solid $gray;
      &:focus,
      &:active {
        outline: none;
      }
    }
    .fa-search {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      color: $gray;
    }
  }
}
</style>
