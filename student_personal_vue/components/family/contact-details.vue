<template>
  <!-- check if contact details are empty -->
  <ul v-if="contact && contact.name" class="list-unstyled">
    <li>{{ contact.name }}</li>
    <li v-if="hasMailingAddress" v-html="formatMailingAddress(contact)"></li>
    <li v-if="hasPhoneNumber">{{ formatPhoneNumber(contact.phone_number) }}</li>
  </ul>
  <div v-else class="text-secondary fst-italic">
    No contact information provided.
  </div>
</template>

<script>
  import { formatDate } from "@/utils/dates";
  import { formatPhoneNumber } from "@/utils/phones";
  import { formatMailingAddress } from "@/utils/addresses";

  export default {
    props: {
      contact: {
        type: Object,
      },
    },
    setup() {
      return {
        formatDate,
        formatPhoneNumber,
        formatMailingAddress,
      };
    },
    computed: {
      hasPhoneNumber() {
        return (
          this.contact.phone_number !== null &&
          this.contact.phone_number.trim() !== ""
        );
      },
      hasMailingAddress() {
        return (
            this.contact.address_line_1 !== null &&
            this.contact.address_line_1.trim() !== "" &&
            this.contact.city !== null && this.contact.city.trim() !== "" &&
            this.contact.state !== null && this.contact.state.trim() !== ""
          );
      },
    },
  };
</script>
