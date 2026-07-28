import { describe, expect, it } from "vitest";
import { Type } from "../model/obligation";
import { toTypeLabelKey } from "./typeLabelKey";

describe("toTypeLabelKey", () => {
  it("maps known API type values to Type message keys", () => {
    expect(toTypeLabelKey("annual_report")).toBe(Type.ANNUAL_REPORT);
    expect(toTypeLabelKey("franchise_tax")).toBe(Type.FRANCHISE_TAX);
    expect(toTypeLabelKey("boi_report")).toBe(Type.BOI_REPORT);
    expect(toTypeLabelKey("registered_agent_renewal")).toBe(
      Type.REGISTERED_AGENT_RENEWAL,
    );
  });

  it("rejects unknown type values", () => {
    expect(() => toTypeLabelKey("annual-report")).toThrow(
      "Unknown obligation type: annual-report",
    );
    expect(() => toTypeLabelKey("unknown")).toThrow(
      "Unknown obligation type: unknown",
    );
  });
});
