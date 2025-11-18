<template>
  <!-- check if contact details are empty -->
  <p>{{ contactDetails }}</p>
  <ul v-if="contactDetails" class="list-unstyled">
    <li>{{ contactDetails.name }}</li>
    <li>{{ contactDetails.email }}</li>
    <li>
      {{ this.formatE164ToPhoneNumber(contactDetails.phoneNumber) }}
    </li>
    <li v-if="contactDetails.relationship">
      {{ contactDetails.relationship }}
    </li>
    <li v-if="contactDetails.lastUpdated" class="text-secondary fst-italic">
      Last updated: {{ contactDetails.lastUpdated }}
    </li>
  </ul>
  <div v-else class="text-secondary fst-italic">
    No contact information provided.
  </div>
</template>

<script>
import parsePhoneNumber, { formatPhoneNumberIntl } from "libphonenumber-js";

export default {
  props: {
    contactDetails: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    formatE164ToPhoneNumber(e164Number) {
      const phoneNumber = parsePhoneNumber(e164Number);

      if (phoneNumber && phoneNumber.isValid()) {
        const countryCode = `+${phoneNumber.countryCallingCode}`;
        const nationalFormat = phoneNumber.formatNational();

        // Combine them: "+1" + " (213) 373-4253"
        // Note: This works well for NANPA regions (US, Canada, etc.)
        return `${countryCode} ${nationalFormat}`;
      } else {
        console.error(`Invalid or unsupported E.164 number: ${e164Number}`);
        return null;
      }
    },
  },
};
</script>
