import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { localePrefixedPath } from "./locale-prefixed-path";
import { resolveLocale } from "./resolve-locale";
import { routing } from "./routing";

const messagesDir = join(process.cwd(), "messages");

function loadMessages(locale: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(messagesDir, `${locale}.json`), "utf8"),
  ) as Record<string, unknown>;
}

describe("resolveLocale", () => {
  it("returns requested locale when supported", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("es")).toBe("es");
  });

  it("falls back to default locale for unknown or missing values", () => {
    expect(resolveLocale(undefined)).toBe("es");
    expect(resolveLocale("fr")).toBe("es");
    expect(routing.defaultLocale).toBe("es");
  });
});

function leafKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    leafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

const MESSAGE_NAMESPACES = [
  "Dashboard",
  "Kpis",
  "Filter",
  "ObligationCard",
  "Status",
  "Type",
  "Detail",
  "Form",
  "Transitions",
  "Errors",
] as const;

describe("message catalogs", () => {
  it("shares the same top-level keys for es and en", () => {
    const es = loadMessages("es");
    const en = loadMessages("en");

    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
    expect(es).toHaveProperty("I18nSmoke");
    expect(en).toHaveProperty("I18nSmoke");
    expect(es).toHaveProperty("common");
    expect(en).toHaveProperty("common");
    for (const namespace of MESSAGE_NAMESPACES) {
      expect(es).toHaveProperty(namespace);
      expect(en).toHaveProperty(namespace);
    }
  });

  it("keeps message namespace leaf keys in parity for es and en", () => {
    const es = loadMessages("es");
    const en = loadMessages("en");

    expect(leafKeys(es.common, "common").sort()).toEqual(
      leafKeys(en.common, "common").sort(),
    );

    for (const namespace of MESSAGE_NAMESPACES) {
      expect(leafKeys(es[namespace], namespace).sort()).toEqual(
        leafKeys(en[namespace], namespace).sort(),
      );
    }

    const dashboardLeafKeys = leafKeys(es.Dashboard, "Dashboard");
    expect(dashboardLeafKeys).toEqual(
      expect.arrayContaining(["Dashboard.title", "Dashboard.subtitle"]),
    );
    expect(leafKeys(en.Dashboard, "Dashboard")).toEqual(
      expect.arrayContaining(["Dashboard.title", "Dashboard.subtitle"]),
    );
    expect(leafKeys(es.Detail, "Detail")).toEqual(
      expect.arrayContaining(["Detail.history", "Detail.noHistory"]),
    );
    expect(leafKeys(es.Errors, "Errors")).toEqual(
      expect.arrayContaining([
        "Errors.createFailed",
        "Errors.INVALID_STATUS_TRANSITION",
        "Errors.UNKNOWN_CODE",
      ]),
    );
  });

  it("provides distinct smoke strings per locale", () => {
    const es = loadMessages("es") as {
      I18nSmoke: { message: string };
    };
    const en = loadMessages("en") as {
      I18nSmoke: { message: string };
    };

    expect(es.I18nSmoke.message).toContain("(es)");
    expect(en.I18nSmoke.message).toContain("(en)");
    expect(es.I18nSmoke.message).not.toBe(en.I18nSmoke.message);
  });
});

describe("localePrefixedPath", () => {
  it("prefixes paths with the active locale", () => {
    expect(localePrefixedPath("es", "/")).toBe("/es");
    expect(localePrefixedPath("en", "/obligations")).toBe("/en/obligations");
  });

  it("rejects unsupported locales and relative hrefs", () => {
    expect(() => localePrefixedPath("fr", "/")).toThrow("Unsupported locale");
    expect(() => localePrefixedPath("es", "obligations")).toThrow(
      "Expected absolute href",
    );
  });
});
