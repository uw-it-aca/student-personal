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
      --
      </template>
    </li>
    <li v-if="contact.phone_number" data-clarity-mask="True">
      <template v-if="contact.phone_number_formatted">
        {{ contact.phone_number_formatted }}
      </template>
      <template v-else>
      --
      </template>
    </li>
    <li v-if="contact.relationship" data-clarity-mask="True">
      <BBadge
        pill
        bg-variant="deco-violet-subtle"
        text-variant="deco-violet-emphasis"
        class="fw-semibold me-1"
      >
        {{ formattedRelationship }}
      </BBadge>
    </li>
    <li v-else data-clarity-mask="True">
      <BBadge
        pill
        bg-variant="secondary-subtle"
        text-variant="secondary-emphasis"
        class="fw-semibold me-1"
      >
        Not specifed
      </BBadge>
    </li>
    <li v-if="contact.last_modified" class="text-secondary fst-italic mt-2">
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
