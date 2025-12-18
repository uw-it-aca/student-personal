<template>
  <BAlert
    v-if="isIncomplete"
    variant="warning"
    :model-value="true"
    class="small"
  >
    <i class="bi-exclamation-triangle-fill me-2"></i>
    <span class="fw-bold">Incomplete information</span>
    <div>Please add a relationship for your primay contact.</div>
  </BAlert>

  <BAlert
    v-if="isSaved"
    variant="success"
    :model-value="true"
    class="small"
  >
    <i class="bi-exclamation-triangle-fill me-2"></i>
    <span class="fw-bold">Contact information successfully updated</span>
  </BAlert>

  <div class="mb-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="fs-3 m-0">Primary</h2>
      <div>
        <ContactRemove
          v-if="emergencyContactStore.hasContacts"
          :is-primary="true"
          @reload="loadEmergencyContacts"
        />
        <ContactEdit
          v-if="emergencyContactStore.hasContacts"
          :is-primary="true"
          @reload="loadEmergencyContacts"
          @saved="showSavedAlert"
        />
      </div>
    </div>
    <div>
      If your primary contact cannot be reached, your secondary contact will be
      attempted.
    </div>
    <div class="my-3 mx-5">
      <template v-if="isLoading">
        <ContactLoading/>
      </template>
      <template v-else-if="errorResponse">unable to load contacts...</template>
      <template v-else>
        <ContactDetails
          v-if="emergencyContactStore.primary"
          :contact="emergencyContactStore.primary"
        />
      </template>
    </div>
  </div>

  <div class="mb-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="fs-3 m-0">Secondary</h2>
      <div>
        <ContactRemove
          v-if="emergencyContactStore.hasContacts"
          :is-primary="false"
          @reload="loadEmergencyContacts"
        />
        <ContactEdit
          v-if="emergencyContactStore.hasContacts"
          :is-primary="false"
          @reload="loadEmergencyContacts"
          @saved="showSavedAlert"
        />
      </div>
    </div>
    <div>
      If your primary contact cannot be reached, your secondary contact will be
      attempted.
    </div>
    <div class="my-3 mx-5">
      <template v-if="isLoading">
        <ContactLoading/>
      </template>
      <template v-else-if="errorResponse">unable to load contacts...</template>
      <template v-else>
        <ContactDetails
          v-if="emergencyContactStore.secondary"
          :contact="emergencyContactStore.secondary"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import { BAlert } from "bootstrap-vue-next";
  import ContactDetails from "@/components/emergency/contact-details.vue";
  import ContactEdit from "@/components/emergency/contact-edit.vue";
  import ContactLoading from "@/components/_contact-loading.vue";
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
        // check for missing relationship in the primary contact
        return (
          this.emergencyContactStore.contacts.length > 0 &&
          (this.emergencyContactStore.primary.relationship === null ||
            this.emergencyContactStore.primary.relationship.trim() === "")
        );
      },
    },
    methods: {
      loadEmergencyContacts: function () {
        let url = this.contextStore.context.emergencyContactUrl;

        setTimeout(() => {
          this.getEmergencyContacts(url)
            .then((data) => {
              this.emergencyContactStore.contacts = data.emergency_contacts;
              this.isLoading = false;
            })
            .catch((error) => {
              this.errorResponse = error.data;
            })
            .finally(() => {});
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
