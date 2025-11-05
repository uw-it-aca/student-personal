<template>
  <BButton variant="outline-primary" size="sm" @click="showModal = !showModal"
    >Edit</BButton
  >
  <BModal v-model="showModal" title="Secondary" body-class="px-5 py-4">
    <p>Required fields are indicated by *</p>

    <BForm novalidate>
      <div role="group" class="mb-3">
        <label for="" class="form-label fw-bold">Full name *</label>
        <BFormInput
          id=""
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
          <SCountryCode @update:calling-code="emergencyCallingCode = $event" />
          <BFormInput
            type="hidden"
            name="emergencyCallingCode"
            :value="'+' + emergencyCallingCode"
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
            222-123-4567, 2221234567 or (222) 123-4567</BFormText
          >
          <BFormInvalidFeedback id="">
            Please select appropriate country code. Number format examples:
            222-123-4567, 2221234567 or (222) 123-4567
          </BFormInvalidFeedback>
        </BInputGroup>
      </div>

      <BFormGroup
        label="Email *"
        label-class="fw-bold"
        :state="false"
        class="mb-3"
      >
        <BFormInput type="email" />
        <!-- This will only be shown if the preceding input has an invalid state -->
        <BFormInvalidFeedback id="">Please add an email.</BFormInvalidFeedback>
      </BFormGroup>

      <div role="group" class="mb-3">
        <label for="" class="form-label fw-bold">Relationship *</label>
        <BFormSelect
          v-model="selected"
          :options="relationshipOptions"
          :state="false"
        >
          <template #first>
            <BFormSelectOption value="" disabled>Select...</BFormSelectOption>
          </template>
        </BFormSelect>
      </div>

      <div role="group" class="mb-3">
        <BFormCheckbox
          id="checkbox-1"
          v-model="status"
          name="checkbox-1"
          value="accepted"
          unchecked-value="not_accepted"
          class="fw-bold"
        >
          Make this my primary contact
        </BFormCheckbox>
        <BFormText id="">
          If you have two contacts, you can choose which one is your primary.
        </BFormText>
      </div>
    </BForm>

    <template #footer>
      <BButton variant="outline-primary">Cancel</BButton>
      <BButton variant="primary">Save</BButton>
    </template>
  </BModal>
</template>

<script>
import { SCountryCode } from "solstice-vue";
import {
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
} from "bootstrap-vue-next";

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
  data() {
    return {
      emergencyCallingCode: "1", // default to US
      showModal: false,
      fullName: "",
      fullNameState: null,
      phoneNumber: "",
      phoneNumberState: null,
      relationshipOptions: [
        { value: "a", text: "Parent" },
        { value: "b", text: "Guardian" },
        { value: "c", text: "Sibling" },
        { value: "d", text: "Spouse" },
        { value: "e", text: "Friend" },
        { value: "f", text: "Other" },
      ],
    };
  },
  computed: {},
  methods: {
    validateFullName() {
      this.fullNameState = this.fullName.length >= 1;
    },
    validatePhoneNumber() {
      this.phoneNumberState = this.phoneNumber.length >= 1;
    },
  },
};
</script>
