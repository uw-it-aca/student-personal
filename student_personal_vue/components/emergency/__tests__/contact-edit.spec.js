import { mount } from "@vue/test-utils";
import {
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormSelect,
  BFormSelectOption,
  BFormText,
  BInputGroup,
  BInputGroupText,
  BModal,
  createBootstrap,
} from "bootstrap-vue-next";
import { createPinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import ContactEdit from "@/components/emergency/contact-edit.vue";
import { useEmergencyContactStore } from "@/stores/emergency-contact.js";

// Mock the SCountryCode component
const SCountryCode = {
  template: '<div class="s-country-code-mock"></div>',
  emits: ["update:calling-code"],
};

describe("ContactModal", () => {
  let wrapper;
  let pinia;

  beforeEach(() => {
    // Mock the django context
    const context = { student: { reg_id: "12345" } };
    const script = document.createElement("script");
    script.id = "django-context-data";
    script.type = "application/json";
    script.textContent = JSON.stringify(context);
    document.body.appendChild(script);

    pinia = createPinia();
    const emergencyContactStore = useEmergencyContactStore(pinia);
    emergencyContactStore.contacts = [
      {
        name: "John Doe",
        phoneNumber: "+442079460958",
        email: "john.doe@example.com",
        relationship: "PARENT",
      },
      {
        name: "Jane Doe",
        phoneNumber: "+912212345678",
        email: "jane.doe@example.com",
        relationship: "GUARDIAN",
      },
    ];

    wrapper = mount(ContactEdit, {
      props: {
        isPrimary: true,
      },
      global: {
        plugins: [createBootstrap(), pinia],
        components: {
          BForm,
          BFormGroup,
          BInputGroup,
          BInputGroupText,
          BFormInput,
          BFormInvalidFeedback,
          BFormText,
          BFormSelect,
          BFormSelectOption,
          BFormCheckbox,
          BButton,
          BModal,
          SCountryCode,
        },
      },
    });
  });

  afterEach(() => {
    // cleanup

    const script = document.getElementById("django-context-data");
    if (script) {
      document.body.removeChild(script);
    }
  });

  it("hides the modal by default", () => {
    expect(wrapper.findComponent(BModal).props("modelValue")).toBe(false);
  });

  it("shows the modal when the 'Edit' button is clicked", async () => {
    await wrapper.findComponent(BButton).trigger("click");
    expect(wrapper.findComponent(BModal).props("modelValue")).toBe(true);
  });
});
