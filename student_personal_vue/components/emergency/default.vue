<template>

  <BAlert
    v-if="isIncomplete"
    variant="warning"
    :model-value="true"
    class="small"
  >
    <i class="bi-exclamation-triangle-fill me-2"></i>
    <span class="fw-bold">Incomplete information</span>
    <div>Please complete your primary contact.</div>
  </BAlert>

  <BAlert v-if="isSaved" variant="success" :model-value="true" class="small">
    <i class="bi-exclamation-triangle-fill me-2"></i>
    <span class="fw-bold">Contact information successfully updated</span>
  </BAlert>

  <h2 class="ff-encode-sans fw-semibold mb-3">Emergency Contacts</h2>
  <p class="mb-4">
    If your primary contact cannot be reached, your secondary contact will be
    attempted.
  </p>

  <div class="mb-3">
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
  <p v-if="emergencyContactStore.staticPrimary" class="text-secondary fst-italic">Contacts last updated on: {{ emergencyContactStore.staticPrimary.last_modified_formatted }}
  </p>
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
          (this.emergencyContactStore.staticPrimary.relationship === null ||
            this.emergencyContactStore.staticPrimary.relationship.trim() === "")
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
