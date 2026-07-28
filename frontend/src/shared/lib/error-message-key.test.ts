import { describe, expect, it } from "vitest";
import {
  getErrorCode,
  toActionErrorKey,
  toErrorMessageKey,
} from "./error-message-key";

describe("toErrorMessageKey", () => {
  it("maps known API codes and action keys", () => {
    expect(toErrorMessageKey("INVALID_STATUS_TRANSITION")).toBe(
      "INVALID_STATUS_TRANSITION",
    );
    expect(toErrorMessageKey("createFailed")).toBe("createFailed");
    expect(toErrorMessageKey("CONFLICT_OBLIGATION_VERSION")).toBe(
      "CONFLICT_OBLIGATION_VERSION",
    );
  });

  it("falls back to UNKNOWN_CODE for unknown values", () => {
    expect(toErrorMessageKey("SOME_BACKEND_MESSAGE")).toBe("UNKNOWN_CODE");
    expect(toErrorMessageKey("")).toBe("UNKNOWN_CODE");
  });
});

describe("getErrorCode", () => {
  it("reads code from Error cause", () => {
    const error = new Error("backend message", {
      cause: { code: "INVALID_DUE_DATE" },
    });
    expect(getErrorCode(error)).toBe("INVALID_DUE_DATE");
  });

  it("returns undefined when cause has no code", () => {
    expect(getErrorCode(new Error("plain"))).toBeUndefined();
    expect(getErrorCode("string")).toBeUndefined();
    expect(getErrorCode(new Error("x", { cause: { code: 123 } }))).toBeUndefined();
  });
});

describe("toActionErrorKey", () => {
  it("prefers API cause code over fallback", () => {
    const error = new Error("English Nest message", {
      cause: { code: "OBLIGATION_NOT_FOUND" },
    });
    expect(toActionErrorKey(error, "updateFailed")).toBe("OBLIGATION_NOT_FOUND");
  });

  it("uses fallback when no code is present", () => {
    expect(toActionErrorKey(new Error("oops"), "createFailed")).toBe(
      "createFailed",
    );
    expect(toActionErrorKey(null, "statusUpdateFailed")).toBe(
      "statusUpdateFailed",
    );
  });
});
