<template>
  <template v-if="isLoading">
    <div class="d-flex justify-content-center align-items-center" style="height:300px;">
      <BSpinner/>
    </div>
  </template>
  <template v-else-if="errorResponse">error state</template>
  <template v-else>
    <BAlert v-if="isIncomplete" variant="warning" :model-value="true">
      <i class="bi-exclamation-triangle-fill me-1"></i><span class="fw-bold"
        >Incomplete Information</span
      >
      <div>Please add a relationship for your primary contact.</div>
    </BAlert>

    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fs-3 m-0">Primary</h2>
        <div>
          <ContactRemove
            v-if="emergencyContactStore.hasContacts"
            :is-primary="true"
          />
          <ContactEdit
            v-if="emergencyContactStore.hasContacts"
            :is-primary="true"
            @reload="loadEmergencyContacts"
          />
        </div>
      </div>
      <div>
        If your primary contact cannot be reached, your secondary contact will
        be attempted.
      </div>
      <div class="my-3 mx-5">
        <ContactDetails
          v-if="emergencyContactStore.primary"
          :contact="emergencyContactStore.primary"
        />
      </div>
    </div>

    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fs-3 m-0">Secondary</h2>
        <div>
          <ContactRemove
            v-if="emergencyContactStore.hasContacts"
            :is-primary="false"
          />
          <ContactEdit
            v-if="emergencyContactStore.hasContacts"
            :is-primary="false"
            @reload="loadEmergencyContacts"
          />
        </div>
      </div>
      <div>
        If your primary contact cannot be reached, your secondary contact will
        be attempted.
      </div>
      <div class="my-3 mx-5">
        <ContactDetails
          v-if="emergencyContactStore.secondary"
          :contact="emergencyContactStore.secondary"
        />
      </div>
    </div>
  </template>
</template>

<script>
  import { BAlert, BSpinner } from "bootstrap-vue-next";
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
      BAlert,
      BSpinner,
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
    },
    created() {
      this.loadEmergencyContacts();
    },
  };
</script>
