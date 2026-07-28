"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onChange(nextLocale: AppLocale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-600">
      <span className="sr-only">{t("language")}</span>
      <label htmlFor="locale-switcher" className="text-neutral-500">
        {t("language")}
      </label>
      <select
        id="locale-switcher"
        aria-label={t("language")}
        className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-800"
        value={locale}
        onChange={(event) => onChange(event.target.value as AppLocale)}
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {item === "es" ? t("localeEs") : t("localeEn")}
          </option>
        ))}
      </select>
    </div>
  );
}
