/* eslint-disable global-require */

export default {
    state: {
        loResources: [
            {
                id: 1,
                subject: "HubSpot for Leads & Clients",
                imagePath: require("@/assets/images/resources/hubspotLeadsClients.jpg"),
                description:
                    "We've supplied you with a new holiday graphic for Instagram, Facebook, and Linked In.",
                ctaText: "Log In",
                targetUrl: "https://app.hubspot.com/login"
            },
            {
                id: 2,
                subject: "The Porch Blog",
                imagePath: require("@/assets/images/resources/porchBlog.jpg"),
                description: "",
                ctaText: "See Blog",
                targetUrl: "https://blog.ruoff.com/"
            },
            {
                id: 3,
                subject: "FunnelAmplified",
                imagePath: require("@/assets/images/resources/funnelAmplified.jpg"),
                description: "",
                ctaText: "Sign Up",
                targetUrl: "https://landing.ruoff.com/hubfs/FunnelAmplified.pdf"
            },
            {
                id: 4,
                subject: "Manage Your Testimonials",
                imagePath: require("@/assets/images/resources/manageYourTestimonials.jpg"),
                description: "",
                ctaText: "See Testimonials",
                targetUrl: "https://insight.ruoff.com/Testimonials"
            }
        ],

        loTraining: [
            {
                id: 101,
                subject: "Facebook for LOs Guide",
                imagePath: require("@/assets/images/resources/facebookLoGuide.jpg"),
                description: "",
                ctaText: "Download Now",
                targetUrl: "https://landing.ruoff.com/hubfs/Facebook%20for%20LOs_E-book_2021.pdf"
            },
            {
                id: 102,
                subject: "HubSpot Training Guide",
                imagePath: require("@/assets/images/resources/hubspotTrainingGuide.jpg"),
                description: "",
                ctaText: "Download Now",
                targetUrl: "https://landing.ruoff.com/hubfs/HubSpot%20Updated%20Guide%202019.pdf"
            },
            {
                id: 103,
                subject: "How to Start a Facebook Business Page",
                imagePath: require("@/assets/images/resources/facebookBusinessPage.jpg"),
                description: "",
                ctaText: "Download Now",
                targetUrl: "https://landing.ruoff.com/hubfs/Facebook%20Business%20Page.pdf"
            },
            {
                id: 104,
                subject: "Content Marketing Powerpoint",
                imagePath: require("@/assets/images/resources/digitalMarketingTrainingPowerPoint.jpg"),
                description: "",
                ctaText: "Download Now",
                targetUrl:
                    "https://landing.ruoff.com/hubfs/Content%20Marketing%20Training%20(2).pptx"
            }
        ]
    },

    mutations: {},

    actions: {},

    getters: {
        allResources: state => state.resources
    }
};
