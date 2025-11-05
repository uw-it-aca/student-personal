// home.vue
<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>
      {{ pageTitle }}
    </template>
    <template #content>
      <h2 class="mb-3">Emergency Contacts</h2>
      <p>
        It&rsquo;s important that UW has a way to contact a trusted individual
        (parent, friend, spouse etc.) about your safety, if an emergency occurs.
        Make sure to tell to tell the individual(s) listed that they are your
        emergency contact.
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
          If your primary contact cannot be reached, your secondary contact will
          be attempted.
        </div>
        <div class="my-3 mx-5">
          <ContactDetails />
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
          If your primary contact cannot be reached, your secondary contact will
          be attempted.
        </div>
        <div class="my-3 mx-5">
          <ContactDetails />
        </div>
      </div>

      <hr class="my-5" />

      <h2 class="mb-3">Parent/Family Member Contact</h2>

      <p>
        This address is used to reach out to parent/family members by Student
        Life. You are welcome to provide a parent/family contact name, but this
        is not a required field. Please visit the Address and Consent page to
        edit this contact.
      </p>

      <div class="my-3 mx-5">
        <ContactDetails />
      </div>
    </template>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/default.vue";
import ContactDetails from "../components/contact-details.vue";
import ContactModal from "@/components/contact-modal.vue";
import { BAlert } from "bootstrap-vue-next";

export default {
  name: "PagesEmergency",
  components: { DefaultLayout, ContactDetails, ContactModal, BAlert },
  data() {
    return {
      pageTitle: "Additional Contacts",
      // mock contacts list
      contacts: [
        {
          name: "John Doe",
          email: "john.doe@example.com",
          countryCode: "+1",
          phone: "123-456-7890",
          lastUpdated: new Date().toISOString(),
        },
        {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          countryCode: "+56",
          phone: "987-654-3210",
          lastUpdated: new Date().toISOString(),
        },
      ],
      // mock parent contact (separate api call?)
      parentContact: {
        name: "Parent Name",
        email: "parent@example.com",
        countryCode: "+1",
        phone: "123-456-7890",
      },
    };
  },
  methods: {},
};
</script>
