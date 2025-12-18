// home.vue
<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>{{ pageTitle }}</template>
    <template #content>
      <div v-if="!contextStore.context.isStudent">
        <BAlert variant="danger" :model-value="true">
          <i class="bi-exclamation-triangle-fill me-1"></i><span class="fw-bold"
            >Feature Unavailable</span
          >
          <div>You must be an active student to use this tool.</div>
        </BAlert>
        <p>
          If you are a currently an active student, please contact help@uw.edu
          and let us know if you are experiencing any issues.
        </p>
      </div>
      <div v-else>
        <p>
          It&rsquo;s important that UW has a way to contact a trusted individual
          (parent, friend, spouse etc.) about your safety, if an emergency
          occurs. Make sure to tell to tell the individual(s) listed that they
          are your emergency contact.
        </p>

        <p class="fw-bold">
          Please ensure you have at least a primary contact listed below with up
          to date contact information.
        </p>

        <EmergencyContacts/>

        <hr class="my-5">

        <h2 class="ff-encode-sans fw-semibold mb-3">
          Parent/Family Member Contact
        </h2>

        <p>
          This address is used to reach out to parent/family members by Student
          Life. You are welcome to provide a parent/family contact name, but
          this is not a required field. Please visit the
          <a href="https://sdb.admin.uw.edu/sisStudents/uwnetid/address.aspx"
            >Address and Consent</a
          >
          page to edit this contact.
        </p>

        <div class="my-3 mx-5">
          <FamilyContactDetails/>
        </div>
      </div>
    </template>
    <template #sidebar>
      <p>
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Quisquam, voluptatum.
      </p>
    </template>
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
        pageTitle: "Family & Emergency Contacts",
      };
    },
  };
</script>
