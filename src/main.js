/* eslint-disable no-extend-native */
import Vue from "vue";
import router from "@/router";
import store from "@/store";
import App from "@/App.vue";

// plugins
import VueRouter from "vue-router";
import Toasted from "vue-toasted";
import CKEditor from "@ckeditor/ckeditor5-vue";
import VueSocketIO from "vue-socket.io";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, image, email, regex } from "vee-validate/dist/rules";
import { socketServer } from "./env";
import ChatScroll from "./directives/chat-scroll";

// Install components globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

// Install plugins globally
Vue.use(
    new VueSocketIO({
        connection: socketServer // options object is Optional
    })
);
Vue.use(VueRouter);

Vue.use(CKEditor);

Vue.use(Toasted, {
    iconPack: "custom-class",
    position: "top-center",
    duration: 10000,
    keepOnHover: true,
    theme: "bubble",
    action: {
        text: "Close",
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    },
    icon: {
        name: "far fa-check-circle"
    }
});
const errorConfig = {
    duration: null,
    type: "error",
    action: {
        text: "Close",
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    },
    icon: {
        name: "fas fa-exclamation-triangle"
    }
};
Vue.toasted.register(
    "fetch_error",
    payload => {
        // if there is no message passed show default message
        if (!payload.message) {
            return "Oops.. Something Went Wrong..";
        }

        // if there is a message show it with the message
        return `Oops.. ${payload.message}`;
    },
    errorConfig
);

// Custom global directives
Vue.directive("focus", {
    // When the bound element is inserted into the DOM...
    inserted(el) {
        // Focus the element
        el.focus();
    }
});
Vue.directive("chat-scroll", ChatScroll);

// validation rules
extend("required", {
    ...required,
    message: "This field is required."
});
extend("image", {
    ...image,
    message: "This file must be an image."
});
extend("email", {
    ...email,
    message: "Please use a valid email format."
});
extend("regex", {
    ...regex,
    message: "There are invalid characters present for this field."
});
extend("password", {
    params: ["target"],
    validate(value, { target }) {
        return value === target;
    },
    message: "Password confirmation does not match"
});

// Vue instance init
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
