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
      <SProfile
        v-if="
          contextStore.context.overrideUser != contextStore.context.loginUser
        "
        :variant="'flyout'"
        :user-netid="contextStore.context.loginUser"
        :user-override="contextStore.context.overrideUser"
        :user-preferred-name="contextStore.context.displayName"
      >
        <div>lorem ipsum dolor sit amet</div>
        <button
          class="btn btn-link btn-sm text-danger p-0 m-0 border-0"
          value="Clear override"
          @click="clearUserOverride()"
        >
          Clear override
        </button>
      </SProfile>
      <SProfile
        v-else
        variant="flyout"
        :user-netid="contextStore.context.loginUser"
        :user-preferred-name="contextStore.context.displayName"
      >
        <div>lorem ipsum dolor sit amet</div>
        <a :href="contextStore.context.signoutUrl" class=""> Sign out </a>
      </SProfile>
      <SColorMode color-class="text-white" class="ms-2" />
    </template>

    <template #navigation>
      <!-- Bootstrap navbar-nav classes -->
      <ul class="navbar-nav text-white me-auto my-2 my-xl-0">
        <li class="nav-item me-5">
          <a class="nav-link text-white px-0" href="https://register.uw.edu"
            >Registration</a
          >
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
            <li>
              <a class="dropdown-item" href="/emergency">Emergency Contacts</a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="https://sdb.admin.uw.edu/sisStudents/uwnetid/address.aspx"
                >Address and Consent</a
              >
            </li>
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
            <li>Welcome to SPS</li>
          </ul>
        </div>
      </div>
    </template>

    <template #main>
      <div class="row justify-content-center my-5">
        <div class="col-6">
          <h1 class="h1 fw-bold mb-5">{{ pageTitle }}</h1>
          <slot name="content"></slot>
        </div>
      </div>
    </template>
    <template #footer></template>
  </STopbarNeo>
</template>

<script>
import { SColorMode, SProfile, STopbarNeo } from "solstice-vue";
import { useContextStore } from "@/stores/context";
import { clearOverride } from "@/utils/data";

export default {
  name: "PersonaInformationApp",
  components: {
    STopbarNeo,
    SProfile,
    SColorMode,
  },
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
  },
  setup() {
    const contextStore = useContextStore();
    return {
      contextStore,
      clearOverride,
    };
  },
  data() {
    return {
      appName: "Personal Information",
      deptName: "Student Personal Services",
      appRootUrl: "/",
    };
  },
  computed: {},
  created: function () {
    // constructs page title in the following format "Page Title - AppName"
    // document.title = this.pageTitle + " - " + this.appName;
    document.title = `${this.pageTitle} - ${this.appName}`;
  },
  methods: {
    clearUserOverride: function () {
      this.clearOverride(this.contextStore.context.clearOverrideUrl)
        .then((data) => {})
        .catch((error) => {})
        .finally(() => {
          window.location.href = this.contextStore.context.clearOverrideUrl;
        });
    },
  },
};
</script>
