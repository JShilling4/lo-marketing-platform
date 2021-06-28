import Vue from 'vue';

export default {
  state: {
    ideas: [
      {
        id: '12124',
        employee: {
          employeeNumber: 1539,
          fullName: 'Justin Shilling',
          email: 'justin.shilling@ruoff.com',
        },
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et eum laboriosam voluptatum eaque. Amet reprehenderit pariatur nemo quia vel placeat nobis modi? Quos quasi excepturi deleniti eligendi officia nesciunt voluptatibus.',
        datetime: '2019-10-07T11:25:30',
        comments: [
          {
            id: '00123',
            employee: {
              employeeNumber: 1539,
              fullName: 'Justin Shilling',
              email: 'justin.shilling@ruoff.com',
            },
            datetime: '2019-10-04T11:25:30',
            filepath: null,
            comment: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio, quae. Culpa cum incidunt nisi!.',

          },
        ],
      },
      {
        id: '12125',
        employee: {
          employeeNumber: 1539,
          fullName: 'Justin Shilling',
          email: 'justin.shilling@ruoff.com',
        },
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et eum laboriosam voluptatum eaque. Amet reprehenderit pariatur nemo quia vel placeat nobis modi? Quos quasi excepturi deleniti eligendi officia nesciunt voluptatibus.',
        datetime: '2019-09-19T13:45:30',
        comments: [
          {
            id: '00124',
            employee: {
              employeeNumber: 1539,
              fullName: 'Justin Shilling',
              email: 'justin.shilling@ruoff.com',
            },
            datetime: '2019-10-05T11:25:30',
            filepath: null,
            comment: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio, quae. Culpa cum incidunt nisi!. Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
          },
        ],
      },
      {
        id: '12126',
        employee: {
          employeeNumber: 1539,
          fullName: 'Justin Shilling',
          email: 'justin.shilling@ruoff.com',
        },
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et eum laboriosam voluptatum eaque. Amet reprehenderit pariatur nemo quia vel placeat nobis modi?',
        datetime: '2019-10-04T13:45:30',
        comments: [
          {
            id: '00125',
            employee: {
              employeeNumber: 1539,
              fullName: 'Justin Shilling',
              email: 'justin.shilling@ruoff.com',
            },
            datetime: '2019-10-04T11:25:30',
            filepath: null,
            comment: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio, quae. Culpa cum incidunt nisi!.',
          },
        ],
      },
    ],
  },

  mutations: {
    ADD_IDEA(state, idea) {
      Vue.set(state.ideas, idea.id, idea);
    },
    ADD_COMMENT_TO_IDEA(state, payload) {
      const { ideaIndex, comment } = payload;
      state.ideas[ideaIndex].comments.push(comment); // update comment list inside of idea
    },
  },

  actions: {
    addIdea({ commit }, idea) {
      commit('ADD_IDEA', idea);
    },
    addCommentToIdea({ commit, state }, payload) {
      const { ideaId, comment } = payload;
      const ideaIndex = state.ideas.findIndex((idea) => idea.id == ideaId);
      commit('ADD_COMMENT_TO_IDEA', { ideaIndex, comment });
    },
  },

  getters: {
    // eslint-disable-next-line no-shadow
    allIdeas: (state) => state.ideas,
    ideaCommentsById: (state) => (ideaId) => state.ideas[ideaId].comments.map((comment) => state.comments[comment]),
  },
};
