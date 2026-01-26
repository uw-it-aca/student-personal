<template>
  <BAlert v-if="isSaved" variant="success" :model-value="true" class="mb-4">
    <i class="bi-exclamation-triangle-fill me-2"></i>
    Contact information successfully updated
  </BAlert>

  <div class="col-lg-10 mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="fs-3 m-0">Primary</h2>
      <div>
        <ContactRemove
          v-if="!isMissingAllContacts && !isLoading"
          :is-primary="true"
          @reload="loadEmergencyContacts"
        />
        <ContactEdit
          v-if="emergencyContactStore.hasContacts && !isLoading"
          :is-primary="true"
          :action="isMissingAllContacts ? 'Add' : 'Edit'"
          @reload="loadEmergencyContacts"
          @saved="showSavedAlert"
        />
      </div>
    </div>
    <BAlert
      v-if="isMissingPrimaryContact"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a primary contact</strong>.
    </BAlert>
    <BAlert
      v-else-if="isPrimaryIncomplete"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a phone number, email or relationship</strong> for your
      primary contact.
    </BAlert>
    <div class="mx-5 my-3">
      <template v-if="isLoading">
        <ContactLoading />
      </template>
      <template v-else-if="errorResponse">Unable to load contacts...</template>
      <template v-else>
        <ContactDetails
          v-if="emergencyContactStore.staticPrimary"
          :contact="emergencyContactStore.staticPrimary"
        />
      </template>
    </div>
  </div>

  <div class="col-lg-10 mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="fs-3 m-0">Secondary</h2>
      <div>
        <ContactRemove
          v-if="!isMissingSecondaryContact && !isLoading"
          :is-primary="false"
          @reload="loadEmergencyContacts"
        />
        <ContactEdit
          v-if="emergencyContactStore.hasContacts && !isLoading"
          :is-primary="false"
          :action="isMissingSecondaryContact ? 'Add' : 'Edit'"
          @reload="loadEmergencyContacts"
          @saved="showSavedAlert"
        />
      </div>
    </div>
    <BAlert
      v-if="isMissingSecondaryContact"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a secondary contact</strong>.
    </BAlert>
    <BAlert
      v-else-if="isSecondaryIncomplete"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a phone number, email or relationship</strong> for your
      secondary contact.
    </BAlert>
    <div class="mx-5 my-3">
      <template v-if="isLoading">
        <ContactLoading />
      </template>
      <template v-else-if="errorResponse">Unable to load contacts...</template>
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
      isMissingPrimaryContact() {
        // check for missing secondary contact
        return (
          this.emergencyContactStore.contacts.length > 0 &&
          (this.emergencyContactStore.staticPrimary.name === null ||
            this.emergencyContactStore.staticPrimary.name.trim() === "")
        );
      },
      isPrimaryIncomplete() {
        // check for any missing fields from primary contacts
        return (
          this.emergencyContactStore.contacts.length > 0 &&
          (this.emergencyContactStore.staticPrimary.name === null ||
            this.emergencyContactStore.staticPrimary.name.trim() === "" ||
            this.emergencyContactStore.staticPrimary.email === null ||
            this.emergencyContactStore.staticPrimary.email.trim() === "" ||
            this.emergencyContactStore.staticPrimary.phone_number === null ||
            this.emergencyContactStore.staticPrimary.phone_number.trim() ===
              "" ||
            this.emergencyContactStore.staticPrimary.relationship === null ||
            this.emergencyContactStore.staticPrimary.relationship.trim() === "")
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
      isSecondaryIncomplete() {
        // check for any missing fields from primary contacts
        return (
          this.emergencyContactStore.contacts.length > 0 &&
          (this.emergencyContactStore.staticSecondary.name === null ||
            this.emergencyContactStore.staticSecondary.name.trim() === "" ||
            this.emergencyContactStore.staticSecondary.email === null ||
            this.emergencyContactStore.staticSecondary.email.trim() === "" ||
            this.emergencyContactStore.staticSecondary.phone_number === null ||
            this.emergencyContactStore.staticSecondary.phone_number.trim() ===
              "" ||
            this.emergencyContactStore.staticSecondary.relationship === null ||
            this.emergencyContactStore.staticSecondary.relationship.trim() ===
              "")
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
