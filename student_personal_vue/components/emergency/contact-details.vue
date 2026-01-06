<template>
  <!-- check if contact details are empty -->
  <ul v-if="contact && contact.name" class="list-unstyled">
    <li>{{ contact.name }}</li>
    <li>{{ contact.email }}</li>
    <li v-if="contact.phone_number">
      {{ formattedPhoneNumber }}
    </li>
    <li v-if="contact.relationship">
      {{ formattedRelationship }}
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
  import { parsePhoneNumber } from "libphonenumber-js";
  import { formatUTCToLocalDate } from "@/utils/dates";

  export default {
    props: {
      contact: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {
        parsePhoneNumber,
        formatUTCToLocalDate,
      };
    },
    computed: {
      formattedLastUpdated() {
        try {
          return formatUTCToLocalDate(this.contact.last_modified, "LLL");
        } catch (error) {
          return "";
        }
      },
      formattedPhoneNumber() {
        try {
          const parsed = parsePhoneNumber(this.contact.phone_number);
          return (parsed.countryCallingCode === "1")
            ? parsed.formatNational() : parsed.formatInternational();
        } catch (error) {
          return "";
        }
      },
      formattedRelationship() {
        try {
          return this.contact.relationship.charAt(0).toUpperCase() +
            this.contact.relationship.substr(1).toLowerCase();
        } catch (error) {
          return "";
        }
      },
    },
  };
</script>
