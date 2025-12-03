<template>
  <!-- check if contact details are empty -->
  <ul v-if="contactDetails && contactDetails.name" class="list-unstyled">
    <li>{{ contactDetails.name }}</li>
    <li>{{ contactDetails.email }}</li>
    <li v-if="contactDetails.phoneNumber !== null || contactDetails.phoneNumber.trim() !== ''">{{ formatPhoneNumber(contactDetails.phoneNumber) }}</li>
    <li v-if="contactDetails.relationship">
      {{ contactDetails.relationship }}
    </li>
    <li v-if="contactDetails.lastModified" class="text-secondary fst-italic">
      Last updated:
      {{ formatDate(contactDetails.lastModified, "LLL") }}
    </li>
  </ul>
  <div v-else class="text-secondary fst-italic">
    No contact information provided.
  </div>
</template>

<script>
  import { formatDate } from "@/utils/dates";
  import { formatPhoneNumber } from "@/utils/phones";

  export default {
    props: {
      contactDetails: {
        type: Object,
      },
    },
    setup() {
      return {
        formatDate,
        formatPhoneNumber,
      };
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>
