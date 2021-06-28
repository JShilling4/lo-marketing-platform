import Vue from 'vue';
import api from '@/store/api';
import { handleApiError } from '@/store/helpers';

export default {
  state: {
    magazines: [],
  },

  mutations: {
    CREATE_MAGAZINE(state, magazine) {
      state.magazines.push(magazine);
    },
    EDIT_MAGAZINE(state, payload) {
      const { magazineIndex, magazine } = payload;
      state.magazines.splice(magazineIndex, 1, magazine);
    },
    UPDATE_MAGAZINES(state, magazines) {
      state.magazines = magazines;
    },
  },

  actions: {
    updateMagazines({ commit }) {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.magazines.fetchMagazines()
        .then((response) => {
          if (response.status == '200') {
            const { data } = response.data;
            commit('UPDATE_MAGAZINES', data.marketingV1GetMagazine);
          }
          commit('SET_LOADING', false, { root: true });
        })
        .catch(() => {
          // console.log(error);
        });
    },
    manageMagazine: ({ commit, dispatch, state }, data) => {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.magazines
        .manageMagazine(data)
        .then((response) => {
          let magazineIndex;
          if (response.status == '200') {
            magazineIndex = state.magazines.findIndex((magazine) => magazine.id == response.data.id);
            if (magazineIndex == -1) {
              // magazine doesnt exist, create it
              commit('CREATE_MAGAZINE', response.data);
              dispatch('magazines_cacheBuster');
              Vue.toasted.success('Magazine successfully created!');
            } else {
              // magazine exists, update it
              commit('EDIT_MAGAZINE', { magazine: response.data, magazineIndex });
              dispatch('magazines_cacheBuster');
              Vue.toasted.success('Magazine successfully saved!');
            }
          }
          commit('SET_LOADING', false, { root: true });
          return { response, magazineIndex };
        })
        .catch((error) => {
          handleApiError(error);
        });
    },
    magazines_cacheBuster: () => {
      api.magazines.cacheBuster();
    },
  },

  getters: {
    allMagazines: (state) => state.magazines,
    magazineById: (state) => (id) => state.magazines.find((magazine) => magazine.id == id),
  },
};
