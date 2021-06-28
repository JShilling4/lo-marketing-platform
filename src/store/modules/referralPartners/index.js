import Vue from 'vue';
import api from '@/store/api';
import { handleApiError } from '@/store/helpers';

export default {
  state: {
    referralPartners: [],
  },

  mutations: {
    UPDATE_RPS(state, rps) {
      Vue.set(state, 'referralPartners', [...rps]);
    },

    EDIT_RP(state, updatedRp) {
      // state.referralPartners.splice(payload.index, 0, payload.data);
      state.referralPartners = [
        ...state.referralPartners.map((item) => (item.id !== updatedRp.id ? item : { ...item, ...updatedRp })),
      ];
    },

    CREATE_RP(state, rp) {
      state.referralPartners.push(rp);
    },

    DELETE_RP(state, index) {
      state.referralPartners.splice(index, 1);
    },

    SORT_RPS(state, payload) {
      Vue.set(state, 'referralPartners', [...payload]);
    },
  },

  actions: {
    updateReferralPartners: ({ commit }, payload) => {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.referralPartners
        .fetchReferralPartners(payload.searchQuery, payload.employees)
        .then((response) => {
          const { data } = response.data;
          if (response.status == '200') {
            commit('UPDATE_RPS', data.marketingV1GetReferralPartners);
          }
          commit('SET_LOADING', false, { root: true }); // close loading spinner
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    editReferralPartner: ({ commit }, data) => {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      api.referralPartners
        .manageReferralPartner(data)
        .then((response) => {
          // if create email successful, commit to store
          if (response.status == '200') {
            commit('EDIT_RP', response.data);
            Vue.toasted.success('Referral Partner successfully edited!');
          }
          commit('SET_LOADING', false, { root: true });
          return response;
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    deleteReferralPartner: ({ commit, state }, payload) => {
      const { referralPartnerId } = payload;
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      api.referralPartners
        .deleteReferralPartner(payload)
        .then((resp) => {
          if (resp.status == '200') {
            const index = state.referralPartners.findIndex((rp) => rp.id == referralPartnerId);
            commit('DELETE_RP', index);
            Vue.toasted.success('Referral Partner successfully deleted.');
          } else {
            commit('SET_LOADING', false, { root: true });
          }
          commit('SET_LOADING', false, { root: true }); // close loading spinner
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    createReferralPartners: ({ commit }, data) => {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      api.referralPartners
        .uploadReferralPartners(data)
        .then((response) => {
          // if create email successful, commit to store
          if (response.status == '200') {
            Vue.toasted.success(
              'CSV successfully loaded. Depending on the size, it may take some time. \nYou will receive an email with any errors and you can check back here at that time to see your new additions.',
            );
          }
          commit('SET_LOADING', false, { root: true });
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    createReferralPartner: ({ commit }, data) => {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.referralPartners
        .createReferralPartner(data)
        .then((response) => {
          if (response.status == '200') {
            // api.referralPartners
            //   .fetchReferralPartners('', data.employee.employeeNumber)
            //   .then((response2) => {
            //     if (response2.status == '200') {
            //       commit('UPDATE_RPS', response2.data.data.marketingV1GetReferralPartners);
            //     }
            //   });
            Vue.toasted.success('Referral partner successfully created!');
          }
          commit('SET_LOADING', false, { root: true });
        })
        .catch((error) => {
          handleApiError(error);
        });
    },
  },

  getters: {
    allReferralPartners: (state) => state.referralPartners,

    referralPartnerById: (state) => (id) => state.referralPartners.find((rp) => rp.id == id),

    referralPartnersByEmployeeNumber: (state) => (employeeNumber) => {
      const rpArr = [];
      state.referralPartners.forEach((rp) => {
        if (rp.employees.some((emp) => emp.employeeNumber == employeeNumber)) {
          rpArr.push(rp);
        }
      });
      return rpArr;
    },
  },
};
