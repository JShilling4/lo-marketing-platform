import Vue from 'vue';
import api from '@/store/api';
import { handleApiError } from '@/store/helpers';

export default {
  state: {
    cobrandInvoices: [],
  },

  mutations: {
    CREATE_INVOICE(state, invoice) {
      state.cobrandInvoices.push(invoice);
    },
    EDIT_INVOICE(state, payload) {
      const { invoiceIndex, invoice } = payload;
      state.cobrandInvoices.splice(invoiceIndex, 1, invoice);
    },
    UPDATE_INVOICES(state, invoices) {
      state.cobrandInvoices = invoices;
    },
  },

  actions: {
    fetchInvoices({ commit }) {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.cobrand.fetchCobrandInvoices()
        .then((response) => {
          if (response.status == '200') {
            const { data } = response.data;
            commit('UPDATE_INVOICES', data.marketingV1GetCobrandInvoices);
          }
          commit('SET_LOADING', false, { root: true });
        })
        .catch(() => {
          // console.log(error);
        });
    },
    manageInvoice({ commit, state }, data) {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.cobrand
        .manageCobrandInvoice(data)
        .then((response) => {
          let invoiceIndex;
          if (response.status == '200') {
            invoiceIndex = state.cobrandInvoices.findIndex((invoice) => invoice.id == response.data.id);
            if (invoiceIndex == -1) {
              // magazine doesnt exist, create it
              commit('CREATE_INVOICE', response.data);
              // dispatch('invoices_cacheBuster');
              Vue.toasted.success('Invoice successfully created!');
            } else {
              // magazine exists, update it
              commit('EDIT_INVOICE', { invoice: response.data, invoiceIndex });
              // dispatch('invoices_cacheBuster');
              Vue.toasted.success('Invoice successfully edited!');
            }
          }
          commit('SET_LOADING', false, { root: true });
          return { response, invoiceIndex };
        })
        .catch((error) => {
          const message = error.response.data.length > 0 ? error.response.data[0] : error;
          handleApiError(error, message);
        });
    },
    cobrandInvoice_cacheBuster: () => {
      api.magazines.cacheBuster();
    },
  },

  getters: {
    allInvoices: (state) => state.cobrandInvoices,
    invoiceById: (state) => (id) => state.cobrandInvoices.find((invoice) => invoice.id == id),
  },
};
