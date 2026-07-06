import { count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { getOffset, type PaginationParams } from "@/lib/utils/pagination";

export async function findPostById(postId: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  return post ?? null;
}

export async function findPostsByCourse(
  courseId: string,
  { page, limit }: PaginationParams,
) {
  const offset = getOffset(page, limit);

  const [totalRow] = await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.courseId, courseId));

  const items = await db
    .select()
    .from(posts)
    .where(eq(posts.courseId, courseId))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items,
    total: totalRow?.count ?? 0,
  };
}

export async function findPostsByIds(postIds: string[]) {
  if (postIds.length === 0) {
    return [];
  }

  return db.select().from(posts).where(inArray(posts.id, postIds));
}
