import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "./routing";

export function resolveLocale(requested: string | undefined): AppLocale {
  return hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
}
