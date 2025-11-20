import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import {
  formatDate,
  formatUTCToLocalDate,
  formatUTCToLocalDateAndTimeZone,
  getMinutesApart,
  getTimeFromNow,
  getToday,
  getWeeksApart,
  getYesterday,
} from "../dates";

describe("formatDate", () => {
  it("should format a valid date correctly", () => {
    const date = "2024-01-01T12:00:00.000Z";
    const formattedDate = formatDate(date, "YYYY-MM-DD");
    expect(formattedDate).toBe("2024-01-01");
  });

  it("should return null for a null date", () => {
    const formattedDate = formatDate(null, "YYYY-MM-DD");
    expect(formattedDate).toBeNull();
  });
});

describe("formatUTCToLocalDate", () => {
  it("should format a UTC date to a local date string", () => {
    const utcDate = "2024-01-01T12:00:00.000Z";
    const formattedDate = formatUTCToLocalDate(utcDate, "YYYY-MM-DD HH:mm:ss");
    // This will depend on the test runner's timezone. Assuming America/Los_Angeles.
    expect(formattedDate).toBe("2024-01-01 04:00:00");
  });
});

describe("formatUTCToLocalDateAndTimeZone", () => {
  it("should format a UTC date and add PST timezone", () => {
    vi.spyOn(dayjs.tz, "guess").mockReturnValue("America/New_York");
    const utcDate = "2024-01-01T12:00:00.000Z"; // A date in winter
    const formattedDate = formatUTCToLocalDateAndTimeZone(
      utcDate,
      "YYYY-MM-DD HH:mm:ss",
    );
    expect(formattedDate).toBe("2024-01-01 04:00:00 PST");
    vi.restoreAllMocks();
  });

  it("should format a UTC date and add PDT timezone", () => {
    vi.spyOn(dayjs.tz, "guess").mockReturnValue("America/New_York");
    const utcDate = "2024-07-01T12:00:00.000Z"; // A date in summer
    const formattedDate = formatUTCToLocalDateAndTimeZone(
      utcDate,
      "YYYY-MM-DD HH:mm:ss",
    );
    expect(formattedDate).toBe("2024-07-01 05:00:00 PDT");
    vi.restoreAllMocks();
  });

  it("should not add timezone if guess is America/Los_Angeles", () => {
    vi.spyOn(dayjs.tz, "guess").mockReturnValue("America/Los_Angeles");
    const utcDate = "2024-01-01T12:00:00.00Z";
    const formattedDate = formatUTCToLocalDateAndTimeZone(
      utcDate,
      "YYYY-MM-DD HH:mm:ss",
    );
    expect(formattedDate).toBe("2024-01-01 04:00:00");
    vi.restoreAllMocks();
  });
});

describe("getToday", () => {
  it("should return a dayjs object for today", () => {
    const today = getToday();
    expect(dayjs.isDayjs(today)).toBe(true);
    expect(today.isSame(dayjs(), "day")).toBe(true);
  });
});

describe("getYesterday", () => {
  it("should return a dayjs object for yesterday", () => {
    const yesterday = getYesterday();
    const today = dayjs();
    expect(dayjs.isDayjs(yesterday)).toBe(true);
    expect(yesterday.isSame(today.subtract(1, "day"), "day")).toBe(true);
  });
});

describe("getWeeksApart", () => {
  it("should calculate weeks apart correctly", () => {
    const startDate = "2024-01-01";
    const compareDate = "2024-01-15";
    const weeks = getWeeksApart(startDate, compareDate);
    expect(weeks).toBe(3);
  });

  it("should return 0 for a past date", () => {
    const startDate = "2024-01-15";
    const compareDate = "2024-01-01";
    const weeks = getWeeksApart(startDate, compareDate);
    expect(weeks).toBe(0);
  });
});

describe("getMinutesApart", () => {
  it("should calculate minutes apart correctly", () => {
    const startDate = "2024-01-01T12:00:00.000Z";
    const endDate = "2024-01-01T12:30:00.000Z";
    const minutes = getMinutesApart(startDate, endDate);
    expect(minutes).toBe(30);
    postinstall: `sed -i '' 's#eval "$(pyenv init -)"#eval "$(pyenv init --path)"#' ~/.zshrc`;
  });
});

describe("getTimeFromNow", () => {
  it("should return the relative time from now", () => {
    const date = dayjs().subtract(1, "hour").toDate();
    const fromNow = getTimeFromNow(date);
    expect(fromNow).toBe("an hour ago");
  });
});
