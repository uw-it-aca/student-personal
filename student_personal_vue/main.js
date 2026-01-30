import { createBootstrap } from "bootstrap-vue-next";
import { createPinia } from "pinia";
import { createApp } from "vue";

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

// pinia (vuex) state management
const pinia = createPinia();
app.use(pinia);

// get contextStore values
const contextStore = useContextStore();

// bootstrap-vue-next
app.use(createBootstrap());

// vue-router
app.use(router);

// microsoft clarity
Clarity.init(contextStore.context.clarityProjectId);

// mount the vue app
app.mount("#app");
