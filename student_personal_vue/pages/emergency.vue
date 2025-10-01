// home.vue

<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>
      {{ pageTitle }}
    </template>
    <template #content>
      <div>emergency contacts</div>
    </template>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/default.vue";

export default {
  name: "PagesEmergency",
  components: { DefaultLayout },
  data() {
    return { pageTitle: "Emergency Contacts" };
  },
  methods: {},
};
</script>
