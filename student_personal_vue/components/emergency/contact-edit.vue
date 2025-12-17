<template>
  <BButton variant="outline-primary" size="sm" @click="showModal = !showModal">
    Edit
  </BButton>
  <BModal
    v-model="showModal"
    no-close-on-backdrop
    no-close-on-esc
    :title="modalTitle"
    body-class="p-4"
    @close="cancelEdit"
  >
    <p>Required fields are indicated by *</p>

    <BForm novalidate autocomplete="off">
      <div role="group" class="mb-3">
        <label for="" class="form-label fw-bold">Full name *</label>
        <BFormInput
          id="inputFullName"
          v-model="formName"
          :state="stateName"
          class=""
          aria-describedby=""
          trim
          @blur="validateFullName"
        />
        <BFormText v-if="formName == null" id="">
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
          <SCountryCode v-model:calling-code="countryCode"/>
          <BFormInput type="hidden" name="countryCode" :value="countryCode"/>
          <BInputGroupText class="border border-secondary">
            +{{ countryCode }}
          </BInputGroupText>

          <BFormInput
            id="inputPhoneNumber"
            v-model="formPhone"
            :state="statePhone"
            type="text"
            class="rounded-end"
            @blur="validatePhoneNumber"
          />

          <BFormText v-if="formPhone == null" id="">
            Please select appropriate country code. Number format examples:
            222-123-4567, 2221234567 or (222) 123-4567
          </BFormText>
          <BFormInvalidFeedback id="">
            Please select appropriate country code. Number format examples:
            222-123-4567, 2221234567 or (222) 123-4567
          </BFormInvalidFeedback>
        </BInputGroup>
      </div>

      <BFormInput
        type="hidden"
        name="formattedPhoneNumber"
        :value="formattedPhoneNumber"
      />

      <div role="group" class="mb-3">
        <label for="" class="form-label fw-bold">Email *</label>
        <BFormInput
          id="inputEmailAddress"
          v-model="formEmail"
          :state="stateEmail"
          type="email"
          @blur="validateEmailAddress"
        />
        <!-- This will only be shown if the preceding input has an invalid state -->
        <BFormInvalidFeedback id="">Please add an email.</BFormInvalidFeedback>
      </div>

      <div role="group" class="mb-3">
        <label for="selectRelationshipChoice" class="form-label fw-bold">
          Relationship *
        </label>
        <BFormSelect
          id="selectRelationshipChoice"
          v-model="formRelationship"
          :state="stateRelationship"
          :options="relationshipOptions"
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
          v-model="formPrimary"
          :disabled="this.isPrimary"
          class="fw-bold"
        >
          Make this my primary contact
        </BFormCheckbox>
        <BFormText>
          If you have two contacts, you can choose which one is your primary.
        </BFormText>
      </div>
    </BForm>

    <template #footer>
      <BButton variant="outline-primary" @click="cancelEdit">Cancel</BButton>
      <BButton variant="primary" @click="saveContact">Save</BButton>
    </template>
  </BModal>
</template>

