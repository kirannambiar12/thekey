import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/posts/[postId]/save/route";
import { resetDatabase } from "@/tests/helpers/reset-db";

function createRequest(postId: string, userId: string, role: string) {
  return new Request(`http://localhost/api/posts/${postId}/save`, {
    method: "POST",
    headers: {
      "x-user-id": userId,
      "x-role": role,
    },
  });
}

describe("POST /api/posts/[postId]/save", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("saves a post for an enrolled student", async () => {
    const response = await POST(createRequest("post-1", "user-alice", "student"), {
      params: Promise.resolve({ postId: "post-1" }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      postId: "post-1",
      hasSaved: true,
      savesCount: 3,
    });
  });

  it("returns 403 when a student saves a post outside their enrolled courses", async () => {
    const response = await POST(createRequest("post-4", "user-alice", "student"), {
      params: Promise.resolve({ postId: "post-4" }),
    });

    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error.code).toBe("FORBIDDEN");
  });

  it("returns 401 when auth headers are missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/posts/post-1/save", { method: "POST" }),
      { params: Promise.resolve({ postId: "post-1" }) },
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });
});
