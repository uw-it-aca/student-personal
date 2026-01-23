<template>
  <!-- check if contact object AND name are provided -->
  <ul v-if="contact && contact.name" class="list-unstyled">
    <li data-clarity-mask="True">
      <template v-if="contact.name">
        {{ contact.name }}
      </template>
      <template v-else>
      --
      </template>
    </li>
    <li data-clarity-mask="True">
      <template v-if="contact.email">
        {{ contact.email }}
      </template>
      <template v-else>
        <span class="text-secondary fst-italic text-underline">--</span>
      </template>
    </li>
    <li data-clarity-mask="True">
      <template v-if="contact.phone_number_formatted">
        {{ contact.phone_number_formatted }}
      </template>
      <template v-else>
        <span class="text-secondary fst-italic">--</span>
      </template>
    </li>
    <li data-clarity-mask="True">
      <template v-if="contact.relationship">
        {{ formattedRelationship }}
      </template>
      <template v-else>
        <span class="text-secondary fst-italic text-underline">--</span>
      </template>
    </li>
    <li v-if="contact.last_modified" class="text-secondary fst-italic mt-3">
      Last updated: {{ contact.last_modified_formatted }}
    </li>
  </ul>
  <div v-else class="text-secondary fst-italic">
    No contact information provided.
  </div>
</template>

<script>
  import { BBadge } from "bootstrap-vue-next";

  export default {
    components: {
      BBadge,
    },
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
          return (
            this.contact.relationship.charAt(0).toUpperCase() +
            this.contact.relationship.substr(1).toLowerCase()
          );
        } catch (error) {
          return "";
        }
      },
    },
  };
</script>
