import { useCustomFetch } from "@/composables/customFetch";

async function getEmergencyContacts(url) {
  return useCustomFetch(url);
}

async function updateEmergencyContacts(url, data) {
  return useCustomFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  });
}

async function getFamilyContact(url) {
  return useCustomFetch(url);
}

async function getPhoto(url) {
  return useCustomFetch(url);
}

async function clearOverride(url) {
  return useCustomFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ clear_override: true }),
  });
}

export {
  getEmergencyContacts,
  updateEmergencyContacts,
  getFamilyContact,
  getPhoto,
  clearOverride,
};
