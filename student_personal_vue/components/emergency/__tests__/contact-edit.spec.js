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
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import ContactEdit from "@/components/emergency/contact-edit.vue";
import { useEmergencyContactStore } from "@/stores/emergency-contact.js";
import { updateEmergencyContacts } from "@/utils/data";

// Mock the SCountryCode component
const SCountryCode = {
  template: '<div class="s-country-code-mock"></div>',
  emits: ["update:calling-code"],
};

vi.mock("@/utils/data", () => ({
  updateEmergencyContacts: vi.fn(),
}));

describe("contact-edit.vue", () => {
  let pinia;

  const createWrapper = (isPrimary, storeState = {}) => {
    pinia = createPinia();
    const emergencyContactStore = useEmergencyContactStore(pinia);

    emergencyContactStore.setContacts(storeState || {
      emergency_contacts: [
        {
          name: "John Doe",
          phone_number: "2079460958",
          email: "john.doe@example.com",
          relationship: "PARENT",
        },
        {
          name: "Jane Doe",
          phone_number: "+912212345678",
          email: "jane.doe@example.com",
          relationship: "GUARDIAN",
        },
      ],
    });

    return mount(ContactEdit, {
      props: {
        isPrimary: isPrimary,
      },
      global: {
        plugins: [
          createBootstrap({
            components: { BModal: { teleportDisabled: true } },
          }),
          pinia,
        ],
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
  };

  beforeEach(() => {
    // Mock the django context
    const context = {
      student: { reg_id: "12345" },
      emergencyContactUrl: "/api/emergency-contact",
    };
    const script = document.createElement("script");
    script.id = "django-context-data";
    script.type = "application/json";
    script.textContent = JSON.stringify(context);
    document.body.appendChild(script);
  });

  afterEach(() => {
    // cleanup
    const script = document.getElementById("django-context-data");
    if (script) {
      document.body.removeChild(script);
    }
    vi.clearAllMocks();
  });

  it("hides the modal by default", () => {
    const wrapper = createWrapper(true);
    expect(wrapper.findComponent(BModal).props("modelValue")).toBe(false);
  });

  it("shows the modal when the 'Edit' button is clicked", async () => {
    const wrapper = createWrapper(true);
    await wrapper.findComponent(BButton).trigger("click");
    expect(wrapper.findComponent(BModal).props("modelValue")).toBe(true);
  });

  describe("when primary contact modal is open", () => {
    let wrapper;

    beforeEach(async () => {
      wrapper = createWrapper(true);
      await wrapper.findComponent(BButton).trigger("click");
    });

    it('displays "Primary" in the modal title', () => {
      expect(wrapper.findComponent(BModal).props("title")).toBe("Primary");
    });

    it("loads the primary contact data into the form", () => {
      expect(wrapper.find("#inputFullName").element.value).toBe("John Doe");
      expect(wrapper.find("#inputPhoneNumber").element.value).toBe(
        "2079460958",
      );
      expect(wrapper.find("#inputEmailAddress").element.value).toBe(
        "john.doe@example.com",
      );
      expect(wrapper.find("#selectRelationshipChoice").element.value).toBe(
        "PARENT",
      );
      expect(wrapper.vm.formCountryCode).toBe("44");
    });

    it("closes the modal when the 'Cancel' button is clicked", async () => {
      const cancelButton = wrapper
        .findAllComponents(BButton)
        .find((b) => b.text() === "Cancel");
      await cancelButton.trigger("click");
      expect(wrapper.findComponent(BModal).props("modelValue")).toBe(false);
    });
  });

  describe("when secondary contact modal is open", () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = createWrapper(false);
      await wrapper.findComponent(BButton).trigger("click");
    });

    it('displays "Secondary" in the modal title', () => {
      expect(wrapper.findComponent(BModal).props("title")).toBe("Secondary");
    });

    it("loads the secondary contact data into the form", () => {
      expect(wrapper.find("#inputFullName").element.value).toBe("Jane Doe");
      expect(wrapper.find("#inputPhoneNumber").element.value).toBe(
        "2212345678",
      );
      expect(wrapper.find("#inputEmailAddress").element.value).toBe(
        "jane.doe@example.com",
      );
      expect(wrapper.find("#selectRelationshipChoice").element.value).toBe(
        "GUARDIAN",
      );
      expect(wrapper.vm.formCountryCode).toBe("91");
    });
  });

  describe("when contact has no phone number", () => {
    it("initializes with default US country code", () => {
      const wrapper = createWrapper(true, {
        emergency_contacts: [
          {
            name: "John Doe",
            phone_number: "", // Empty phone number
            email: "john.doe@example.com",
            relationship: "PARENT",
          },
        ],
      });
      expect(wrapper.vm.formContact.country_code).toBe("1");
      expect(wrapper.vm.formContact.phone_number_valid).toBe(null);
    });
  });

  describe("when loading contact with incomplete data", () => {
    it("sets validation states to null for empty/invalid fields", () => {
      const wrapper = createWrapper(true, {
        emergency_contacts: [
          {
            name: "",
            phone_number: "+1234567890",
            email: "",
            relationship: "",
          },
        ],
      });

      expect(wrapper.vm.formContact.name_valid).toBe(null);
      expect(wrapper.vm.formContact.email_valid).toBe(null);
      expect(wrapper.vm.formContact.relationship_valid).toBe(null);
    });
  });

  describe("form validation", () => {
    let wrapper;

    beforeEach(async () => {
      wrapper = createWrapper(true);
      await wrapper.findComponent(BButton).trigger("click");
    });

    it("validates full name correctly", async () => {
      const nameInput = wrapper.find("#inputFullName");

      await nameInput.setValue("John Doe");
      await nameInput.trigger("blur");
      expect(wrapper.vm.formContact.name_valid).toBe(true);

      await nameInput.setValue("John123");
      await nameInput.trigger("blur");
      expect(wrapper.vm.formContact.name_valid).toBe(true);

      await nameInput.setValue("John Doe-Smith. '");
      await nameInput.trigger("blur");
      expect(wrapper.vm.formContact.name_valid).toBe(true);

      await nameInput.setValue("John Doe$");
      await nameInput.trigger("blur");
      expect(wrapper.vm.formContact.name_valid).toBe(false);

      await nameInput.setValue("");
      await nameInput.trigger("blur");
      expect(wrapper.vm.formContact.name_valid).toBe(null);
    });

    it("validates phone number correctly", async () => {
      const phoneInput = wrapper.find("#inputPhoneNumber");

      await phoneInput.setValue("222-123-4567");
      await phoneInput.trigger("blur");
      expect(wrapper.vm.formContact.phone_number_valid).toBe(true);

      await phoneInput.setValue("2221234567");
      await phoneInput.trigger("blur");
      expect(wrapper.vm.formContact.phone_number_valid).toBe(true);

      await phoneInput.setValue("(222) 123-4567");
      await phoneInput.trigger("blur");
      expect(wrapper.vm.formContact.phone_number_valid).toBe(true);

      await phoneInput.setValue("123-4567");
      await phoneInput.trigger("blur");
      expect(wrapper.vm.formContact.phone_number_valid).toBe(false);

      await phoneInput.setValue("invalid-phone");
      await phoneInput.trigger("blur");
      expect(wrapper.vm.formContact.phone_number_valid).toBe(false);
    });

    it("updates the country code when SCountryCode emits an event", async () => {
      const countryCodeComponent = wrapper.findComponent(SCountryCode);
      await countryCodeComponent.vm.$emit("update:calling-code", "49");
      expect(wrapper.vm.countryCode).toBe("49");
      const countryCodeText = wrapper.findComponent(BInputGroupText);
      expect(countryCodeText.text()).toContain("+49");
    });

    it("validates email address correctly", async () => {
      const emailInput = wrapper.find("#inputEmailAddress");

      await emailInput.setValue("test@example.com");
      await emailInput.trigger("blur");
      expect(wrapper.vm.formContact.email_valid).toBe(true);

      await emailInput.setValue("invalid-email");
      await emailInput.trigger("blur");
      expect(wrapper.vm.formContact.email_valid).toBe(false);

      await emailInput.setValue("");
      await emailInput.trigger("blur");
      expect(wrapper.vm.formContact.email_valid).toBe(null);
    });

    it("validates relationship choice correctly", async () => {
      const relationshipSelect = wrapper.find("#selectRelationshipChoice");

      await relationshipSelect.setValue("PARENT");
      await relationshipSelect.trigger("blur");
      expect(wrapper.vm.formContact.relationship_valid).toBe(true);

      await relationshipSelect.setValue("");
      await relationshipSelect.trigger("blur");
      expect(wrapper.vm.relationship_valid).toBe(null);
    });

    it("updates formPrimary when checkbox is clicked", async () => {
      const secondaryWrapper = createWrapper(false);
      await secondaryWrapper.findComponent(BButton).trigger("click");

      const primaryCheckbox = secondaryWrapper.find("#checkboxPrimaryContact");
      expect(primaryCheckbox.attributes("disabled")).toBe(undefined);
      expect(secondaryWrapper.vm.formPrimary).toBe(false);

      await primaryCheckbox.setChecked();
      expect(secondaryWrapper.vm.formPrimary).toBe(true);
    });
  });

  describe("saveContact", () => {
    let wrapper;
    let emergencyContactStore;

    beforeEach(async () => {
      wrapper = createWrapper(true);
      emergencyContactStore = useEmergencyContactStore(pinia);
      await wrapper.findComponent(BButton).trigger("click");
    });

    it("updates store and calls API on successful save", async () => {
      updateEmergencyContacts.mockResolvedValue({});
      const storeUpdateSpy = vi.spyOn(emergencyContactStore, "putData", "get");

      await wrapper.find("#inputFullName").setValue("Johnathan Doe");
      const saveButton = wrapper
        .findAllComponents(BButton)
        .find((b) => b.text() === "Save");
      await saveButton.trigger("click");

      expect(storeUpdateSpy).toHaveBeenCalled();
      expect(updateEmergencyContacts).toHaveBeenCalled();
      await nextTick();
      expect(wrapper.vm.showModal).toBe(false);
    });

    it("does not update store or call API if validation fails", async () => {
      updateEmergencyContacts.mockResolvedValue({});
      const storeUpdateSpy = vi.spyOn(emergencyContactStore, "putData", "get");

      await wrapper.find("#inputFullName").setValue("");

      const saveButton = wrapper
        .findAllComponents(BButton)
        .find((b) => b.text() === "Save");
      await saveButton.trigger("click");

      expect(storeUpdateSpy).not.toHaveBeenCalled();
      expect(updateEmergencyContacts).not.toHaveBeenCalled();
      expect(wrapper.vm.showModal).toBe(true);
    });

    it("reorders contacts if secondary is made primary", async () => {
      const secondaryWrapper = createWrapper(false);
      const secondaryStore = useEmergencyContactStore(pinia);
      await secondaryWrapper.findComponent(BButton).trigger("click");

      updateEmergencyContacts.mockResolvedValue({});
      const storeReorderSpy = vi.spyOn(secondaryStore, "reorderContacts");

      await secondaryWrapper.find("#checkboxPrimaryContact").setChecked();

      const saveButton = secondaryWrapper
        .findAllComponents(BButton)
        .find((b) => b.text() === "Save");
      await saveButton.trigger("click");

      expect(storeReorderSpy).toHaveBeenCalled();
    });

    it("handles API error on save", async () => {
      const error = { data: "Error saving" };
      updateEmergencyContacts.mockRejectedValue(error);

      const saveButton = wrapper
        .findAllComponents(BButton)
        .find((b) => b.text() === "Save");
      await saveButton.trigger("click");

      await nextTick();
      await nextTick();

      expect(wrapper.vm.errorResponse).toEqual(error.data);
      expect(wrapper.vm.showModal).toBe(false);
    });
  });
});
