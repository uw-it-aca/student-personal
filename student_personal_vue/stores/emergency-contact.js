import { defineStore } from "pinia";
import { getCountryCode, getSubscriberNumber } from "@/utils/phones";

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
const DEFAULT_COUNTRY_CODE = "1";

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
    relationshipOptions(state) {
      const options = [];
      for (const txt of RELATIONSHIPS) {
        options.push({
          value: txt,
          text: txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
        });
      }
      return options;
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
        this.validateName(contact, contact.name);
        this.validatePhoneNumber(contact, contact.phone_number);
        this.validateEmail(contact, contact.email);
        this.validateRelationship(contact, contact.relationship);
      });
    },
    validateName(contact, name) {
      // validate full name for latin characters only
      name = this.normalize(name);
      contact.name_valid = NAME_REGEX.test(name);
      contact.name = name;
    },
    validatePhoneNumber(contact, phone_number) {
      phone_number = this.normalize(phone_number);
      if (phone_number !== "") {
        contact.country_code = getCountryCode(contact.phone_number);
        phone_number = getSubscriberNumber(contact.phone_number);
      } else {
        contact.country_code = DEFAULT_COUNTRY_CODE;
      }
      contact.phone_number_valid = PHONE_REGEX.test(phone_number);
      contact.phone_number = phone_number;

      // also create E.164-formatted phone number
      const phone = phone_number.replace(/\D/g, "");
      contact.formatted_phone_number = `+${contact.country_code}${phone.slice(0, 1)}${phone.slice(1, 4)}${phone.slice(4, 7)}${phone.slice(7)}`;
    },
    validateEmail(contact, email) {
      email = this.normalize(email);
      contact.email_valid = EMAIL_REGEX.test(email);
      contact.email = email;
    },
    validateRelationship(contact, relationship) {
      relationship = this.normalize(relationship);
      contact.relationship_valid = RELATIONSHIPS.includes(relationship);
      contact.relationship = relationship;
    },
    reorderContacts() {
      this.contacts.reverse();
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
