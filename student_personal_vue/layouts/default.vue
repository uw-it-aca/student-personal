<!-- eslint-disable vue/no-v-html -->
<template>
  <!-- layout.vue: this is where you override the layout -->
  <STopbarNeo
    :app-name="appName"
    :app-dept-name="deptName"
    :app-root-url="appRootUrl"
    :page-title="pageTitle"
    :background-class="'bg-body'"
  >
    <template #settings>
      <SColorMode color-class="text-white" class="ms-2" />
    </template>

    <template #navigation>
      <!-- Bootstrap navbar-nav classes -->
      <ul class="navbar-nav text-white me-auto my-2 my-xl-0">
        <li class="nav-item me-5">
          <a class="nav-link text-white px-0" href="#">Registration</a>
        </li>
        <li class="nav-item me-5">
          <a class="nav-link text-white px-0" href="#">Finances</a>
        </li>
        <li class="nav-item dropdown me-5">
          <a
            class="nav-link px-0 text-white dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Personal Information
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/">Profile</a></li>
            <li><a class="dropdown-item" href="/emergency">Emergency Contacts</a></li>
            <li><a class="dropdown-item" href="/">Address &amp; Consent</a></li>
          </ul>
        </li>
      </ul>

    </template>

    <!-- TODO: hide system messages if empty -->
    <template #system>
      <div class="row">
        <div class="col">
          <ul
            class="list-unstyled py-2 m-0 text-center text-info-emphasis small"
          >
            <li
            >Welcome to SPS</li>
          </ul>
        </div>
      </div>
    </template>

    <template #main>
      <div class="row my-5">
        <div class="col">
          <slot name="content"></slot>
        </div>
      </div>
    </template>
    <template #footer></template>
  </STopbarNeo>
</template>

<script>

import { STopbarNeo, SColorMode } from "solstice-vue";

export default {
  name: "PersonaInformationApp",
  components: {
    STopbarNeo,
    SColorMode,
  },

  data() {
    return {
      appName: "Personal Information",
      deptName: "Student Personal Services",
      appRootUrl: "/",
      pageTitle: "Profile"
    };
  },
  computed: {
  },
  created: function () {
    // constructs page title in the following format "Page Title - AppName"
    document.title = this.pageTitle + " - " + this.appName;
  },
  methods: {
  },
};
</script>



