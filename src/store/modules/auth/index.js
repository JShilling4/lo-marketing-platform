import api from '@/store/api';
import { handleApiError } from '@/store/helpers';
// import router from '@/router';

export default {
  state: {
    status: '',
    tokenExpiry: null,
    startingSessionTime: null,
  },

  mutations: {
    AUTH_REQUEST(state) {
      state.status = 'loading';
    },
    AUTH_SUCCESS(state) {
      state.status = 'success';
    },
    AUTH_ERROR(state) {
      state.status = 'error';
    },
    AUTH_PENDING(state) {
      state.status = '';
    },
    SET_TOKEN_EXPIRY(state) {
      state.tokenExpiry = localStorage.getItem('mv3')
        ? new Date(JSON.parse(localStorage.getItem('mv3')).tokenExpiration)
        : null;
    },
  },

  actions: {
    logIn: ({ commit, dispatch }, user) => {
      commit('AUTH_REQUEST');
      return api.auth
        .login(user)
        .then((response) => {
          const { data } = response.data;
          const sessionData = data.marketingV1Login;
          sessionData.username = user.username;
          localStorage.setItem('mv3', JSON.stringify(sessionData)); // store the activeUser in localstorage
          // token exists, get user data
          dispatch('setActiveUser', sessionData);
          // update the token expiration & restart timer
          dispatch('startSession');
          commit('AUTH_SUCCESS');
          return response;
        })
        .catch((error) => {
          handleApiError(error);
          return error.response;
        });
    },

    logInWithToken: ({ commit, dispatch }, token) => {
      commit('AUTH_REQUEST');
      return api.auth
        .loginWithToken(token)
        .then((response) => {
          const { data } = response.data;
          const sessionData = data.marketingV1ValidateToken;
          const dt = new Date();
          dt.setHours(dt.getHours() + 2);
          sessionData.tokenExpiration = dt;
          localStorage.setItem('mv3', JSON.stringify(sessionData)); // store the activeUser in localstorage
          dispatch('setActiveUser', sessionData); // token exists, get user data
          dispatch('startSession'); // update the token expiration & restart timer
          commit('AUTH_SUCCESS');
          return response;
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    validateToken: ({ commit }) => api.auth
      .validateToken(JSON.parse(localStorage.getItem('mv3')).token)
      .then((response) => {
        if (response.status === 200) {
          commit('AUTH_SUCCESS');
        }
        return response;
      })
      .catch((error) => {
        handleApiError(error);
      }),

    startSession: ({ commit }) => {
      commit('SET_TOKEN_EXPIRY');
    },

    getMobileHandoffRoute: ({ commit }, sourceApp) => api.auth
      .getMobileHandoffRoute(sourceApp)
      .then((response) => {
        const { data } = response.data;
        return data.marketingV1GetMobileHandoffRoute.target;
      })
      .catch((error) => {
        handleApiError(error);
        return null;
      }),
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    authStatus: (state) => state.status,
    userRole: (state) => state.role,
  },
};
