import { describe, expect, it } from "vitest";
import {
  formatPhoneNumber,
  getCountryCode,
  getSubscriberNumber,
} from "../phones";

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

  it("should return null for a null number", () => {
    const formattedNumber = formatPhoneNumber(null);
    expect(formattedNumber).toBeNull();
  });

  it("should return null for an undefined number", () => {
    const formattedNumber = formatPhoneNumber(undefined);
    expect(formattedNumber).toBeNull();
  });
});

describe("getCountryCode", () => {
  it("should return the correct country code for a valid number", () => {
    const countryCode = getCountryCode("+14255554321");
    expect(countryCode).toBe("1");
  });

  it("should return the correct country code for a valid number with default", () => {
    const countryCode = getCountryCode("4255554321", "US");
    expect(countryCode).toBe("1");
  });

  it("should return null for an invalid number", () => {
    const countryCode = getCountryCode("+12065");
    expect(countryCode).toBe(null);
  });

  it("should return null for a null number", () => {
    const countryCode = getCountryCode(null);
    expect(countryCode).toBe(null);
  });

  it("should return null for an undefined number", () => {
    const countryCode = getCountryCode(undefined);
    expect(countryCode).toBe(null);
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

  it("should return null for a null number", () => {
    const subscriberNumber = getSubscriberNumber(null);
    expect(subscriberNumber).toBeNull();
  });

  it("should return null for an undefined number", () => {
    const subscriberNumber = getSubscriberNumber(undefined);
    expect(subscriberNumber).toBeNull();
  });
});
