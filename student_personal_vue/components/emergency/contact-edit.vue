<template>
  <BButton variant="outline-primary" size="sm" @click="showModal = !showModal">
    Edit
  </BButton>
  <BModal
    v-model="showModal"
    no-close-on-backdrop
    no-close-on-esc
    :title="modalTitle"
    body-class="px-5 py-4"
    @close="cancelEdit"
  >

    <p>Required fields are indicated by *</p>

    <BForm novalidate>
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
          <SCountryCode v-model:calling-code="countryCode" />
          <BFormInput
            type="hidden"
            name="countryCode"
            :value="countryCode"
          />
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
      <div class="border p-2 small mb-3">
        <ul class="list-unstyled m-0">
          <li>Country: {{ countryCode }}</li>
          <li>Subscriber: {{ formPhone }}</li>
          <li>Formatted: {{ formattedPhoneNumber }} (submit to database)</li>
        </ul>
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
          v-model="formEmail"
          :state="stateEmail"
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
  import { getCountryCode, getSubscriberNumber } from "@/utils/phones";
  import { useEmergencyContactStore } from "@/stores/emergency-contact";
  import { useContextStore } from "@/stores/context";
  import { updateEmergencyContacts } from "@/utils/data";

  export default {
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
        this.stateName = this.formName !== "" || this.formName !== null;

        this.formEmail = contact.email;
        this.stateEmail = this.formEmail !== "" || this.formEmail !== null;

        this.formPhone = contact.phone_number;
        this.statePhone = this.formPhone !== "" || this.formPhone !== null;

        this.countryCode = this.getCountryCode(contact.phone_number);
        this.formPhone = this.getSubscriberNumber(contact.phone_number);

        this.formRelationship = contact.relationship;
        if (this.relationshipOptions.some(option => option.value === contact.relationship)) {
          this.stateRelationship = true;
        } else {
          this.stateRelationship = null;
        }

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

        // additional step: format phone number to E.164 for saving to database
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
        // TODO: check that value is actually in the options list
        if (this.relationshipOptions.some(option => option.value === this.formRelationship)) {
          this.stateRelationship = true;
        } else {
          this.stateRelationship = false;
        }

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

        // Add the new data to the store object
        if (this.stateName && this.statePhone && this.stateEmail &&
             this.stateRelationship) {
          this.emergencyContactStore.updateContact(
            this.isPrimary, this.formName, this.formEmail, this.formattedPhoneNumber,
            this.formRelationship);
        } else {
          return;
        }

        // Reordering contacts?
        if (!this.isPrimary && this.formPrimary) {
          this.emergencyContactStore.reorder()
        }

        // check to see if contacts in store are updated
        console.log('Contacts updated:', this.emergencyContactStore.contacts);

        // initial for api put request
        let url = this.contextStore.context.emergencyContactUrl;
        let putData = {};
        // putData.emergency_contacts = this.emergencyContactStore.contacts;
        putData = this.emergencyContactStore.contacts;

        console.log('putData:', putData);

        // save date to database via api call
        this.updateEmergencyContacts(url, putData)
          .then((data) => {
            console.log('Data received:', data);
            //this.emergencyContactStore.contacts = data.emergency_contacts;
            this.showModal = false;
            //this.emergencyContactStore.$reset;
            //this.$emit("reload");
          })
          .catch((error) => {
            console.log('Error:', error);
            this.showModal = false;
            this.errorResponse = error.data;
          })
          .finally(() => {
          });
      },
    },
  };
</script>
