import { parsePhoneNumber } from "libphonenumber-js";

function formatPhoneNumber(e164PhoneNumber) {
  try {
    const phoneNumber = parsePhoneNumber(e164PhoneNumber);

    if (phoneNumber?.isValid()) {
      const countryCode = `+${phoneNumber.countryCallingCode}`;
      const nationalFormat = phoneNumber.formatNational();
      // returns +1 (425) 555-4321 (national) or +91 022 1234 5678 (international format)
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

export { formatPhoneNumber, getSubscriberNumber };
