import { parsePhoneNumber } from "libphonenumber-js";
import { defineStore } from "pinia";
import { formatUTCToLocalDate } from "@/utils/dates";

const PUT_PROPS = ["id", "name", "email", "phone_number", "relationship"];
const NAME_REGEX = /^[a-zA-Z0-9\s\.'-]+$/;
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
      _static: [],
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
    staticPrimary(state) {
      return this._static[0];
    },
    staticSecondary(state) {
      return this._static[1];
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
      return { emergency_contacts: data };
    },
  },
  actions: {
    setContacts(data) {
      this._setStaticContacts(data);
      this.contacts = [];
      data.emergency_contacts.forEach((contact, idx) => {
        this.validateName(contact, contact.name);
        this.validatePhoneNumber(contact, contact.phone_number);
        this.validateEmail(contact, contact.email);
        this.validateRelationship(contact, contact.relationship);
        this.contacts.push(contact);
      });
    },
    _setStaticContacts(data) {
      // Create a non-reactive view of the contact data
      this._static = JSON.parse(JSON.stringify(data.emergency_contacts));
      this._static.forEach((contact, idx) => {
        try {
          const parsed = parsePhoneNumber(contact.phone_number);
          if (parsed) {
            contact.phone_number_formatted =
              parsed.countryCallingCode === DEFAULT_COUNTRY_CODE
                ? parsed.formatNational()
                : parsed.formatInternational();
          }
        } catch (error) {
          // console.log(error);
          contact.phone_number_formatted = "";
        }
        try {
          contact.last_modified_formatted = formatUTCToLocalDate(
            contact.last_modified,
            "LLL",
          );
        } catch (error) {
          // console.log(error);
          contact.last_modified_formatted = "";
        }
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
      let country_code = "",
        phone_number = "",
        phone_number_valid = null,
        phone_number_formatted = "",
        phone_number_formatted_intl = "";

      e164_phone_number = this.normalize(e164_phone_number);
      e164_phone_number = e164_phone_number.replace(/[^+0-9]/g, "");

      if (e164_phone_number === "") {
        country_code = DEFAULT_COUNTRY_CODE;
      } else {
        try {
          const parsed = parsePhoneNumber(e164_phone_number);
          if (parsed) {
            phone_number_valid = parsed.isValid();
            country_code = parsed.countryCallingCode;
            phone_number = parsed.nationalNumber;
            phone_number_formatted = parsed.formatNational();
            phone_number_formatted_intl = parsed.formatInternational();
          }
        } catch (error) {
          //console.log(error);
          phone_number_valid = false;
        }
      }
      contact.e164_phone_number = e164_phone_number;
      contact.country_code = country_code;
      contact.phone_number = phone_number;
      contact.phone_number_valid = phone_number_valid;
      contact.phone_number_formatted = phone_number_formatted;
      contact.phone_number_formatted_intl = phone_number_formatted_intl;
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
