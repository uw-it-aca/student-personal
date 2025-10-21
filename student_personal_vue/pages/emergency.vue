// home.vue

<template>
  <DefaultLayout :page-title="pageTitle">
    <!-- page content -->
    <template #title>
      {{ pageTitle }}
    </template>
    <template #content>
      <div class="mb-3">
        <label for="inputPassword5" class="form-label">Phone Number</label>
        <div class="input-group">
          <SCountryCode @update:calling-code="emergencyCallingCode1 = $event" />
          <input
            type="hidden"
            name="emergencyCallingCode1"
            :value="'+' + emergencyCallingCode1"
          />
          <span class="input-group-text border border-secondary"
            >+{{ emergencyCallingCode1 }}</span
          >
          <input
            type="text"
            class="form-control"
            pattern="[0-9]+"
            required
            minlength="10"
            maxlength="12"
            title="Enter a valid mobile number"
          />
        </div>
        <input type="hidden" class="country-code-input" />
        <div id="passwordHelpBlock" class="form-text">
          Your area code and phone number must be 10-12 characters. Example
          format: xxx-xxx-xxxx
        </div>
      </div>
    </template>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/default.vue";
import { SCountryCode } from "solstice-vue";

export default {
  name: "PagesEmergency",
  components: { DefaultLayout, SCountryCode },
  data() {
    return {
      pageTitle: "Emergency Contacts",
      emergencyCallingCode1: "1", // default to US
    };
  },
  methods: {},
};
</script>
