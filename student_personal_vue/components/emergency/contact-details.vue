<template>
  <!-- check if contact details are empty -->
  <ul v-if="contact && contact.name" class="list-unstyled">
    <li>{{ contact.name }}</li>
    <li>{{ contact.email }}</li>
    <li v-if="contact.phone_number">
      {{ formattedPhoneNumber }}
    </li>
    <li v-if="contact.relationship">
      {{ contact.relationship }}
    </li>
    <li v-if="contact.last_modified" class="text-secondary fst-italic">
      Last updated: {{ formattedLastUpdated }}
    </li>
  </ul>
  <div v-else class="text-secondary fst-italic">
    No contact information provided.
  </div>
</template>

<script>
  import { formatUTCToLocalDate } from "@/utils/dates";
  import { formatPhoneNumber } from "@/utils/phones";

  export default {
    props: {
      contact: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {
        formatUTCToLocalDate,
        formatPhoneNumber,
      };
    },
    computed: {
      formattedLastUpdated() {
        return formatUTCToLocalDate(this.contact.last_modified, "LLL");
      },
      formattedPhoneNumber() {
        return (this.contact.phone_number !== null &&
          this.contact.phone_number.trim() !== "")
            ? formatPhoneNumber(this.contact.phone_number) : "";
      },
    },
  };
</script>
