import { describe, expect, it } from "vitest";
import { formatMessage, getMessage, resolvePluralMessage } from "@/lib/i18n";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

describe("i18n pluralization", () => {
  it("uses singular form for one save in English", () => {
    const value = getMessage(en, "post.savesCount");
    const message = resolvePluralMessage(value!, 1);

    expect(message).toBe("1 save");
  });

  it("uses plural form for multiple saves in English", () => {
    const value = getMessage(en, "post.savesCount");
    const message = formatMessage(resolvePluralMessage(value!, 12)!, {
      count: 12,
    });

    expect(message).toBe("12 saves");
  });

  it("uses plural form for multiple saves in Spanish", () => {
    const value = getMessage(es, "post.savesCount");
    const message = formatMessage(resolvePluralMessage(value!, 12)!, {
      count: 12,
    });

    expect(message).toBe("12 guardados");
  });
});
