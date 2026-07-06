import { beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/saved-posts/route";
import { resetDatabase } from "@/tests/helpers/reset-db";

function createRequest(userId: string, role: string, query = "") {
  return new Request(`http://localhost/api/saved-posts${query}`, {
    headers: {
      "x-user-id": userId,
      "x-role": role,
    },
  });
}

describe("GET /api/saved-posts", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("returns saved posts for the authenticated student", async () => {
    const response = await GET(createRequest("user-alice", "student"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.items.length).toBeGreaterThan(0);
    expect(body.data.items.every((post: { hasSaved: boolean }) => post.hasSaved)).toBe(
      true,
    );
  });

  it("returns 403 when a student requests another user's saved list", async () => {
    const response = await GET(
      createRequest("user-alice", "student", "?userId=user-bob"),
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error.code).toBe("FORBIDDEN");
  });
});
