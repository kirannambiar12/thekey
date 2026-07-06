import type { AuthUser } from "@/lib/auth";
import { paginate, type PaginationParams } from "@/lib/utils/pagination";
import { findPostsByCourse } from "@/repositories/post-repository";
import {
  getActiveSaveCountsByPostIds,
  getActiveSavedPostIdsForUser,
} from "@/repositories/saved-post-repository";
import { assertCanAccessCourse } from "@/services/access-service";
import type { HydratedPost, Post } from "@/services/types";

async function hydratePosts(
  posts: Post[],
  userId: string,
): Promise<HydratedPost[]> {
  const postIds = posts.map((post) => post.id);

  const [saveCounts, savedPostIds] = await Promise.all([
    getActiveSaveCountsByPostIds(postIds),
    getActiveSavedPostIdsForUser(userId, postIds),
  ]);

  return posts.map((post) => ({
    ...post,
    hasSaved: savedPostIds.has(post.id),
    savesCount: saveCounts.get(post.id) ?? 0,
  }));
}

export async function getCourseFeed(
  user: AuthUser,
  courseId: string,
  pagination: PaginationParams,
) {
  await assertCanAccessCourse(user, courseId);

  const { items, total } = await findPostsByCourse(courseId, pagination);
  const hydratedItems = await hydratePosts(items, user.id);

  return paginate(hydratedItems, total, pagination);
}

export { hydratePosts };
