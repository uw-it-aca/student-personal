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
    body-class="px-5 py-4"
  >
    <p>primary: {{ isPrimary }}</p>
    <p>
      Are you sure you want to remove
      <template v-if="isPrimary">
        <strong>{{ emergencyContactStore.primary.name }}</strong>
      </template>
      <template v-else>
        <strong>{{ emergencyContactStore.secondary.name }}</strong>
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
  import { BButton, BModal } from "bootstrap-vue-next";
  import { useContextStore } from "@/stores/context";
  import { useEmergencyContactStore } from "@/stores/emergency-contact";
  import { updateEmergencyContacts } from "@/utils/data";

  export default {
    components: {
      BButton,
      BModal,
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
          })
          .catch((error) => {
            this.errorResponse = error.data;
          })
          .finally(() => {
          });
      },
    },
  };
</script>
