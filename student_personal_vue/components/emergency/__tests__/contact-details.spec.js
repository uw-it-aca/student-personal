import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ContactDetails from "@/components/emergency/contact-details.vue";

describe("ContactDetails", () => {
  it("renders the contact details", () => {
    const wrapper = mount(ContactDetails, {
      props: {
        contact: {
          name: "Hank Average",
          email: "haverage@example.com",
          phone_number: "2065551234",
          e164_phone_number: "+12065551234",
          country_code: "1",
          last_modified: "2025-11-12T05:28:00Z",
          relationship: "PARENT",
        },
      },
    });

    // Check that the component renders the correct information
    expect(wrapper.text()).toContain("Hank Average");
    expect(wrapper.text()).toContain("haverage@example.com");
    expect(wrapper.vm.formattedPhoneNumber).toBe("+1 (206) 555-1234");
    expect(wrapper.vm.formattedLastUpdated).toBe("November 11, 2025 9:28 PM");
    expect(wrapper.vm.formattedRelationship).toBe("Parent");
  });
});
