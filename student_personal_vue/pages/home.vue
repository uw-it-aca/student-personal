// home.vue

<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>
      {{ pageTitle }}
    </template>
    <template #content>
      <div>personal home</div>
    </template>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/default.vue";

export default {
  name: "PagesHome",
  components: { DefaultLayout },
  data() {
    return { pageTitle: "Personal Home" };
  },
  methods: {},
};
</script>
