<template>
  <!-- check if contact details are empty -->
  <p>{{ contactDetails }}</p>
  <ul v-if="contactDetails" class="list-unstyled">
    <li>{{ contactDetails.name }}</li>
    <li>{{ contactDetails.email }}</li>
    <li>{{ contactDetails.phone }}</li>
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
export default {
  props: {
    contactDetails: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
