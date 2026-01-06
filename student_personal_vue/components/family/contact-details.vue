<template>
  <template v-if="isLoading">
    <ContactLoading/>
  </template>
  <div v-else-if="errorResponse">{{ errorResponse.message }}</div>
  <ul v-else-if="contact && contact.name" class="list-unstyled">
    <li>{{ contact.name }}</li>
    <li v-if="hasMailingAddress" v-html="formatMailingAddress(contact)"></li>
    <li v-if="hasPhoneNumber">{{ formattedPhoneNumber }}</li>
  </ul>
  <div v-else class="text-secondary fst-italic">
    No contact information provided.
  </div>
</template>

<script>
  import ContactLoading from "@/components/_contact-loading.vue";
  import { useContextStore } from "@/stores/context";
  import { formatMailingAddress } from "@/utils/addresses";
  import { getFamilyContact } from "@/utils/data";
  import { formatDate } from "@/utils/dates";
  import { parsePhoneNumber } from "libphonenumber-js";

  export default {
    components: {
      ContactLoading,
    },
    setup() {
      const contextStore = useContextStore();
      return {
        contextStore,
        getFamilyContact,
        formatDate,
        parsePhoneNumber,
        formatMailingAddress,
      };
    },
    data() {
      return {
        contact: null,
        errorResponse: null,
        isLoading: true,
      };
    },
    computed: {
      hasPhoneNumber() {
        return (
          this.contact.phone_number !== null &&
          this.contact.phone_number.trim() !== ""
        );
      },
      formattedPhoneNumber() {
        try {
          const parsed = parsePhoneNumber(this.contact.phone_number);
          return (parsed.countryCallingCode === "1")
            ? parsed.formatNational() : parsed.formatInternational();
        } catch (error) {
          return "";
        }
      },
      hasMailingAddress() {
        return (
          this.contact.address_line_1 !== null &&
          this.contact.address_line_1.trim() !== "" &&
          this.contact.city !== null &&
          this.contact.city.trim() !== "" &&
          this.contact.state !== null &&
          this.contact.state.trim() !== ""
        );
      },
    },
    methods: {
      loadFamilyContact: function () {
        setTimeout(() => {
          this.getFamilyContact(this.contextStore.context.familyContactUrl)
            .then((data) => {
              this.contact = data.family_contact;
            })
            .catch((error) => {
              this.errorResponse = error.data;
            })
            .finally(() => {
              this.isLoading = false;
            });
        }, 500);
      },
    },
    created() {
      this.loadFamilyContact();
    },
  };
</script>
