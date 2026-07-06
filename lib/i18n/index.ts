import en from "@/messages/en.json";
import es from "@/messages/es.json";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const messages = {
  en,
  es,
} as const;

export type Messages = typeof en;

type MessageValue = string | { [key: string]: MessageValue };

export function getMessage(
  tree: MessageValue,
  path: string,
): MessageValue | undefined {
  return path.split(".").reduce<MessageValue | undefined>((current, segment) => {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    return current[segment];
  }, tree);
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function resolvePluralMessage(
  value: MessageValue,
  count: number,
): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  const key = count === 1 ? "one" : "other";
  const selected = value[key];

  return typeof selected === "string" ? selected : undefined;
}
