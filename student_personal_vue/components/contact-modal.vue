<template>
  <BButton variant="outline-primary" size="sm" @click="showModal = !showModal">
    Edit
  </BButton>
  <BModal
    v-model="showModal"
    no-close-on-backdrop
    no-close-on-esc
    :title="this.isPrimary ? 'Primary' : 'Secondary'"
    body-class="px-5 py-4"
  >

     <p>primary: {{ this.isPrimary }}</p>

    <p>Required fields are indicated by *</p>

    <BForm novalidate>
      <div role="group" class="mb-3">
        <label for="" class="form-label fw-bold">Full name *</label>
        <BFormInput
          id="inputFullName"
          v-model="fullName"
          class=""
          :state="fullNameState"
          aria-describedby=""
          trim
          @blur="validateFullName"
        />
        <BFormText v-if="fullNameState == null" id="">
          Field only supports Latin and Latin-type characters.
        </BFormText>
        <!-- This will only be shown if the preceding input has an invalid state -->
        <BFormInvalidFeedback id="">
          Please add a name. Field only supports Latin and Latin-type
          characters.
        </BFormInvalidFeedback>
        <!-- This is a form text block (formerly known as help block) -->
      </div>

      <div role="group" class="mb-3">
        <label for="inputPhoneNumber" class="form-label fw-bold">
          Phone Number *
        </label>
        <BInputGroup>
          <SCountryCode @update:calling-code="emergencyCallingCode = $event"/>
          <BFormInput
            type="hidden"
            name="emergencyCallingCode"
            :value="emergencyCallingCode"
          />
          <BInputGroupText class="border border-secondary">
            +{{ emergencyCallingCode }}
          </BInputGroupText>

          <BFormInput
            id="inputPhoneNumber"
            v-model="phoneNumber"
            type="text"
            :state="phoneNumberState"
            class="rounded-end"
            @blur="validatePhoneNumber"
          />

          <BFormText v-if="phoneNumberState == null" id="">
            Please select appropriate country code. Number format examples:
            222-123-4567, 2221234567 or (222) 123-4567
          </BFormText>
          <BFormInvalidFeedback id="">
            Please select appropriate country code. Number format examples:
            222-123-4567, 2221234567 or (222) 123-4567
          </BFormInvalidFeedback>
        </BInputGroup>
      </div>
      <div class="border p-2 small mb-3">
        formattedPhoneNumber: {{ formattedPhoneNumber }}
      </div>
      <BFormInput
        type="hidden"
        name="formattedPhoneNumber"
        :value="formattedPhoneNumber"
      />
      <BFormGroup
        label="Email *"
        label-class="fw-bold"
        :state="false"
        class="mb-3"
      >
        <BFormInput
          id="inputEmailAddress"
          v-model="emailAddress"
          :state="emailAddressState"
          type="email"
          @blur="validateEmailAddress"
        />
        <!-- This will only be shown if the preceding input has an invalid state -->
        <BFormInvalidFeedback id="">Please add an email.</BFormInvalidFeedback>
      </BFormGroup>

      <div role="group" class="mb-3">
        <label for="selectRelationshipChoice" class="form-label fw-bold">
          Relationship *
        </label>
        <BFormSelect
          id="selectRelationshipChoice"
          v-model="relationshipChoice"
          :options="relationshipOptions"
          :state="relationshipState"
          @blur="validateRelationshipChoice"
        >
          <template #first>
            <BFormSelectOption value="" disabled>Select...</BFormSelectOption>
          </template>
        </BFormSelect>
        <!-- This will only be shown if the preceding input has an invalid state -->
        <BFormInvalidFeedback>
          Please select a relationship.
        </BFormInvalidFeedback>
      </div>

      <div role="group" class="mb-3">
        <BFormCheckbox
          id="checkboxPrimaryContact"
          v-model="primaryContactChoice"
          :disabled="this.isPrimary"
          class="fw-bold"
          @change="swapContacts"
        >
          Make this my primary contact
        </BFormCheckbox>
        <BFormText>
          If you have two contacts, you can choose which one is your primary.
        </BFormText>
      </div>

      <div class="border p-2 small mb-3">
        <p>tempContacts:</p>
        <p>{{ this.tempContacts }}</p>
      </div>
    </BForm>

    <template #footer>
      <BButton variant="outline-primary" @click="cancelModal">Cancel</BButton>
      <BButton variant="primary" @click="saveContact">Save</BButton>
    </template>
  </BModal>
</template>

