// home.vue
<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>
      {{ pageTitle }}
    </template>
    <template #content>
      <div v-if="!isStudent">
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
      <div>
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

        <BAlert variant="warning" :model-value="true">
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
            <ContactDetails :contact-details="this.contacts[0]" />
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
            <ContactDetails :contact-details="this.contacts[1]" />
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

export default {
  name: "PagesEmergency",
  components: { DefaultLayout, ContactDetails, ContactModal, BAlert },
  data() {
    return {
      pageTitle: "Additional Contacts",
      isStudent: false,

      // mock contacts list
      contacts: [
        {
          name: "Mommy Average",
          countryCode: "+1",
          phone: "123-456-7890",
          email: "john.average@example.com",
          relationship: "Parent",
          lastUpdated: new Date().toISOString(),
        },
        {
          name: "Sister Average",
          countryCode: "+56",
          phone: "987-654-3210",
          email: "jane.smith@example.com",
          relationship: "Sibling",
          lastUpdated: new Date().toISOString(),
        },
      ],
      // mock parent contact (separate api call?)
      parentContact: {
        name: "Daddy Average",
        email: "parent@example.com",
        countryCode: "+1",
        phone: "123-456-7890",
      },
    };
  },
  methods: {},
};
</script>
