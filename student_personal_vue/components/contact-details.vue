<template>
  <p>{{ contactDetails }}</p>
  <p>
    Johh Doe<br />
    john.doe@example.com<br />
    +1 123-456-7890<br />
  </p>
  <p class="text-secondary fst-italic">Last updated 8/7/25 2:40PM PDT</p>
</template>

<script>
export default {
  props: {
    contactDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
