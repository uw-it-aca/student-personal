import { createBootstrap } from "bootstrap-vue-next";
import { createPinia } from "pinia";
import { createApp } from "vue";
// import VueGtag from "vue-gtag-next";
import { Vue3Mq } from "vue3-mq";

import App from "@/app.vue";
import router from "@/router";
import { useContextStore } from "@/stores/context";

// bootstrap js + bootstrap-icons
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

// solstice bootstrap theme
import "solstice-theme/dist/solstice.scss";

// solstice-vue comps
import "solstice-vue/dist/style.css";

// bootstrap-vue-next css
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

// microsoft clarity
import Clarity from "@microsoft/clarity";

const app = createApp(App);
app.config.productionTip = false;

app.config.globalProperties.window = window;
app.config.globalProperties.gettext = window.gettext;
app.config.globalProperties.ngettext = window.ngettext;
app.config.globalProperties.interpolate = window.interpolate;

// vue-mq (media queries)
app.use(Vue3Mq, {
  preset: "bootstrap5",
});

// pinia (vuex) state management
const pinia = createPinia();
app.use(pinia);

// get contextStore values
const contextStore = useContextStore();

// bootstrap-vue-next
app.use(createBootstrap());

// vue-router
app.use(router);

/*
// vue-gtag-next
// TODO: un-commment to use Google Analytics for you app. also
// configure trackRouter located in the router/index.js file
//
app.use(VueGtag, {
  isEnabled: contextStore.context.debugMode, == "false",
  property: {
    id: contextStore.context.googleAnalyticsKey,
    params: {
      anonymize_ip: true,
      // user_id: 'provideSomeHashedId'
    },
  },
});
*/

// microsoft clarity
Clarity.init(contextStore.context.clarityProjectId);

// mount the vue app
app.mount("#app");
