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

        <BAlert v-if="isIncomplete" variant="warning" :model-value="true">
          <i class="bi-exclamation-triangle-fill me-1"></i><span class="fw-bold"
            >Incomplete Information</span
          >
          <div>Please add a relationship for your primary contact</div>
        </BAlert>

        <div class="mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="fs-3 m-0">Primary</h2>
            <div>
              <ContactRemove
                v-if="this.emergencyContacts.length > 0"
                :modal-data="this.emergencyContacts"
                :is-primary="true"
              />
              <ContactEdit
                v-if="this.emergencyContacts.length > 0"
                :modal-data="this.emergencyContacts"
                :is-primary="true"
              />
            </div>
          </div>
          <div>
            If your primary contact cannot be reached, your secondary contact
            will be attempted.
          </div>
          <div class="my-3 mx-5">
            <ContactDetails :contact-details="this.emergencyContacts[0]"/>
          </div>
        </div>

        <div class="mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="fs-3 m-0">Secondary</h2>
            <div>
              <ContactRemove
                v-if="this.emergencyContacts.length > 0"
                :modal-data="this.emergencyContacts"
              />
              <ContactEdit
                v-if="this.emergencyContacts.length > 0"
                :modal-data="this.emergencyContacts"
              />
            </div>
          </div>
          <div>
            If your primary contact cannot be reached, your secondary contact
            will be attempted.
          </div>
          <div class="my-3 mx-5">
            <ContactDetails :contact-details="this.emergencyContacts[1]"/>
          </div>
        </div>

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
          <FamilyContactDetails :contact="this.familyContact"/>
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

  import ContactDetails from "@/components/emergency/contact-details.vue";
  import ContactEdit from "@/components/emergency/contact-edit.vue";
  import ContactRemove from "@/components/emergency/contact-remove.vue";
  import FamilyContactDetails from "@/components/family/contact-details.vue";
  import DefaultLayout from "@/layouts/default.vue";

  import { useContextStore } from "@/stores/context";
  import { getEmergencyContacts, getFamilyContact } from "@/utils/data";

  export default {
    name: "PagesEmergency",
    components: {
      BAlert,
      ContactDetails,
      ContactEdit,
      ContactRemove,
      DefaultLayout,
      FamilyContactDetails,
    },
    setup() {
      const contextStore = useContextStore();
      return {
        contextStore,
        getEmergencyContacts,
        getFamilyContact,
      };
    },
    data() {
      return {
        pageTitle: "Your Contacts",
        emergencyContacts: [],
        familyContact: null,
        errorResponse: null,
      };
    },
    computed: {
      isIncomplete() {
        // check if contacts list returns missing relationship for primary contact (index 0)
        return (
          this.emergencyContacts.length > 0 &&
          (this.emergencyContacts[0].relationship === null ||
            this.emergencyContacts[0].relationship.trim() === "")
        );
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
      loadFamilyContact: function () {
        this.getFamilyContact(this.contextStore.context.familyContactUrl)
          .then((data) => {
            this.familyContact = data.family_contact;
          })
          .catch((error) => {
            this.errorResponse = error.data;
          });
      },
    },
    created() {
      this.loadEmergencyContacts();
      this.loadFamilyContact();
    },
  };
</script>
