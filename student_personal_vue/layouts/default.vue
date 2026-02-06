<template>
  <!-- layout.vue: this is where you override the layout -->
  <STopbarNeo
    :app-name="appName"
    :app-root-url="appRootUrl"
    :page-title="pageTitle"
    :background-class="'bg-body'"
  >
    <template #settings>
      <SUser
        :user-netid="contextStore.context.loginUser"
        :user-override="
          contextStore.context.overrideUser !== contextStore.context.loginUser
            ? contextStore.context.overrideUser
            : null
        "
        :photo-url="
          contextStore.context.isStudent ? contextStore.context.photoUrl : null
        "
        data-clarity-mask="True"
      >
        <div class="fw-bold mb-1" data-clarity-mask="True">
          {{ contextStore.context.displayName }}
        </div>
        <ul class="list-unstyled text-secondary">
          <li
            v-if="
              contextStore.context.overrideUser !==
              contextStore.context.loginUser
            "
            data-clarity-mask="True"
          >
            {{ contextStore.context.overrideUser }}
          </li>
          <li v-else data-clarity-mask="True">
            {{ contextStore.context.loginUser }}
          </li>
          <li
            v-if="contextStore.context.pronouns !== null"
            class="text-lowercase"
            data-clarity-mask="True"
          >
            {{ contextStore.context.pronouns }}
          </li>
          <li data-clarity-mask="True">
            {{ contextStore.context.studentNumber }}
          </li>
        </ul>

        <ul class="list-unstyled">
          <li>
            <a href="https://identity.uw.edu" class="link-quiet-body"
              ><i class="bi bi-pencil me-2"></i>Edit in Identity.UW</a
            >
          </li>
        </ul>

        <template #action>
          <a
            v-if="
              contextStore.context.overrideUser !==
              contextStore.context.loginUser
            "
            role="button"
            class="link-quiet-danger"
            @click="clearUserOverride()"
            ><i class="bi bi-x-circle me-2"></i>Clear override</a
          >

          <a
            v-else
            :href="contextStore.context.signoutUrl"
            class="link-quiet-danger"
            ><i class="bi bi-box-arrow-left me-2"></i>Sign out</a
          >
        </template>
      </SUser>
      <SColorMode color-class="text-white" class="ms-2" />
    </template>

    <!--<template #navigation>
      <NavMenu/>
    </template>-->

    <!-- TODO: hide system messages if empty -->
    <template v-if="window.student_personal.messages.length > 0" #system>
      <div class="row">
        <div class="col">
          <ul
            class="list-unstyled text-info-emphasis small m-0 py-2 text-center"
          >
            <li
              v-for="(message, index) in window.student_personal.messages"
              :key="index"
              v-html="message"
            />
          </ul>
        </div>
      </div>
    </template>

    <template #main>
      <div class="row justify-content-between my-5">
        <div class="col-md-9">
          <h1 class="ff-encode-sans fw-semibold mb-5">{{ pageTitle }}</h1>
          <slot name="content"></slot>
        </div>
        <div class="col-md-3">
          <BCard class="bg-body-tertiary rounded-3 mb-3" border-variant="0">
            <h3 class="h5 ff-encode-sans card-title">Additional Resources</h3>
            <ul class="list-unstyled m-0">
              <li>
                <BLink href="https://my.uw.edu" class="link-quiet-primary">
                  MyUW
                </BLink>
              </li>
              <li>
                <BLink
                  href="https://identity.uw.edu"
                  class="link-quiet-primary"
                >
                  Identity.UW
                </BLink>
              </li>
            </ul>
          </BCard>
          <slot name="sidebar"></slot>
        </div>
      </div>
    </template>
    <template #footer></template>
  </STopbarNeo>
</template>

<script>
  import { BCard, BLink } from "bootstrap-vue-next";
  import { SColorMode, SProfile, STopbarNeo, SUser } from "solstice-vue";
  import NavMenu from "@/components/_nav-menu.vue";
  import { useContextStore } from "@/stores/context";
  import { clearOverride } from "@/utils/data";

  export default {
    name: "PersonaInformationApp",
    components: {
      BCard,
      BLink,
      NavMenu,
      STopbarNeo,
      SProfile,
      SUser,
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
        appName: "Student Contacts",
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
