"use client";

import { locales, type Locale } from "@/lib/i18n";
import { useTranslations } from "@/lib/i18n/context";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useTranslations();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <span className="font-medium">{t("common.language")}</span>
      <select
        className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {t(`locale.${value}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