<script>
  import {
    BButton,
    BForm,
    BFormCheckbox,
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
  import { getCountryCode, getSubscriberNumber } from "@/utils/phones";
  import { useEmergencyContactStore } from "@/stores/emergency-contact";
  import { useContextStore } from "@/stores/context";
  import { updateEmergencyContacts } from "@/utils/data";

  export default {
    components: {
      SCountryCode,
      BButton,
      BForm,
      BFormInput,
      BFormInvalidFeedback,
      BFormText,
      BFormSelect,
      BFormSelectOption,
      BFormCheckbox,
      BInputGroup,
      BInputGroupText,
      BModal,
    },
    props: {
      isPrimary: {
        type: Boolean,
        required: true,
      },
    },
    emits: ["reload"],
    setup() {
      const contextStore = useContextStore();
      const emergencyContactStore = useEmergencyContactStore();
      return {
        contextStore,
        emergencyContactStore,
        updateEmergencyContacts,
        getCountryCode,
        getSubscriberNumber,
      };
    },
    data() {
      return {
        showModal: false,
        errorResponse: null,
        countryCode: "",
        formattedPhoneNumber: "",
        relationshipOptions: [
          { value: "PARENT", text: "Parent" },
          { value: "GUARDIAN", text: "Guardian" },
          { value: "SIBLING", text: "Sibling" },
          { value: "SPOUSE", text: "Spouse" },
          { value: "FRIEND", text: "Friend" },
          { value: "OTHER", text: "Other" },
        ],
        formName: "",
        formEmail: "",
        formPhone: "",
        formRelationship: "",
        formPrimary: false,
        stateName: null,
        stateEmail: null,
        statePhone: null,
        stateRelationship: null,
      };
    },
    mounted() {
      this.loadContact();
    },
    computed: {
      modalTitle() {
        return this.isPrimary ? "Primary" : "Secondary";
      },
    },
    methods: {
      loadContact() {
        let contact = this.isPrimary
          ? this.emergencyContactStore.primary
          : this.emergencyContactStore.secondary;

        // set form fields from context AND set state
        this.formName = contact.name;
        this.stateName = this.formName !== "" ? true : null;

        this.formEmail = contact.email;
        this.stateEmail = this.formEmail !== "" ? true : null;

        this.formPhone = contact.phone_number;
        if (this.formPhone !== "") {
          this.countryCode = this.getCountryCode(contact.phone_number);
          this.formPhone = this.getSubscriberNumber(contact.phone_number);
          this.statePhone = true;
        } else {
          this.countryCode = "1"; // manually to US if phone is empty string
          this.statePhone = null;
        }

        this.formRelationship = contact.relationship;
        this.stateRelationship = this.relationshipOptions.some(
          (option) => option.value === contact.relationship,
        )
          ? true
          : null;

        this.formPrimary = this.isPrimary;
      },
      validateFullName() {
        // validate full name for latin characters only
        const nameRegex = /^[a-zA-Z0-9\s\.'-]+$/;
        this.stateName = nameRegex.test(this.formName);
      },
      validatePhoneNumber() {
        // validate phone number format, don't allow country + codes
        const phoneRegex = /^[(]?[0-9]{2,3}[)]?[-\s]?[0-9]{3,4}[-\s]?[0-9]{4}$/;
        this.statePhone = phoneRegex.test(this.formPhone);

        // additional step: format phone back to E.164 (add +) before saving
        const phoneNum = this.formPhone.replace(/\D/g, "");
        const formatPhoneNum = `+${this.countryCode}${phoneNum.slice(0, 1)}${phoneNum.slice(1, 4)}${phoneNum.slice(4, 7)}${phoneNum.slice(7)}`;
        this.formattedPhoneNumber = formatPhoneNum;
      },
      validateEmailAddress() {
        // validate email address format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        this.stateEmail = emailRegex.test(this.formEmail);
      },
      validateRelationshipChoice() {
        // validate relationship choice is not empty
        this.stateRelationship = this.relationshipOptions.some(
          (option) => option.value === this.formRelationship,
        );
      },
      cancelEdit() {
        // close the modal
        this.showModal = false;

        // reset state
        this.emergencyContactStore.$reset;
        this.$emit("reload");
      },

      saveContact() {
        // validate required fields
        this.validateFullName();
        this.validatePhoneNumber();
        this.validateEmailAddress();
        this.validateRelationshipChoice();

        // update the store
        if (
          this.stateName &&
          this.statePhone &&
          this.stateEmail &&
          this.stateRelationship
        ) {
          this.emergencyContactStore.updateContact(
            this.isPrimary,
            this.formName,
            this.formEmail,
            this.formattedPhoneNumber,
            this.formRelationship,
          );
        } else {
          return;
        }

        // reorder store
        if (!this.isPrimary && this.formPrimary) {
          this.emergencyContactStore.reorder();
        }

        // check to see if contacts in store are updated
        console.log("Store updated:", this.emergencyContactStore.contacts);

        // initial for api put request
        let url = this.contextStore.context.emergencyContactUrl;
        let putData = {};

        putData.emergency_contacts = this.emergencyContactStore.contacts;
        console.log("putData:", putData);

        // save date to database via api call
        this.updateEmergencyContacts(url, putData)
          .then((data) => {
            console.log("Data received:", data); // Will now have the actual response data
            this.emergencyContactStore.isSaved = true;
            this.showModal = false;
          })
          .catch((error) => {
            console.log("Data saving error:", error);
            this.showModal = false;
            this.errorResponse = error.data;
          })
          .finally(() => {
            console.log("finally");
          });
      },
    },
  };
</script>
