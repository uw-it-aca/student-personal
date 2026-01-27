<template>
  <BAlert v-if="isSaved" variant="success" :model-value="true" class="mb-4">
    <i class="bi-exclamation-triangle-fill me-2"></i>
    Contact information successfully updated
  </BAlert>

  <div class="col-lg-10 mb-4">
    <h2 class="ff-encode-sans fs-3 m-0 mb-3">Contact #1</h2>
    <BAlert
      v-if="isMissingPrimaryContact"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a contact</strong>.
    </BAlert>
    <BAlert
      v-else-if="isPrimaryIncomplete"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      <strong>Missing information.</strong> Please review and update your
      contact.
    </BAlert>

    <template v-if="isLoading">
      <ContactLoading />
    </template>
    <template v-else-if="errorResponse">Unable to load contacts...</template>
    <template v-else>
      <div class="d-flex justify-content-between align-items-center">
        <ContactDetails
          v-if="emergencyContactStore.staticPrimary"
          :contact="emergencyContactStore.staticPrimary"
        />
        <div class="text-nowrap">
          <ContactRemove
            v-if="!isMissingPrimaryContact && !isLoading"
            :is-primary="true"
            @reload="loadEmergencyContacts"
          />
          <ContactEdit
            v-if="emergencyContactStore.hasContacts && !isLoading"
            :is-primary="true"
            :action="isMissingPrimaryContact ? 'Add' : 'Edit'"
            @reload="loadEmergencyContacts"
            @saved="showSavedAlert"
          />
        </div>
      </div>
    </template>
  </div>

  <div class="col-lg-10 mb-5">
    <h2 class="ff-encode-sans fs-3 m-0 mb-3">Contact #2</h2>
    <BAlert
      v-if="isMissingSecondaryContact"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a contact</strong>.
    </BAlert>
    <BAlert
      v-else-if="isSecondaryIncomplete"
      variant="warning"
      :model-value="true"
      class="mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      <strong>Missing information.</strong> Please review and update your
      contact.
    </BAlert>

    <template v-if="isLoading">
      <ContactLoading />
    </template>
    <template v-else-if="errorResponse">Unable to load contacts...</template>
    <template v-else>
      <div class="d-flex justify-content-between align-items-center">
        <ContactDetails
          v-if="emergencyContactStore.staticSecondary"
          :contact="emergencyContactStore.staticSecondary"
        />
        <div class="text-nowrap">
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
    </template>
  </div>
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
