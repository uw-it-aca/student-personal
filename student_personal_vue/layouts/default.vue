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
      <SColorMode color-class="text-white" class="ms-2"/>
    </template>

    <template #navigation>
      <NavMenu/>
    </template>

    <!-- TODO: hide system messages if empty -->
    <template v-if="window.student_personal.messages.length > 0" #system>
      <div class="row">
        <div class="col">
          <ul
            class="list-unstyled py-2 m-0 text-center text-info-emphasis small"
          >
            <li
              v-for="(message, index) in window.student_personal.messages"
              :key="index"
              class=""
              v-html="message"
            ></li>
          </ul>
        </div>
      </div>
    </template>

    <template #main>
      <div class="row justify-content-center my-5">
        <div class="col-6">
          <h1 class="ff-encode-sans fw-bold mb-5">{{ pageTitle }}</h1>
          <slot name="content"></slot>
        </div>
      </div>
    </template>
    <template #footer></template>
  </STopbarNeo>
</template>

<script>
  import { SColorMode, SProfile, STopbarNeo } from "solstice-vue";
  import NavMenu from "@/components/_nav-menu.vue";
  import { useContextStore } from "@/stores/context";
  import { clearOverride } from "@/utils/data";

  export default {
    name: "PersonaInformationApp",
    components: {
      NavMenu,
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
          .then((data) => {
            console.log("Override cleared:", data);
          })
          .catch((error) => {
            console.error("Error clearing override:", error);
          })
          .finally(() => {
            window.location.href = this.contextStore.context.clearOverrideUrl;
          });
      },
    },
  };
</script>
