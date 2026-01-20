// home.vue
<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>{{ pageTitle }}</template>
    <template #content>
      <div v-if="!contextStore.context.isStudent">
        <BAlert variant="danger" :model-value="true">
          <i class="bi-exclamation-triangle-fill me-1"></i>You must be an active
          student to use this tool.
        </BAlert>

        <p style="max-width: 85ch;">
          If you are a currently an active student, please contact help@uw.edu
          and let us know if you are experiencing any issues.
        </p>
      </div>
      <div v-else>
        <p style="max-width: 85ch;">
          It&rsquo;s important that UW has a way to contact a trusted individual
          (parent, friend, spouse etc.) about your safety, if an emergency
          occurs. Make sure to tell the individual(s) listed that they are your
          emergency contact.
        </p>

        <p class="fw-bold mb-5" style="max-width: 85ch;">
          Please ensure you have at least a primary contact listed below with up
          to date contact information.
        </p>

        <EmergencyContacts />
      </div>
    </template>
    <template #sidebar></template>
  </DefaultLayout>
</template>

<script>
  import { BAlert } from "bootstrap-vue-next";
  import EmergencyContacts from "@/components/emergency/default.vue";
  import FamilyContactDetails from "@/components/family/contact-details.vue";
  import DefaultLayout from "@/layouts/default.vue";
  import { useContextStore } from "@/stores/context";

  export default {
    name: "PagesEmergency",
    components: {
      BAlert,
      DefaultLayout,
      EmergencyContacts,
      FamilyContactDetails,
    },
    setup() {
      const contextStore = useContextStore();
      return {
        contextStore,
      };
    },
    data() {
      return {
        pageTitle: "Emergency Contacts",
      };
    },
  };
</script>
