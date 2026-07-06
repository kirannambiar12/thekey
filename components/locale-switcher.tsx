"use client";

import { locales } from "@/lib/i18n";
import { useTranslations } from "@/lib/i18n/context";

const LOCALE_LABELS = {
  en: "English",
  es: "Español",
} as const;

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useTranslations();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <span className="font-medium">{t("common.language")}</span>
      <select
        className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {LOCALE_LABELS[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
