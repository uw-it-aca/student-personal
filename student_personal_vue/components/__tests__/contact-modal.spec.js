import { describe, flushPromises, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import {
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
} from "bootstrap-vue-next";

import ContactModal from "@/components/contact-modal.vue";

// Mock the SCountryCode component
const SCountryCode = {
  template: '<div class="s-country-code-mock"></div>',
  emits: ["update:calling-code"],
};

describe("ContactModal", () => {
  const wrapper = mount(ContactModal, {
    global: {
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

  it("renders the cancel and save buttons in the footer", () => {
    const buttons = wrapper.findAllComponents(BButton);
    expect(buttons).toHaveLength(3);
    expect(buttons[1].text()).toBe("Cancel");
    expect(buttons[2].text()).toBe("Save");
  });
});
