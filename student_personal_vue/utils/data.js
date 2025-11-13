import { useCustomFetch } from "@/composables/customFetch";

async function clearOverride(url) {
  return useCustomFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ clear_override: true }),
  });
}

export { clearOverride };
