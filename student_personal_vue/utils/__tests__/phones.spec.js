import { describe, expect, it } from "vitest";
import { formatPhoneNumber, getSubscriberNumber } from "../phones";

describe("formatPhoneNumber", () => {
  it("should format a valid E.164 number correctly", () => {
    const phoneNumber = "+14255554321";
    const formattedNumber = formatPhoneNumber(phoneNumber);
    expect(formattedNumber).toBe("+1 (425) 555-4321");
  });

  it("should return null for an invalid number", () => {
    const phoneNumber = "+12065";
    const formattedNumber = formatPhoneNumber(phoneNumber);
    expect(formattedNumber).toBeNull();
  });
});

describe("getSubscriberNumber", () => {
  it("should return the correct subscriber number for a valid E.164 number", () => {
    const phoneNumber = "+14255554321";
    const subscriberNumber = getSubscriberNumber(phoneNumber);
    expect(subscriberNumber).toBe("4255554321");
  });

  it("should return null for an invalid number", () => {
    const phoneNumber = "+12065";
    const subscriberNumber = getSubscriberNumber(phoneNumber);
    expect(subscriberNumber).toBeNull();
  });
});
