import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useEmergencyContactStore } from "../emergency-contact";

describe("Emergency Contact Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("computes hasContacts", () => {
    const store = useEmergencyContactStore();
    expect(store.hasContacts).toBe(false);

    store.contacts = [
      {
        name: "Primary Contact",
      },
    ];
    expect(store.hasContacts).toBe(true);
  });

  it("reorders contacts", () => {
    const store = useEmergencyContactStore();
    store.contacts = [
      {
        id: 1,
        name: "Primary Contact",
      },
      {
        id: 2,
        name: "Secondary Contact",
      },
    ];
    expect(store.contacts[0].id).toBe(1);
    expect(store.contacts[1].id).toBe(2);

    store.reorderContacts();

    expect(store.contacts[0].id).toBe(2);
    expect(store.contacts[1].id).toBe(1);
  });

  it("removes primary contact", () => {
    const store = useEmergencyContactStore();
    store.contacts = [
      {
        id: 1,
        name: "Primary Contact",
      },
      {
        id: 2,
        name: "Secondary Contact",
      },
    ];
    expect(store.contacts.length).toBe(2);

    store.removeContact(true);

    expect(store.contacts.length).toBe(2);
    expect(store.contacts[0].is_deleted).toBe(true);
  });

  it("removes secondary contact", () => {
    const store = useEmergencyContactStore();
    store.contacts = [
      {
        id: 1,
        name: "Primary Contact",
      },
      {
        id: 2,
        name: "Secondary Contact",
      },
    ];
    expect(store.contacts.length).toBe(2);

    store.removeContact(false);

    expect(store.contacts.length).toBe(2);
    expect(store.contacts[1].is_deleted).toBe(true);
  });
});
