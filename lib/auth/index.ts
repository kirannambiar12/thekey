import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

export type Role = "student" | "moderator";

export interface AuthUser {
  id: string;
  role: Role;
}

export function getAuthUser(headers: Headers): AuthUser {
  const userId = headers.get("x-user-id");
  const role = headers.get("x-role");

  if (!userId || !role) {
    throw new UnauthorizedError();
  }

  if (role !== "student" && role !== "moderator") {
    throw new UnauthorizedError("Invalid role");
  }

  return { id: userId, role };
}

export function assertOwnSavedPosts(userId: string, requestedUserId: string) {
  if (userId !== requestedUserId) {
    throw new ForbiddenError("You can only view your own saved posts");
  }
}
