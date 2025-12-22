import { defineStore } from "pinia";

const EMPTY = {
  "id": "",
  "syskey": "",
  "name": "",
  "email": "",
  "phone_number": "",
  "relationship": "",
  "last_modified": null,
};
const PUT_PROPS = ["id", "name", "email", "phone_number", "relationship"];
const NAME_REGEX = /^[a-zA-Z0-9\s\.'-]+$/;
const PHONE_REGEX = /^[(]?[0-9]{2,3}[)]?[-\s]?[0-9]{3,4}[-\s]?[0-9]{4}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const RELATIONSHIPS = [
  "PARENT",
  "GUARDIAN",
  "SIBLING",
  "SPOUSE",
  "FRIEND",
  "OTHER",
];

export const useEmergencyContactStore = defineStore("emergency-contact", {
  state: () => {
    return {
      name: "EmergencyContact",
      contacts: [],
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
    putData(state) {
      let data = [];
      this.contacts.forEach((contact, idx) => {
        let cdata = {};
        PUT_PROPS.forEach((prop) => { cdata[prop] = contact[prop] });
        data.push(cdata);
      });
      return { "emergency_contacts": data };
    },
  },
  actions: {
    setContacts(contacts) {
      this.contacts = contacts;
      this.contacts.forEach((contact, idx) => {
        let isPrimary = (idx == 0);
        this.validateName(contact, contact.name);
        this.validatePhoneNumber(contact, contact.phone_number);
        this.validateEmail(contact, contact.email);
        this.validateRelationship(contact, contact.relationship);
      });
    },
    validateName(contact, name) {
      name = this.normalize(name);
      contact.name_valid = NAME_REGEX.test(name);
      contact.name = name;
    },
    validatePhoneNumber(contact, phone_number) {
      phone_number = this.normalize(phone_number);
      contact.phone_number_valid = PHONE_REGEX.test(phone_number);
      contact.phone_number = phone_number;
    },
    validateEmail(contact, email) {
      email = this.normalize(email);
      contact.email_valid = EMAIL_REGEX.test(email);
      contact.email = email;
    },
    validateRelationship(contact, relationship) {
      relationship = this.normalize(relationship);
      contact.relationship_valid = !RELATIONSHIPS.includes(relationship);
      contact.relationship = relationship;
    },
    reorder() {
      this.contacts.reverse();
    },
    XXXupdateContact(isPrimary, name, email, phone, relationship) {
      let idx = isPrimary ? 0 : 1;
      this.contacts[idx].name = name;
      this.contacts[idx].email = email;
      this.contacts[idx].phone_number = phone;
      this.contacts[idx].relationship = relationship;
    },
    removeContact(isPrimary) {
      let idx = isPrimary ? 0 : 1;
      this.contacts.splice(idx, 1);
      // this.contacts.push({ ...EMPTY });
    },
    normalize(val) {
      try {
        val = val.toString().trim();
      } catch (error) {
        val = "";
      }
      return val;
    },
  },
});
