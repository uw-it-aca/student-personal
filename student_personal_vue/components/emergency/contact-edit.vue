<template>
  <BButton
    variant="outline-primary"
    size="sm"
    aria-label="Update contact"
    @click="openModal"
    class="me-1"
  >
    {{ action }}
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

    <BForm v-if="formContact" novalidate autocomplete="off">
      <div role="group" class="mb-3">
        <label for="" class="form-label fw-bold">Full name *</label>
        <BFormInput
          id="inputFullName"
          v-model="formName"
          :state="nameValidated ? formContact.name_valid : null"
          class=""
          aria-describedby=""
          trim
          @blur="handleFullNameBlur"
          data-clarity-mask="True"
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
          <SCountryCode v-model:calling-code="formCountryCode" />
          <BFormInput
            type="hidden"
            name="countryCode"
            :value="formCountryCode"
          />
          <BInputGroupText class="border-secondary border">
            +{{ formCountryCode }}
          </BInputGroupText>

          <BFormInput
            id="inputPhoneNumber"
            v-model="formPhoneNumber"
            :state="phoneValidated ? formContact.phone_number_valid : null"
            type="text"
            class="rounded-end"
            @blur="handlePhoneNumberBlur"
            data-clarity-mask="True"
          />
          <BFormText v-if="formPhoneNumber == null" id="">
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
          :state="emailValidated ? formContact.email_valid : null"
          type="email"
          @blur="handleEmailAddressBlur"
          data-clarity-mask="True"
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
          :state="relationshipValidated ? formContact.relationship_valid : null"
          :options="emergencyContactStore.relationshipOptions"
          @change="handleRelationshipValidation"
          @blur="handleRelationshipValidation"
          data-clarity-mask="True"
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
  import { useContextStore } from "@/stores/context";
  import { useEmergencyContactStore } from "@/stores/emergency-contact";
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
      action: {
        type: String,
        default: "Edit",
      },
    },
    emits: ["reload", "saved"],
    setup() {
      const contextStore = useContextStore();
      const emergencyContactStore = useEmergencyContactStore();
      return {
        contextStore,
        emergencyContactStore,
        updateEmergencyContacts,
      };
    },
    data() {
      return {
        showModal: false,
        errorResponse: null,
        formName: "",
        formEmail: "",
        formPhoneNumber: "",
        formCountryCode: "",
        formRelationship: "",
        formPrimary: false,
        nameValidated: false,
        emailValidated: false,
        phoneValidated: false,
        relationshipValidated: false,
      };
    },
    mounted() {
      this.loadContact();
    },
    computed: {
      modalTitle() {
        return this.isPrimary ? "Contact #1" : "Contact #2";
      },
      formContact() {
        return this.isPrimary
          ? this.emergencyContactStore.primary
          : this.emergencyContactStore.secondary;
      },
      formattedPhoneNumber() {
        return this.formContact.e164_phone_number;
      },
    },
    methods: {
      openModal() {
        this.loadContact();
        this.resetValidationFlags();
        this.showModal = true;
      },
      resetValidationFlags() {
        this.nameValidated = false;
        this.emailValidated = false;
        this.phoneValidated = false;
        this.relationshipValidated = false;
      },
      loadContact() {
        let contact = this.formContact;
        this.formName = contact.name;
        this.formEmail = contact.email;
        this.formPhoneNumber = contact.phone_number_formatted;
        this.formCountryCode = contact.country_code;
        this.formRelationship = contact.relationship;
        // this.formPrimary = this.isPrimary;
      },
      handleFullNameBlur() {
        this.nameValidated = true;
        this.validateFullName();
      },
      validateFullName() {
        this.emergencyContactStore.validateName(
          this.formContact,
          this.formName,
        );
        this.formName = this.formContact.name;
      },
      handlePhoneNumberBlur() {
        this.phoneValidated = true;
        this.validatePhoneNumber();
      },
      validatePhoneNumber() {
        let phone_number = "+" + this.formCountryCode + this.formPhoneNumber;
        this.emergencyContactStore.validatePhoneNumber(
          this.formContact,
          phone_number,
        );
        this.formPhoneNumber = this.formContact.phone_number_formatted;
      },
      handleEmailAddressBlur() {
        this.emailValidated = true;
        this.validateEmailAddress();
      },
      validateEmailAddress() {
        this.emergencyContactStore.validateEmail(
          this.formContact,
          this.formEmail,
        );
        this.formEmail = this.formContact.email;
      },
      handleRelationshipValidation() {
        this.relationshipValidated = true;
        this.validateRelationshipChoice();
      },
      validateRelationshipChoice() {
        this.emergencyContactStore.validateRelationship(
          this.formContact,
          this.formRelationship,
        );
      },
      cancelEdit() {
        this.showModal = false;
        this.$emit("reload");
      },
      saveContact() {
        this.nameValidated = true;
        this.emailValidated = true;
        this.phoneValidated = true;
        this.relationshipValidated = true;

        let url = this.contextStore.context.emergencyContactUrl,
          contact = this.formContact;

        this.validateFullName();
        this.validateEmailAddress();
        this.validatePhoneNumber();
        this.validateRelationshipChoice();

        if (
          !(
            contact.name_valid &&
            contact.email_valid &&
            contact.phone_number_valid &&
            contact.relationship_valid
          )
        ) {
          return;
        }

        // reorder contacts if needed
        //if (!this.isPrimary && this.formPrimary) {
        //this.emergencyContactStore.reorderContacts();
        //}

        // check to see if contacts in store are updated
        console.log("Store updated:", this.emergencyContactStore.putData);

        this.updateEmergencyContacts(url, this.emergencyContactStore.putData)
          .then((data) => {
            this.$emit("reload");
            this.$emit("saved");
            this.showModal = false;
          })
          .catch((error) => {
            console.log("Data saving error:", error);
            this.errorResponse = error.data;
            this.showModal = false;
          })
          .finally(() => {
            console.log("finally");
          });
      },
    },
  };
</script>
