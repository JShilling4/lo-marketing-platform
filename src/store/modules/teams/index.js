import api from '@/store/api';
import Vue from 'vue';
import { handleApiError } from '@/store/helpers';

export default {
  state: {
    teams: [],
  },

  mutations: {
    CREATE_TEAM(state, team) {
      state.teams.push(team);
    },
    EDIT_TEAM(state, payload) {
      const { teamIndex, team } = payload;
      state.teams.splice(teamIndex, 1, team);
    },
    UPDATE_TEAMS(state, teams) {
      state.teams = teams;
    },
  },

  actions: {
    updateTeams({ commit }) {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.teams.fetchTeams()
        .then((response) => {
          if (response.status == '200') {
            const { data } = response.data;
            commit('UPDATE_TEAMS', data.marketingV1GetTeam);
          }
          commit('SET_LOADING', false, { root: true });
        })
        .catch(() => {
          // console.log(error);
        });
    },
    manageTeam: ({ commit, dispatch, state }, data) => {
      commit('SET_LOADING', true, { root: true }); // start loading spinner
      return api.teams
        .manageTeam(data)
        .then((response) => {
          let teamIndex;
          if (response.status == '200') {
            teamIndex = state.teams.findIndex((team) => team.id == response.data.id);
            if (teamIndex == -1) {
              // team doesnt exist, create it
              commit('CREATE_TEAM', response.data);
              dispatch('teams_cacheBuster');
              Vue.toasted.success('Team successfully created!');
            } else {
              // team exists, update it
              commit('EDIT_TEAM', { team: response.data, teamIndex });
              dispatch('teams_cacheBuster');
              Vue.toasted.success('Team successfully saved!');
            }
          }
          commit('SET_LOADING', false, { root: true });
          return { response, teamIndex };
        })
        .catch((error) => {
          handleApiError(error);
        });
    },
    teams_cacheBuster: () => {
      api.teams.cacheBuster();
    },
  },

  getters: {
    teamById: (state) => (id) => state.teams.find((team) => team.id == id),
  },
};
