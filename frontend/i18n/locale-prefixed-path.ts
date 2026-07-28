import { routing, type AppLocale } from "./routing";

/** Builds a locale-prefixed pathname for localePrefix: "always". */
export function localePrefixedPath(locale: string, href: string): string {
  if (!routing.locales.includes(locale as AppLocale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  if (href === "/") {
    return `/${locale}`;
  }
  if (!href.startsWith("/")) {
    throw new Error(`Expected absolute href, got: ${href}`);
  }
  return `/${locale}${href}`;
}
