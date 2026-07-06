import { beforeEach, describe, expect, it } from "vitest";
import type { AuthUser } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";
import { findSavedPost } from "@/repositories/saved-post-repository";
import { savePost, unsavePost } from "@/services/saved-post-service";
import { resetDatabase } from "@/tests/helpers/reset-db";

const alice: AuthUser = { id: "user-alice", role: "student" };

describe("saved post service", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe("savePost", () => {
    it("creates a new active save", async () => {
      const result = await savePost(alice, "post-1");

      expect(result.hasSaved).toBe(true);
      expect(result.savesCount).toBe(3);
    });

    it("is idempotent when the post is already saved", async () => {
      const first = await savePost(alice, "post-2");
      const second = await savePost(alice, "post-2");

      expect(first.hasSaved).toBe(true);
      expect(second.hasSaved).toBe(true);
      expect(second.savesCount).toBe(first.savesCount);
    });

    it("reactivates an existing soft-deleted save instead of inserting a duplicate", async () => {
      const before = await findSavedPost(alice.id, "post-3");
      expect(before?.deletedAt).not.toBeNull();

      const result = await savePost(alice, "post-3");
      const after = await findSavedPost(alice.id, "post-3");

      expect(result.hasSaved).toBe(true);
      expect(after?.id).toBe(before?.id);
      expect(after?.deletedAt).toBeNull();
    });
  });

  describe("unsavePost", () => {
    it("soft deletes an active save", async () => {
      const result = await unsavePost(alice, "post-2");
      const row = await findSavedPost(alice.id, "post-2");

      expect(result.hasSaved).toBe(false);
      expect(row?.deletedAt).not.toBeNull();
    });

    it("is idempotent when the post is already unsaved", async () => {
      await unsavePost(alice, "post-2");
      const result = await unsavePost(alice, "post-2");

      expect(result.hasSaved).toBe(false);
    });

    it("preserves history instead of deleting the row", async () => {
      const before = await findSavedPost(alice.id, "post-2");

      await unsavePost(alice, "post-2");

      const after = await findSavedPost(alice.id, "post-2");

      expect(before).not.toBeNull();
      expect(after).not.toBeNull();
      expect(after?.id).toBe(before?.id);
      expect(after?.deletedAt).not.toBeNull();
    });
  });

  describe("authorization", () => {
    it("rejects saves for posts in courses the student is not enrolled in", async () => {
      await expect(savePost(alice, "post-4")).rejects.toBeInstanceOf(
        ForbiddenError,
      );
    });
  });
});
