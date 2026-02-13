import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCustomFetch } from "@/composables/customFetch";
import {
  clearOverride,
  getEmergencyContacts,
  getFamilyContact,
  getPhoto,
  updateEmergencyContacts,
} from "../data"; // adjust path as needed

// Mock the composable
vi.mock("@/composables/customFetch", () => ({
  useCustomFetch: vi.fn(),
}));

describe("Emergency Contacts Service", () => {
  const mockUrl = "/api/emergency";
  const mockData = { name: "John Doe", phone: "123456789" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useCustomFetch with correct URL for getEmergencyContacts", async () => {
    useCustomFetch.mockResolvedValue({ data: "mocked" });

    const result = await getEmergencyContacts(mockUrl);

    expect(useCustomFetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual({ data: "mocked" });
  });

  it("should call useCustomFetch with PUT method and correct body for updateEmergencyContacts", async () => {
    useCustomFetch.mockResolvedValue({ success: true });

    const result = await updateEmergencyContacts(mockUrl, mockData);

    expect(useCustomFetch).toHaveBeenCalledWith(mockUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual({ success: true });
  });

  it("should call useCustomFetch with correct URL for getPhoto", async () => {
    useCustomFetch.mockResolvedValue({ photo: "image.jpg" });

    const result = await getPhoto(mockUrl);

    expect(useCustomFetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual({ photo: "image.jpg" });
  });

  it("should call useCustomFetch with POST method and clear_override body for clearOverride", async () => {
    useCustomFetch.mockResolvedValue({ cleared: true });

    const result = await clearOverride(mockUrl);

    expect(useCustomFetch).toHaveBeenCalledWith(mockUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ clear_override: true }),
    });
    expect(result).toEqual({ cleared: true });
  });

  it("should call useCustomFetch with correct URL for getFamilyContact", async () => {
    useCustomFetch.mockResolvedValue({ data: "mocked" });
    const familyUrl = "/api/family";

    const result = await getFamilyContact(familyUrl);

    expect(useCustomFetch).toHaveBeenCalledWith(familyUrl);
    expect(result).toEqual({ data: "mocked" });
  });
});
