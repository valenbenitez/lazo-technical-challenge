import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale, locale: overrideLocale }) => {
  let locale = overrideLocale;

  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      const requested = await requestLocale;
      if (hasLocale(routing.locales, requested)) {
        locale = requested;
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
