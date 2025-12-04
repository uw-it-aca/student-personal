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
import { describe, expect, it } from "vitest";

import ContactEdit from "@/components/emergency/contact-edit.vue";

// Mock the SCountryCode component
const SCountryCode = {
  template: '<div class="s-country-code-mock"></div>',
  emits: ["update:calling-code"],
};

describe("ContactModal", () => {
  const wrapper = mount(ContactEdit, {
    props: {
      modalData: [
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
      ],
    },
    global: {
      plugins: [createBootstrap()],
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

  it("hides the modal by default", () => {
    expect(wrapper.findComponent(BModal).props("modelValue")).toBe(false);
  });

  it("shows the modal when the 'Edit' button is clicked", async () => {
    await wrapper.findComponent(BButton).trigger("click");
    expect(wrapper.findComponent(BModal).props("modelValue")).toBe(true);
  });
});
