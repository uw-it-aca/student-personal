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
          phone_number: "+12065551234",
          phone_number_formatted: "(206) 555-1234",
          relationship: "PARENT",
        },
      },
    });

    // Check that the component renders the correct information
    expect(wrapper.text()).toContain("Hank Average");
    expect(wrapper.text()).toContain("haverage@example.com");
    expect(wrapper.text()).toContain("(206) 555-1234");
    expect(wrapper.vm.formattedRelationship).toBe("Parent");
  });
});
