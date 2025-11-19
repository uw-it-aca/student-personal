import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ContactDetails from "@/components/contact-details.vue";

describe("ContactDetails", () => {
  it("renders the contact details", () => {
    const wrapper = mount(ContactDetails, {
      props: {
        contactDetails: {
          name: "Hank Average",
          email: "haverage@example.com",
          phoneNumber: "+12065551234",
          lastModified: "2025-11-12T05:28:00Z",
        },
      },
    });

    // Check that the component renders the correct information
    expect(wrapper.text()).toContain("Hank Average");
    expect(wrapper.text()).toContain("haverage@example.com");
    expect(wrapper.text()).toContain("+1 (206) 555-1234");
    expect(wrapper.text()).toContain("Last updated: November 11, 2025 9:28 PM");
  });
});
