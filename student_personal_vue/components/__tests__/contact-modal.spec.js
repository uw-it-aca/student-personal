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
} from "bootstrap-vue-next";
import { describe, expect, flushPromises, it, vi } from "vitest";
import { nextTick } from "vue";

import ContactModal from "@/components/contact-modal.vue";

// Mock the SCountryCode component
const SCountryCode = {
  template: '<div class="s-country-code-mock"></div>',
  emits: ["update:calling-code"],
};

describe("ContactModal", () => {
  const wrapper = mount(ContactModal, {
    props: {
      modalData: [
        {
          name: "John Smith",
          phoneNumber: "+1234567890",
          email: "john.smith@example.com",
          relationship: "FRIEND",
        },
        {
          name: "Jane Doe",
          phoneNumber: "+1987654321",
          email: "jane.doe@example.com",
          relationship: "OTHER",
        },
      ],
      isPrimary: true,
    },
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
