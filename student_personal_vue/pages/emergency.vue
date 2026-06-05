// home.vue
<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>{{ pageTitle }}</template>
    <template #content>
      <div v-if="!contextStore.context.isStudent">
        <BAlert variant="danger" :model-value="true" class="small">
          <i class="bi-exclamation-triangle-fill me-2"></i>You must be an active
          student to use this tool.
        </BAlert>

        <p style="max-width: 85ch">
          If you are a currently an active student, please contact help@uw.edu
          and let us know if you are experiencing any issues.
        </p>
      </div>
      <div v-else>
        <p class="mb-4" style="max-width: 85ch">
          Emergency contacts are trusted individuals you authorize UW to
          contact if you ever experience an emergency. UW may, in its
          discretion, reach out to one or both emergency contacts in the event
          an emergency occurs.
        </p>

        <div class="mb-5" style="max-width: 85ch">
          <p class="mb-0">Please keep in mind:</p>
          <ul class="m-0">
            <li>
              Your emergency contacts can be <strong>anyone</strong> you choose.
              They do not need to be family members.
            </li>
            <li>
              Do not list yourself as an emergency contact or provide your own
              contact information.
            </li>
            <li>
              You should tell the people you list below that they are one of
              your primary contacts in case of emergency.
            </li>
          </ul>
        </div>

        <p class="mb-5" style="max-width: 85ch">
          Please resolve any missing or incorrect information in the fields for
          Contact #1 before adding an additional contact.
        </p>

        <EmergencyContacts />

        <BCard
          bg-variant="body-secondary"
          body-class="p-4"
          class="bg-opacity-50 mb-3 border-0"
        >
          <SHeading level="2" class="h4 mb-3 fw-semibold">For your information</SHeading>
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
  import { SHeading } from "solstice-vue";
  import EmergencyContacts from "@/components/emergency/default.vue";
  import FamilyContactDetails from "@/components/family/contact-details.vue";
  import DefaultLayout from "@/layouts/default.vue";
  import { useContextStore } from "@/stores/context";

  export default {
    name: "PagesEmergency",
    components: {
      BAlert,
      BCard,
      SHeading,
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
