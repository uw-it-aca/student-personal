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
    <p>primary: {{ this.isPrimary }}</p>
    <p>
      Are you sure you want to remove
      <template v-if="this.isPrimary">
        <strong>{{ this.modalData[0].name }}</strong>
      </template>
      <template v-else>
        <strong>{{ this.modalData[1].name }}</strong>
      </template>
      from your emergency contacts?
    </p>

    <p>
      If this contact is set as your primary, your secondary contact will
      automatically become your primary contact.
    </p>

    <div class="border p-2 small mb-3">
      <p>remove contact:</p>
      <template v-if="this.isPrimary">
        <p>{{ this.modalData[0] }}</p>
      </template>
      <template v-else>
        <p>{{ this.modalData[1] }}</p>
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

  export default {
    components: {
      BButton,
      BModal,
    },
    props: {
      modalHeaderTitle: {
        type: String,
        required: true,
      },
      modalData: {
        type: Array,
        required: true,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
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
