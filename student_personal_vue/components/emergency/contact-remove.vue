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
    <template v-if="hasError">
      <BAlert variant="danger" :model-value="true" class="small">
        <i class="bi-exclamation-triangle-fill me-2"></i><span class="fw-bold"
          >Server error</span
        >
        <div>Your request could not be processed.</div>
      </BAlert>
      <p>
        We couldn’t complete your request to delete this contact. Please check
        the following:
      </p>
      <ul>
        <li>You are logged in.</li>
        <li>You are connected to the internet.</li>
        <li>You might not have the required permissions.</li>
      </ul>

      <p>Try again later or contact your administrator for assistance.</p>
    </template>
    <template v-else>
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
    </template>

    <template #footer>
      <BButton variant="subdued-danger" @click="cancelModal">
        <span v-if="!hasError">Cancel</span>
        <span v-else>Close</span>
      </BButton>
      <BButton v-if="!hasError" variant="danger" @click="removeContact">
        Remove
      </BButton>
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
    emits: ["reload"],
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

        console.log(this.emergencyContactStore.putData);

        this.updateEmergencyContacts(url, this.emergencyContactStore.putData)
          .then((data) => {
            this.$emit("reload");
            this.showModal = false;
          })
          .catch((error) => {
            this.hasError = true;
          })
          .finally(() => {
            this.showModal = false;
          });
      },
    },
  };
</script>
