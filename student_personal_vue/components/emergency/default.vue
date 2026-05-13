<template>
  <BAlert
    v-if="isSaved"
    variant="success"
    :model-value="true"
    class="col-lg-10 small mb-4"
  >
    <i class="bi-exclamation-triangle-fill me-2"></i>
    Contact information successfully updated
  </BAlert>

  <BCard body-class="p-4" class="mb-3">
    <SHeading level="2" class="h4 fw-semibold mb-4">Contact #1</SHeading>
    <BAlert
      v-if="isMissingPrimaryContact"
      variant="warning"
      :model-value="true"
      class="small mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a contact</strong>.
    </BAlert>
    <BAlert
      v-else-if="isPrimaryIncomplete"
      variant="warning"
      :model-value="true"
      class="small mb-4"
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
            v-if="!isLoading && !isMissingPrimaryContact && isValidSecondaryContact"
            :is-primary="true"
            @reload="loadEmergencyContacts"
          />
          <ContactEdit
            v-if="!isLoading && emergencyContactStore.hasContacts"
            :is-primary="true"
            :action="isMissingPrimaryContact ? 'Add' : 'Edit'"
            @reload="loadEmergencyContacts"
            @saved="showSavedAlert"
          />
        </div>
      </div>
    </template>
  </BCard>

  <BCard body-class="p-4" class="mb-5">
    <SHeading level="2" class="h4 fw-semibold mb-4">Contact #2</SHeading>
    <BAlert
      v-if="isMissingSecondaryContact"
      variant="warning"
      :model-value="true"
      class="small mb-4"
    >
      <i class="bi-exclamation-triangle-fill me-2"></i>
      Please <strong>add a contact</strong>.
    </BAlert>
    <BAlert
      v-else-if="isSecondaryIncomplete"
      variant="warning"
      :model-value="true"
      class="small mb-4"
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
            v-if="!isLoading && isValidPrimaryContact"
            :is-primary="false"
            @reload="loadEmergencyContacts"
          />
          <ContactEdit
            v-if="!isLoading && isValidPrimaryContact"
            :is-primary="false"
            :action="isMissingSecondaryContact ? 'Add' : 'Edit'"
            @reload="loadEmergencyContacts"
            @saved="showSavedAlert"
          />
        </div>
      </div>
    </template>
  </BCard>
</template>

<script>
  import { BAlert, BCard } from "bootstrap-vue-next";
  import { SHeading } from "solstice-vue";
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
      BCard,
      SHeading,
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
        return this.emergencyContactStore.primaryEmpty;
      },
      isValidPrimaryContact() {
        return this.emergencyContactStore.primaryValid;
      },
      isPrimaryIncomplete() {
        return this.emergencyContactStore.primaryIncomplete;
      },
      isMissingSecondaryContact() {
        return this.emergencyContactStore.secondaryEmpty;
      },
      isValidSecondaryContact() {
        return this.emergencyContactStore.secondaryValid;
      },
      isSecondaryIncomplete() {
        return this.emergencyContactStore.secondaryIncomplete;
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
