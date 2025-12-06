import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

function formatPhoneNumber(e164PhoneNumber) {
  try {
    const phoneNumber = parsePhoneNumber(e164PhoneNumber);

    if (phoneNumber?.isValid()) {
      const countryCode = `+${phoneNumber.countryCallingCode}`;
      const nationalFormat = phoneNumber.formatNational();
      // returns +1 (425) 555-4321 (national) from +14255554321
      // or +91 022 1234 5678 (int. india) from +912212345678
      // +86 0755 8232 6560 (int. china)  +8675582326560
      return `${countryCode} ${nationalFormat}`;
    } else {
      console.error(`Invalid or unsupported E.164 number: ${e164PhoneNumber}`);
      return null;
    }
  } catch (error) {
    console.error("Error parsing phone number:", error.message);
    return null;
  }
}

function getSubscriberNumber(e164PhoneNumber) {
  try {
    const phoneNumber = parsePhoneNumber(e164PhoneNumber);

    if (phoneNumber?.isValid()) {
      // returns the national number (subscriber number) as a string
      return phoneNumber.nationalNumber;
    }
  } catch (error) {
    // handle cases where the input string isn't a valid E.164 number
    console.error("Error parsing phone number for subscriber:", error.message);
  }
  return null;
}

function isValidSubscriberNumber(phoneNumber, defaultCountry = "US") {
  try {
    // Check if phone number has international prefix
    const hasCountryCode = phoneNumber.trim().startsWith("+");
    if (hasCountryCode) {
      // Validate as international number
      return isValidPhoneNumber(phoneNumber) === true;
    } else {
      // Validate as national number with default country
      return isValidPhoneNumber(phoneNumber, defaultCountry) === true;
    }
  } catch (error) {
    return false;
  }
}

export { formatPhoneNumber, getSubscriberNumber, isValidSubscriberNumber };
