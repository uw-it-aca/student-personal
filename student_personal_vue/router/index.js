import { createWebHistory, createRouter } from "vue-router";

// vue-gtag-next track routing
// import { trackRouter } from "vue-gtag-next";

// page components
import EmergencyPage from "@/pages/emergency.vue";

const routes = [
  {
    path: "/",
    redirect: "/emergency",
  },
  {
    path: "/emergency",
    name: "Emergency Contacts",
    component: EmergencyPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// add router tracking to vue-gtag-next
// trackRouter(router);

export default router;
