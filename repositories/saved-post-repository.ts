import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts, savedPosts } from "@/lib/db/schema";
import { getOffset, type PaginationParams } from "@/lib/utils/pagination";

export async function findSavedPost(userId: string, postId: string) {
  const [row] = await db
    .select()
    .from(savedPosts)
    .where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId)))
    .limit(1);

  return row ?? null;
}

export async function insertSavedPost(userId: string, postId: string) {
  const now = new Date();

  const [row] = await db
    .insert(savedPosts)
    .values({
      userId,
      postId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    })
    .returning();

  return row;
}

export async function reactivateSavedPost(id: number) {
  const now = new Date();

  const [row] = await db
    .update(savedPosts)
    .set({
      deletedAt: null,
      updatedAt: now,
    })
    .where(eq(savedPosts.id, id))
    .returning();

  return row ?? null;
}

export async function softDeleteSavedPost(id: number) {
  const now = new Date();

  const [row] = await db
    .update(savedPosts)
    .set({
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(savedPosts.id, id))
    .returning();

  return row ?? null;
}

export async function findActiveSavedPostsByUser(
  userId: string,
  { page, limit }: PaginationParams,
) {
  const offset = getOffset(page, limit);

  const [totalRow] = await db
    .select({ count: count() })
    .from(savedPosts)
    .where(and(eq(savedPosts.userId, userId), isNull(savedPosts.deletedAt)));

  const rows = await db
    .select({
      savedPost: savedPosts,
      post: posts,
    })
    .from(savedPosts)
    .innerJoin(posts, eq(savedPosts.postId, posts.id))
    .where(and(eq(savedPosts.userId, userId), isNull(savedPosts.deletedAt)))
    .orderBy(desc(savedPosts.updatedAt))
    .limit(limit)
    .offset(offset);

  return {
    items: rows,
    total: totalRow?.count ?? 0,
  };
}

export async function getActiveSaveCountsByPostIds(
  postIds: string[],
): Promise<Map<string, number>> {
  if (postIds.length === 0) {
    return new Map();
  }

  const rows = await db
    .select({
      postId: savedPosts.postId,
      count: count(),
    })
    .from(savedPosts)
    .where(and(inArray(savedPosts.postId, postIds), isNull(savedPosts.deletedAt)))
    .groupBy(savedPosts.postId);

  return new Map(rows.map((row) => [row.postId, row.count]));
}

export async function getActiveSavedPostIdsForUser(
  userId: string,
  postIds: string[],
): Promise<Set<string>> {
  if (postIds.length === 0) {
    return new Set();
  }

  const rows = await db
    .select({ postId: savedPosts.postId })
    .from(savedPosts)
    .where(
      and(
        eq(savedPosts.userId, userId),
        inArray(savedPosts.postId, postIds),
        isNull(savedPosts.deletedAt),
      ),
    );

  return new Set(rows.map((row) => row.postId));
}

export async function countActiveSavesForPost(postId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(savedPosts)
    .where(and(eq(savedPosts.postId, postId), isNull(savedPosts.deletedAt)));

  return row?.count ?? 0;
}

export async function isPostSavedByUser(
  userId: string,
  postId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: savedPosts.id })
    .from(savedPosts)
    .where(
      and(
        eq(savedPosts.userId, userId),
        eq(savedPosts.postId, postId),
        isNull(savedPosts.deletedAt),
      ),
    )
    .limit(1);

  return Boolean(row);
}
