// home.vue
<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>
      {{ pageTitle }}
    </template>
    <template #content>
      <div v-if="!contextStore.context.isStudent">
        <BAlert variant="danger" :model-value="true">
          <i class="bi-exclamation-triangle-fill me-1"></i
          ><span class="fw-bold">Feature Unavailable</span>
          <div>You must be an active student to use this tool.</div>
        </BAlert>
        <p>
          If you are a currently an active student, please contact help@uw.edu
          and let us know if you are experiencing any issues.
        </p>
      </div>
      <div v-else>
        <h2 class="mb-3">Emergency Contacts</h2>
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

        <BAlert v-if="isIncomplete" variant="warning" :model-value="true">
          <i class="bi-exclamation-triangle-fill me-1"></i
          ><span class="fw-bold">Incomplete Information</span>
          <div>Please add a relationship for your primary contact</div>
        </BAlert>

        <div class="mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="m-0">Primary</h3>
            <div>
              <ContactModal />
            </div>
          </div>
          <div>
            If your primary contact cannot be reached, your secondary contact
            will be attempted.
          </div>
          <div class="my-3 mx-5">
            <ContactDetails :contact-details="this.emergencyContacts[0]" />
          </div>
        </div>

        <div class="mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="m-0">Secondary</h3>
            <div>
              <ContactModal />
            </div>
          </div>
          <div>
            If your primary contact cannot be reached, your secondary contact
            will be attempted.
          </div>
          <div class="my-3 mx-5">
            <ContactDetails :contact-details="this.emergencyContacts[1]" />
          </div>
        </div>

        <hr class="my-5" />

        <h2 class="mb-3">Parent/Family Member Contact</h2>

        <p>
          This address is used to reach out to parent/family members by Student
          Life. You are welcome to provide a parent/family contact name, but
          this is not a required field. Please visit the Address and Consent
          page to edit this contact.
        </p>

        <div class="my-3 mx-5">
          <ContactDetails :contact-details="this.parentContact" />
        </div>
      </div>
    </template>
  </DefaultLayout>
</template>

<script>
import { BAlert } from "bootstrap-vue-next";
import ContactDetails from "@/components/contact-details.vue";
import ContactModal from "@/components/contact-modal.vue";
import DefaultLayout from "@/layouts/default.vue";
import { useContextStore } from "@/stores/context";
import { getEmergencyContacts } from "@/utils/data"

export default {
  name: "PagesEmergency",
  components: { DefaultLayout, ContactDetails, ContactModal, BAlert },
  setup() {
    const contextStore = useContextStore();
    return {
      contextStore,
      getEmergencyContacts,
    };
  },
  data() {
    return {
      pageTitle: "Additional Contacts",
      emergencyContacts: [],

      // mock parent contact (separate api call?)
      parentContact: {
        name: "Daddy Average",
        email: "parent@example.com",
        phone: "+1234567890",
      },
      errorResponse: null,
    };
  },
  computed: {
    isIncomplete() {
      // check if contacts list returns missing relationship for primary contact (index 0)
      // TODO: replace with API call later
      return this.emergencyContacts.length > 0 &&
        !("relationship" in this.emergencyContacts[0]);
    },
  },
  methods: {
    loadEmergencyContacts: function () {
      this.getEmergencyContacts(this.contextStore.context.emergencyContactUrl)
        .then((data) => {
          this.emergencyContacts = data.emergency_contacts;
        })
        .catch((error) => {
          this.errorResponse = error.data;
        });
    },
  },
  created() {
    this.loadEmergencyContacts();
  },
};
</script>
