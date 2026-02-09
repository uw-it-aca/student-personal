// home.vue
<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>{{ pageTitle }}</template>
    <template #content>
      <div v-if="!contextStore.context.isStudent">
        <BAlert variant="danger" :model-value="true" class="small">
          <i class="bi-exclamation-triangle-fill me-1"></i>You must be an active
          student to use this tool.
        </BAlert>

        <p style="max-width: 85ch">
          If you are a currently an active student, please contact help@uw.edu
          and let us know if you are experiencing any issues.
        </p>
      </div>
      <div v-else>
        <p class="mb-4" style="max-width: 85ch">
          This app enables you to maintain up-to-date information for your
          emergency contacts. Your emergency contacts should be trusted
          individuals. UW may, in its discretion, reach out to one or both
          emergency contacts in the event an emergency occurs.
        </p>

        <p class="mb-5" style="max-width: 85ch">
          Please make sure the people you designate below are aware that they
          are listed as one of your emergency contacts.
        </p>

        <EmergencyContacts />

        <BCard
          bg-variant="body-secondary"
          class="bg-opacity-50 col-lg-10 mb-3 border-0"
        >
          <h2 class="h5 ff-encode-sans m-0 mb-3">For your information</h2>
          <p style="max-width: 85ch">
            You may see information that has been imported from previously
            submitted emergency contact information. Please verify your
            emergency contacts. You can change this information at any time by
            returning to this page.
          </p>

          <ul class="m-0">
            <li>
              This information will only be used for purposes of emergency
              contact
            </li>
            <li>
              This does not constitute a FERPA release for beyond what is
              necessary for a health and safety emergency
            </li>
            <li>
              UW is not under any general obligation to contact the listed
              emergency contacts.
            </li>
          </ul>
        </BCard>
      </div>
    </template>
    <template #sidebar></template>
  </DefaultLayout>
</template>

<script>
  import { BAlert, BCard } from "bootstrap-vue-next";
  import EmergencyContacts from "@/components/emergency/default.vue";
  import FamilyContactDetails from "@/components/family/contact-details.vue";
  import DefaultLayout from "@/layouts/default.vue";
  import { useContextStore } from "@/stores/context";

  export default {
    name: "PagesEmergency",
    components: {
      BAlert,
      BCard,
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
