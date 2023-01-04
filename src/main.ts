/**
 * Vue3 Main script
 */

// Load vue core
import { createApp } from "vue";
import router from "./router";
import store from "./store";
import "./assets/scss/main.scss";

// Load Vuetify
import vuetify from "./plugins/vuetify";

// Load Layout vue.
import App from "./App.vue";

/** Register Vue */
const app = createApp(App);
app.use(router);
app.use(store);
app.use(vuetify);

app.mount("#app");
// // Run!
// router.isReady().then(() => {
//   app.mount("#app");
// });
