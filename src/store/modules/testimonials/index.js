import Vue from 'vue';

export default {
  state: {
    testimonials: [
      {
        id: '1',
        loanOfficer: {
          employeeNumber: '1539',
          fullName: 'Justin Shilling',
        },
        createdDatetime: '01/01/2020',
        reviewerName: 'John S',
        review: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum ea ratione provident iusto dolorem nihil eum illo modi fugit molestias, maiores error quidem fugiat inventore. Iure animi blanditiis repellat et.',
        reviewType: 'Client',
        isApproved: 'true',
        addToWebsite: 'Yes',
      },
      {
        id: '2',
        loanOfficer: {
          employeeNumber: '1040',
          fullName: 'Matt Edholm',
        },
        createdDatetime: '01/03/2020',
        reviewerName: 'Amber T',
        review: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum ea ratione provident iusto dolorem nihil eum illo.',
        reviewType: 'RP',
        isApproved: 'false',
        addToWebsite: 'No',
      },
    ],
  },

  mutations: {

  },

  actions: {

  },

  getters: {
    allTestimonials: (state) => state.testimonials,
  },
};
