<template>
  <BAlert
    v-if="isMissingAllContacts"
    variant="warning"
    :model-value="true"
    class="mb-4"
  >
    <i class="bi-exclamation-triangle-fill me-2"></i>
    Emergency contacts are missing. Please add both a primary and secondary
    contact.
  </BAlert>
  <template v-else>
    <BAlert
      v-if="isIncomplete && isMissingSecondaryContact"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Emergency contact information is missing. Please update your primary and
      secondary contacts.
    </BAlert>
    <BAlert v-else variant="warning" :model-value="true" class="mb-4">
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Emergency contact information is missing. Please update your emergency
      contacts.
    </BAlert>
  </template>

  <BAlert v-if="isSaved" variant="success" :model-value="true" class="mb-4">
    <i class="bi-exclamation-triangle-fill me-2"></i>
    Contact information successfully updated
  </BAlert>

  <div class="mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3 col-lg-6">
      <h2 class="fs-3 m-0">Primary</h2>
      <div>
        <ContactEdit
          v-if="emergencyContactStore.hasContacts"
          :is-primary="true"
          @reload="loadEmergencyContacts"
          @saved="showSavedAlert"
        />
        <ContactRemove
          v-if="emergencyContactStore.hasContacts"
          :is-primary="true"
          @reload="loadEmergencyContacts"
        />
      </div>
    </div>
    <div class="my-3 mx-5">
      <template v-if="isLoading">
        <ContactLoading />
      </template>
      <template v-else-if="errorResponse">unable to load contacts...</template>
      <template v-else>
        <ContactDetails
          v-if="emergencyContactStore.staticPrimary"
          :contact="emergencyContactStore.staticPrimary"
        />
      </template>
    </div>
  </div>

  <div class="mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3 col-lg-6">
      <h2 class="fs-3 m-0">Secondary</h2>
      <div>
        <ContactEdit
          v-if="emergencyContactStore.hasContacts"
          :is-primary="false"
          @reload="loadEmergencyContacts"
          @saved="showSavedAlert"
        />
        <ContactRemove
          v-if="emergencyContactStore.hasContacts"
          :is-primary="false"
          @reload="loadEmergencyContacts"
        />
      </div>
    </div>
    <div class="my-3 mx-5">
      <template v-if="isLoading">
        <ContactLoading />
      </template>
      <template v-else-if="errorResponse">unable to load contacts...</template>
      <template v-else>
        <ContactDetails
          v-if="emergencyContactStore.staticSecondary"
          :contact="emergencyContactStore.staticSecondary"
        />
      </template>
    </div>
  </div>

  <p class="mb-4">
    If your primary contact cannot be reached, your secondary contact will be
    attempted.
  </p>
</template>

<script>
  import { BAlert } from "bootstrap-vue-next";
  import ContactLoading from "@/components/_contact-loading.vue";
  import ContactDetails from "@/components/emergency/contact-details.vue";
  import ContactEdit from "@/components/emergency/contact-edit.vue";
  import ContactRemove from "@/components/emergency/contact-remove.vue";
  import { useContextStore } from "@/stores/context";
  import { useEmergencyContactStore } from "@/stores/emergency-contact";
  import { getEmergencyContacts } from "@/utils/data";

  export default {
    name: "EmergencyContacts",
    components: {
      ContactDetails,
      ContactEdit,
      ContactRemove,
      ContactLoading,
      BAlert,
    },
    setup() {
      const contextStore = useContextStore();
      const emergencyContactStore = useEmergencyContactStore();
      return {
        contextStore,
        emergencyContactStore,
        getEmergencyContacts,
      };
    },
    data() {
      return {
        errorResponse: null,
        isLoading: true,
        isSaved: false,
      };
    },
    computed: {
      isIncomplete() {
        // check for any missing fields from primary and secondary contacts
        return (
          this.emergencyContactStore.contacts.length > 0 &&
          (this.emergencyContactStore.staticPrimary.name === null ||
            this.emergencyContactStore.staticPrimary.name.trim() === "" ||
            this.emergencyContactStore.staticSecondary.name === null ||
            this.emergencyContactStore.staticSecondary.name.trim() === "" ||
            this.emergencyContactStore.staticPrimary.email === null ||
            this.emergencyContactStore.staticPrimary.email.trim() === "" ||
            this.emergencyContactStore.staticSecondary.email === null ||
            this.emergencyContactStore.staticSecondary.email.trim() === "" ||
            this.emergencyContactStore.staticPrimary.phone_number === null ||
            this.emergencyContactStore.staticPrimary.phone_number.trim() ===
              "" ||
            this.emergencyContactStore.staticSecondary.phone_number === null ||
            this.emergencyContactStore.staticSecondary.phone_number.trim() ===
              "" ||
            this.emergencyContactStore.staticPrimary.relationship === null ||
            this.emergencyContactStore.staticPrimary.relationship.trim() ===
              "" ||
            this.emergencyContactStore.staticSecondary.relationship === null ||
            this.emergencyContactStore.staticSecondary.relationship.trim() ===
              "")
        );
      },
      isMissingSecondaryContact() {
        // check for missing secondary contact
        return (
          this.emergencyContactStore.contacts.length > 0 &&
          (this.emergencyContactStore.staticSecondary.name === null ||
            this.emergencyContactStore.staticSecondary.name.trim() === "")
        );
      },
      isMissingAllContacts() {
        // check for missing primary and secondary contacts
        return (
          this.emergencyContactStore.contacts.length > 0 &&
          this.emergencyContactStore.staticPrimary.name.trim() === "" &&
          this.emergencyContactStore.staticSecondary.name.trim() === ""
        );
      },
    },
    methods: {
      loadEmergencyContacts: function () {
        let url = this.contextStore.context.emergencyContactUrl;

        this.isLoading = true;
        setTimeout(() => {
          this.getEmergencyContacts(url)
            .then((data) => {
              this.emergencyContactStore.$reset;
              this.emergencyContactStore.setContacts(data);
            })
            .catch((error) => {
              this.errorResponse = error.data;
            })
            .finally(() => {
              this.isLoading = false;
            });
        }, 500);
      },
      showSavedAlert: function () {
        this.isSaved = true;
      },
    },
    created() {
      this.loadEmergencyContacts();
    },
  };
</script>
