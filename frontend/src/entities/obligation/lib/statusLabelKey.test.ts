import { describe, expect, it } from "vitest";
import { Status } from "../model/obligation";
import { toStatusLabelKey } from "./statusLabelKey";

describe("toStatusLabelKey", () => {
  it("maps known API status values to Status message keys", () => {
    expect(toStatusLabelKey("pending")).toBe(Status.PENDING);
    expect(toStatusLabelKey("in_progress")).toBe(Status.IN_PROGRESS);
    expect(toStatusLabelKey("submitted")).toBe(Status.SUBMITTED);
    expect(toStatusLabelKey("done")).toBe(Status.DONE);
  });

  it("rejects unknown status values", () => {
    expect(() => toStatusLabelKey("overdue")).toThrow(
      "Unknown obligation status: overdue",
    );
    expect(() => toStatusLabelKey("in-progress")).toThrow(
      "Unknown obligation status: in-progress",
    );
  });
});
