import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import ContactDetails from "@/components/contact-details.vue";

describe("ContactDetails", () => {
  it("renders the contact details", () => {
    const wrapper = mount(ContactDetails);

    // Check that the component renders the correct information
    expect(wrapper.text()).toContain("Johh Doe");
    expect(wrapper.text()).toContain("john.doe@example.com");
    expect(wrapper.text()).toContain("+1 123-456-7890");
    expect(wrapper.text()).toContain("Last updated 8/7/25 2:40PM PDT");
  });
});
