<template>
    <div class="templateMgmt">
        <h1 class="heading">Template Management</h1>
        <!-- Utility Bar -->
        <div class="utilityBar">
            <div class="form-group">
                <label for="">Edit Template</label>
                <div class="multiselect-wrapper">
                    <multi-select
                        v-model="selectedTemplate"
                        track-by="id"
                        label="name"
                        placeholder="Select Template"
                        selectLabel=""
                        deselectLabel=""
                        selectedLabel=""
                        :preserve-search="true"
                        :options="templates.baseTemplates"
                        @select="editTemplate"
                    >
                    </multi-select>
                </div>
            </div>
            <div>
                <app-button classes="btn btn-orange" @click.native="createTemplate" text="New Template" />
                <app-button classes="btn btn-blue" @click.native="changeView" text="Emails" />
            </div>
        </div>

        <add-edit-template
            v-if="addEditTemplateShowing"
            :selected-template="selectedTemplate"
            @close="resetAddEdit"
        />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import Multiselect from 'vue-multiselect';
import AddEditTemplate from '@/views/admin/emailManagement/AddEditTemplate';

export default {
    name: 'TemplateManagement',
    components: {
        'multi-select': Multiselect,
        'add-edit-template': AddEditTemplate,
        'app-button': () => import('@/components/Shared/AppButton'),
    },
    data() {
        return {
            addEditTemplateShowing: false,
            selectedTemplate: undefined,
            action: '',
        };
    },
    computed: {
        ...mapState(['templates']),
        ...mapGetters(['baseTemplateById']),
    },
    methods: {
        ...mapActions(['updateEmails', 'updateTemplates', 'reserveBatchId', 'fetchLoanOfficers']),
        editTemplate() {
            this.action = 'edit';
            this.addEditTemplateShowing = true;
            this.$router.push('/admin/email-management/template-management');
        },
        createTemplate() {
            this.addEditTemplateShowing = false;
            this.selectedTemplate = undefined;
            this.action = 'add';
            this.addEditTemplateShowing = true;
            this.$router.push('/admin/email-management/template-management');
        },
        resetAddEdit() {
            this.selectedTemplate = undefined;
            this.addEditTemplateShowing = false;
            this.$router.push('/admin/email-management/template-management');
        },
        changeView() {
            this.$router.push('/admin/email-management');
        },
    },
    mounted() {
        this.updateEmails(); // vuex action that brings in all email data
        this.updateTemplates();
        this.fetchLoanOfficers();
    },
};
</script>

<style lang="scss" scoped>
.templateMgmt {
    padding: 4rem 12rem;
    .heading {
        font-weight: 800;
    }
    .resultsTable {
        .status {
            display: inline-block;
            width: 10rem;
            text-align: center;
        }
    }
    .multiselect-wrapper {
        width: 20rem;
    }
}
.utilityBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 3rem 0 1.5rem;
    button {
        margin-left: 1rem;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
    label {
        font-weight: 700;
    }
}

.resultsTable {
    .tableIcon {
        filter: grayscale(1);
        cursor: pointer;
        &:hover {
            filter: grayscale(0);
        }
        &--duplicate {
            height: 28px;
        }
        &--edit {
            height: 25px;
        }
    }
    ::v-deep .vgt-responsive {
        table.vgt-table {
            td {
                font-weight: 600;
            }
        }
    }
}
</style>

<style lang="scss">
.emailMgmt {
    .resultsTable {
        .vgt-global-search {
            left: 0;
            right: unset;
        }
    }
}
</style>
