import { z } from "zod";
import { ValidationError } from "@/lib/errors";

export function parseSearchParams<T extends z.ZodType>(
  request: Request,
  schema: T,
): z.infer<T> {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const result = schema.safeParse(raw);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? "Invalid query parameters";
    throw new ValidationError(message);
  }

  return result.data;
}

export function parseParams<T extends z.ZodType>(
  params: unknown,
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(params);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid path parameters";
    throw new ValidationError(message);
  }

  return result.data;
}