<script>
  import {
    BButton,
    BForm,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormSelect,
    BFormSelectOption,
    BFormText,
    BInputGroup,
    BInputGroupText,
    BModal,
  } from "bootstrap-vue-next";
  import { SCountryCode } from "solstice-vue";
  import { getSubscriberNumber } from "@/utils/phones";

  export default {
    name: "HelloWorld",
    components: {
      SCountryCode,
      BForm,
      BFormGroup,
      BInputGroup,
      BInputGroupText,
      BFormInput,
      BFormInvalidFeedback,
      BFormText,
      BFormSelect,
      BFormSelectOption,
      BFormCheckbox,
      BButton,
      BModal,
    },
    props: {
      modalData: {
        type: Array,
        required: true,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      return {
        getSubscriberNumber,
      };
    },
    data() {
      return {
        showModal: false,
        fullName: "",
        fullNameState: null,
        emergencyCallingCode: "1", // default to US
        phoneNumber: "",
        phoneNumberState: null,
        formattedPhoneNumber: "",
        emailAddress: "",
        emailAddressState: null,
        relationshipChoice: "",
        relationshipState: null,
        relationshipOptions: [
          { value: "PARENT", text: "Parent" },
          { value: "GUARDIAN", text: "Guardian" },
          { value: "SIBLING", text: "Sibling" },
          { value: "SPOUSE", text: "Spouse" },
          { value: "FRIEND", text: "Friend" },
          { value: "OTHER", text: "Other" },
        ],
        primaryContactChoice: false,
        tempContacts: [],
      };
    },
    mounted() {
      this.loadContacts();
    },
    computed: {},
    methods: {
      loadContacts() {
        this.tempContacts = this.modalData;

        // load contacts from passed in prop

        if (this.isPrimary) {
          this.fullName = this.tempContacts[0].name;

          // check if phone number exists, get subscriber number only
          if (this.tempContacts[0].phoneNumber) {
            this.phoneNumber = this.getSubscriberNumber(
              this.tempContacts[0].phoneNumber,
            );
          }

          this.emailAddress = this.tempContacts[0].email;

          // check if relationship exists
          if (this.tempContacts[0].relationship) {
            this.relationshipChoice = this.tempContacts[0].relationship;
          }

          this.primaryContactChoice = true;
        } else {
          this.fullName = this.tempContacts[1].name;

          // check if phone number exists, get subscriber number only
          if (this.tempContacts[1].phoneNumber) {
            this.phoneNumber = this.getSubscriberNumber(
              this.tempContacts[1].phoneNumber,
            );
          }

          this.emailAddress = this.tempContacts[1].email;
          // check if relationship exists
          if (this.tempContacts[1].relationship) {
            this.relationshipChoice = this.tempContacts[1].relationship;
          }
          this.primaryContactChoice = false;
        }
      },

      swapContacts() {
        // swap the contacts in the tempContacts array
        const reorderedContacts = [this.tempContacts[1], this.tempContacts[0]];
        this.tempContacts[0] = reorderedContacts[0];
        this.tempContacts[1] = reorderedContacts[1];
        console.log("swapContacts");
        console.log(this.tempContacts[0], this.tempContacts[1]);
      },

      validateFullName() {
        // validate full name for latin characters only
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        this.fullNameState = nameRegex.test(this.fullName);

        // update contacts after validattion
        if (this.isPrimary) {
          this.tempContacts[0].name = this.fullName;
        } else {
          this.tempContacts[1].name = this.fullName;
        }
      },
      validatePhoneNumber() {
        // validate phone number format
        const phoneRegex =
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
        this.phoneNumberState = phoneRegex.test(this.phoneNumber);

        // additional step: format phone number to E.164
        const phoneNum = this.phoneNumber.replace(/\D/g, "");
        const formatPhoneNum = `+${this.emergencyCallingCode}${phoneNum.slice(0, 1)}${phoneNum.slice(1, 4)}${phoneNum.slice(4, 7)}${phoneNum.slice(7)}`;
        this.formattedPhoneNumber = formatPhoneNum;

        // update phone number after validation and formatting
        if (this.isPrimary) {
          this.tempContacts[0].phoneNumber = this.formattedPhoneNumber;
        } else {
          this.tempContacts[1].phoneNumber = this.formattedPhoneNumber;
        }
      },
      validateEmailAddress() {
        // validate email address format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        this.emailAddressState = emailRegex.test(this.emailAddress);

        // update email after validattion
        if (this.isPrimary) {
          this.tempContacts[0].email = this.emailAddress;
        } else {
          this.tempContacts[1].email = this.emailAddress;
        }
      },
      validateRelationshipChoice() {
        // validate relationship choice is not empty
        this.relationshipState = this.relationshipChoice !== "";

        // update relationship after validattion
        if (this.isPrimary) {
          this.tempContacts[0].relationsip = this.relationshipChoice;
        } else {
          this.tempContacts[1].relationship = this.relationshipChoice;
        }
      },

      updateLastModified() {
        // calculate last modified date
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

        // add microseconds (JavaScript only gives ms, so append zeros)
        const microseconds = `${milliseconds}000`;

        // build ISO-like format
        const lastModified = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${microseconds}`;

        if (this.isPrimary) {
          this.tempContacts[0].lastModified = lastModified;
        } else {
          this.tempContacts[1].lastModified = lastModified;
        }
      },

      cancelModal() {
        // reset state
        this.fullNameState = null;
        this.phoneNumberState = null;
        this.emailAddressState = null;
        this.relationshipState = null;

        // force reload to clear state
        window.location.reload();

        // close the modal
        this.showModal = false;
      },

      saveContact() {
        // validate required fields
        this.validateFullName();
        this.validatePhoneNumber();
        this.validateEmailAddress();
        this.validateRelationshipChoice();

        // update last modified date
        this.updateLastModified();

        // if validation state passes, save the contact data
        if (
          this.fullNameState &&
          this.phoneNumberState &&
          this.emailAddressState &&
          this.relationshipState
        ) {
          console.log("saveContact");
          console.log(this.tempContacts[0], this.tempContacts[1]);
          //alert(JSON.stringify(this.tempContacts, null, 4));
          // TODO: call API to save contact data
          //this.showModal = false;
        }
      },
    },
  };
</script>
