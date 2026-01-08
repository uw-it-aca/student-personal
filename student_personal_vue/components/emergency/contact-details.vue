<template>
  <!-- check if contact details are empty -->
  <ul v-if="contact && contact.name" class="list-unstyled">
    <li>{{ contact.name }}</li>
    <li>{{ contact.email }}</li>
    <li v-if="contact.phone_number">
      {{ contact.phone_number_formatted }}
    </li>
    <li v-if="contact.relationship">
      {{ formattedRelationship }}
    </li>
  </ul>
  <div v-else class="text-secondary fst-italic">
    No contact information provided.
  </div>
</template>

<script>
  export default {
    props: {
      contact: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {};
    },
    computed: {
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
