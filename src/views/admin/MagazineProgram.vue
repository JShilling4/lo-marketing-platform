<template>
  <div class="magazineProgs">
    <h1 class="heading">Magazine Gift Program</h1>

    <div class="utilityBar">
      <app-button classes="btn btn-orange" @click.native="addMagazine" text="Add Magazine" />
    </div>
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
            mode: 'pages',
            perPage: 5
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

            <span v-else-if="props.column.field === 'isActive'">
              {{ props.row.isActive === 1 ? "Active" : "Inactive" }}
            </span>

            <!-- Edit -->
            <span v-else-if="props.column.field === 'edit'">
              <app-button
                classes="btn btn-orange"
                @click.native="editMagazine(props.row.id)"
                text="Edit"
              />
            </span>

            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
          </template>
        </vue-good-table>

        <app-button
          v-if="authorizedToExport"
          classes="btn btn-orange exportBtn"
          text="Export List"
          @click.native="exportList"
        />
      </div>
    </transition>

    <!-- Moddal -->
    <transition name="modal">
      <add-edit-magazine
        v-if="addEditShowing"
        :item="selectedItem"
        :action="action"
        @close="addEditShowing = false"
      />
    </transition>
  </div>
</template>

<script>
// dependencies
import Vue from 'vue';
import {
  mapGetters, mapActions, mapState, mapMutations,
} from 'vuex';
import api from '@/store/api';
import { handleApiError } from '@/store/helpers';
// components
import VueGoodTable from '@/components/Shared/Table/Table';
import AddEditMagazine from '@/components/Admin/AddEditMagazine';

export default {
  name: 'MagazineProgram',
  components: {
    'vue-good-table': VueGoodTable,
    'add-edit-magazine': AddEditMagazine,
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  data() {
    return {
      addEditShowing: false,
      action: '',
      selectedItem: undefined,
      tableColumns: [
        {
          label: 'Image',
          field: 'image',
          width: '200px',
        },
        {
          label: 'Title',
          field: 'title',
          width: '350px',
        },
        {
          label: 'Description',
          field: 'description',
        },
        {
          label: 'Status',
          field: 'isActive',
          type: 'number',
          width: '150px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
        },
        {
          label: '',
          field: 'edit',
          width: '150px',
          thClass: 'vgt-right-align',
          tdClass: 'vgt-right-align',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['magazineById']),
    ...mapState(['magazines', 'users']),
    activeUser() {
      return this.users.activeUser;
    },
    authorizedToExport() {
      try {
        return this.users.activeUser.userRoles.includes('ROLE_MARKETING_ADMIN')
        || this.users.activeUser.userRoles.includes('ROLE_IT');
      } catch (error) {
        /* shhhh */
      }
      return false;
    },
  },
  methods: {
    ...mapActions(['updateMagazines']),
    ...mapMutations(['SET_LOADING']),
    editMagazine(id) {
      this.selectedItem = this.magazineById(id);
      this.action = 'edit';
      this.addEditShowing = true;
    },
    addMagazine() {
      this.selectedItem = undefined;
      this.action = 'add';
      this.addEditShowing = true;
    },
    exportList() {
      this.SET_LOADING(true, { root: true }); // start loading spinner
      api.magazines
        .exportMGP()
        .then((response) => {
          const { data } = response;

          if (data.file == null) {
            Vue.toasted.success(data.message);
          } else {
            const link = document.createElement('a');
            link.href = data.file;
            link.download = 'mgp-export.csv';
            link.click();
            Vue.toasted.success('MGP export successful. CSV is downloading.');
          }
          this.SET_LOADING(false, { root: true }); // stop loading spinner
        })
        .catch((error) => {
          handleApiError(error);
        });
    },
  },

  created() {
    this.updateMagazines();
  },
};
</script>

<style lang="scss" scoped>
.magazineProgs {
  padding: $standard-view;
    h1.heading {
        font-weight: 800;
    }
  .resultsTable {
    .vgt-global-search {
      left: 0;
      right: unset;
    }
    ::v-deep .vgt-center-align {
      text-align: center !important;
    }
      ::v-deep .vgt-left-align {
          .btn {
              font-family: 'Nunito Sans', sans-serif;
              font-weight: 700;
          }
      }
    .status {
      display: inline-block;
      width: 9rem;
      text-align: center;
    }
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
.utilityBar {
  display: flex;
  justify-content: flex-end;
  margin: 5rem 0 1rem;
  .search {
    position: relative;
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
  button {
      font-family: 'Nunito Sans', sans-serif;
      font-weight: 700;
    &:hover {
      background-color: $orange;
      color: #fff;
    }
  }
}
.exportBtn {
  margin-top: 2rem;
}
</style>
