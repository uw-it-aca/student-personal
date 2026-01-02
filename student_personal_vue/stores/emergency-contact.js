import { defineStore } from "pinia";
import { getCountryCode, getSubscriberNumber } from "@/utils/phones";

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
        if (contact.hasOwnProperty("is_deleted") && contact.is_deleted) {
          return;
        }

        let cdata = {};
        PUT_PROPS.forEach((prop) => {
          if (prop === "phone_number") {
            cdata[prop] = contact.e164_phone_number;
          } else {
            cdata[prop] = contact[prop];
          }
        });
        data.push(cdata);
      });
      return { "emergency_contacts": data };
    },
  },
  actions: {
    setContacts(data) {
      this.contacts = [];
      data.emergency_contacts.forEach((contact, idx) => {
        this.validateName(contact, contact.name);
        this.validatePhoneNumber(contact, contact.phone_number);
        this.validateEmail(contact, contact.email);
        this.validateRelationship(contact, contact.relationship);
        this.contacts.push(contact);
      });
    },
    validateName(contact, name) {
      // validate full name for latin characters only
      name = this.normalize(name);
      contact.name = name;
      contact.name_valid = null;
      if (name !== "") {
        contact.name_valid = NAME_REGEX.test(name);
      }
    },
    validatePhoneNumber(contact, e164_phone_number) {
      let country_code = "", phone_number = "", phone_number_valid = null;

      e164_phone_number = this.normalize(e164_phone_number);
      e164_phone_number = e164_phone_number.replace(/[^+0-9]/g, "");

      if (e164_phone_number === "") {
        country_code = DEFAULT_COUNTRY_CODE;
      } else {
        try {
          country_code = getCountryCode(e164_phone_number);
          phone_number = getSubscriberNumber(e164_phone_number);
          phone_number_valid = PHONE_REGEX.test(phone_number);
        } catch (error) {
          console.log(error);
          phone_number_valid = false;
        }
      }
      contact.country_code = country_code;
      contact.phone_number = phone_number;
      contact.phone_number_valid = phone_number_valid;
      contact.e164_phone_number = e164_phone_number;
    },
    validateEmail(contact, email) {
      email = this.normalize(email);
      contact.email = email;
      contact.email_valid = null;
      if (email !== "") {
        contact.email_valid = EMAIL_REGEX.test(email);
      }
    },
    validateRelationship(contact, relationship) {
      relationship = this.normalize(relationship);
      contact.relationship = relationship;
      contact.relationship_valid = null;
      if (relationship !== "") {
        contact.relationship_valid = RELATIONSHIPS.includes(relationship);
      }
    },
    reorderContacts() {
      this.contacts.reverse();
    },
    removeContact(isPrimary) {
      let idx = isPrimary ? 0 : 1;
      this.contacts[idx].is_deleted = true;
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
