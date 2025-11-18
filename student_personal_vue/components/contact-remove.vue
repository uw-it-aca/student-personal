<template>
  <BButton
    variant="quiet-danger"
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
    <p>
      Are you sure you want to remove
      <strong>Jonathan Alexander Michael Timothy</strong> from your emergency
      contacts?
    </p>

    <p>
      If this contact is set as your primary, your secondary contact will
      automatically become your primary contact.
    </p>
    <template #footer>
      <BButton variant="subdued-danger" @click="cancelModal">Cancel</BButton>
      <BButton variant="danger" @click="removeContact">Remove</BButton>
    </template>
  </BModal>
</template>

<script>
  import { BButton, BModal } from "bootstrap-vue-next";

  export default {
    components: {
      BButton,
      BModal,
    },
    data() {
      return {
        showModal: false,
      };
    },
    methods: {
      cancelModal() {
        // close the modal
        this.showModal = false;
      },
      removeContact() {
        // TODO: API call to remove contact
      },
    },
  };
</script>
