import { defineStore } from "pinia";

export const useEmergencyContactStore = defineStore("emergency-contact", {
  state: () => {
    return {
      name: "EmergencyContact",
      contacts: [],
      isSaved: false,
    };
  },
  getters: {
    hasContacts(state) {
      return this.contacts.length > 0;
    },
    primary(state) {
      return this.contacts[0];
    },
    secondary(state) {
      return this.contacts[1];
    },
  },
  actions: {
    updateContact(isPrimary, name, email, phone, relationship) {
      let idx = isPrimary ? 0 : 1;
      this.contacts[idx].name = name;
      this.contacts[idx].email = email;
      this.contacts[idx].phone_number = phone;
      this.contacts[idx].relationship = relationship;
    },
    reorder() {
      this.contacts.reverse();
    },
    removeContact(isPrimary) {
      let idx = isPrimary ? 0 : 1;
      this.contacts.splice(idx, 1);
    },
  },
});
