"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  formatMessage,
  getMessage,
  messages,
  resolvePluralMessage,
  type Locale,
  type Messages,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function translate(
  catalog: Messages,
  key: string,
  values?: Record<string, string | number>,
): string {
  const raw = getMessage(catalog, key);

  if (raw === undefined) {
    return key;
  }

  if (values?.count !== undefined && typeof raw === "object") {
    const plural = resolvePluralMessage(raw, Number(values.count));

    if (plural) {
      return formatMessage(plural, values);
    }
  }

  if (typeof raw === "string") {
    return values ? formatMessage(raw, values) : raw;
  }

  return key;
}

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, values) => translate(messages[locale], key, values),
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useTranslations must be used within LocaleProvider");
  }

  return context;
}
