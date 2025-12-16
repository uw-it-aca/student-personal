<template>
  <BButton
    variant="quiet-primary"
    class="me-1"
    size="sm"
    @click="showModal = !showModal"
  >
    Remove
  </BButton>
  <BModal
    v-model="showModal"
    no-close-on-backdrop
    no-close-on-esc
    title="Confirm Removal"
    body-class="p-4"
    @close="cancelModal"
  >
    <p>primary: {{ isPrimary }}</p>

    <BAlert v-if="hasError" variant="danger" :model-value="true">
      <i class="bi-exclamation-triangle-fill me-1"></i><span class="fw-bold"
        >Server error</span
      >
      <div>Your request could not be processed.</div>
    </BAlert>

    <p>
      Are you sure you want to remove
      <template v-if="isPrimary">
        <strong v-if="emergencyContactStore.primary"
          >{{ emergencyContactStore.primary.name }}</strong
        >
      </template>
      <template v-else>
        <strong v-if="emergencyContactStore.secondary"
          >{{ emergencyContactStore.secondary.name }}</strong
        >
      </template>
      from your emergency contacts?
    </p>

    <p>
      If this contact is set as your primary, your secondary contact will
      automatically become your primary contact.
    </p>

    <div class="border p-2 small mb-3">
      <p>remove contact:</p>
      <template v-if="isPrimary">
        <p>{{ emergencyContactStore.primary }}</p>
      </template>
      <template v-else>
        <p>{{ emergencyContactStore.secondary }}</p>
      </template>
    </div>

    <template #footer>
      <BButton variant="subdued-danger" @click="cancelModal">Cancel</BButton>
      <BButton variant="danger" @click="removeContact">Remove</BButton>
    </template>
  </BModal>
</template>

<script>
  import { BAlert, BButton, BModal } from "bootstrap-vue-next";
  import { useContextStore } from "@/stores/context";
  import { useEmergencyContactStore } from "@/stores/emergency-contact";
  import { updateEmergencyContacts } from "@/utils/data";

  export default {
    components: {
      BButton,
      BModal,
      BAlert,
    },
    props: {
      isPrimary: {
        type: Boolean,
        required: true,
      },
    },
    setup() {
      const contextStore = useContextStore();
      const emergencyContactStore = useEmergencyContactStore();
      return {
        contextStore,
        emergencyContactStore,
        updateEmergencyContacts,
      };
    },
    data() {
      return {
        showModal: false,
        hasError: false,
      };
    },
    methods: {
      cancelModal: function () {
        this.showModal = false;
      },
      removeContact: function () {
        let url = this.contextStore.context.emergencyContactUrl;

        this.emergencyContactStore.removeContact(this.isPrimary);

        this.updateEmergencyContacts(url, this.emergencyContactStore.contacts)
          .then((data) => {
            this.emergencyContactStore.contacts = data.emergency_contacts;
            // this.showModal = false;
          })
          .catch((error) => {
            console.log("catch error");
            this.errorResponse = error.data;
            this.hasError = true;
          })
          .finally(() => {
            console.log("finally");
          });
      },
    },
  };
</script>
