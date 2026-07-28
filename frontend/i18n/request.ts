import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale, locale: overrideLocale }) => {
  let locale = overrideLocale;

  if (!locale) {
    // `next/root-params` is only valid in a route render. Server Actions
    // (create/update/status) call getLocale() and must fall back to requestLocale.
    let paramValue: string | undefined;
    try {
      paramValue = await rootParams.locale();
    } catch {
      paramValue = undefined;
    }

    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      const requested = await requestLocale;
      if (hasLocale(routing.locales, requested)) {
        locale = requested;
      } else if (paramValue === undefined) {
        locale = routing.defaultLocale;
      } else {
        notFound();
      }
    }
  }

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
