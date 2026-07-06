import type { AuthUser } from "@/lib/auth";
import { paginate, type PaginationParams } from "@/lib/utils/pagination";
import {
  countActiveSavesForPost,
  findActiveSavedPostsByUser,
  findSavedPost,
  insertSavedPost,
  isPostSavedByUser,
  reactivateSavedPost,
  softDeleteSavedPost,
} from "@/repositories/saved-post-repository";
import {
  assertCanAccessPost,
} from "@/services/access-service";
import { hydratePosts } from "@/services/post-service";
import type { HydratedPost, SavePostResult } from "@/services/types";

async function buildSaveResult(
  userId: string,
  postId: string,
): Promise<SavePostResult> {
  const [hasSaved, savesCount] = await Promise.all([
    isPostSavedByUser(userId, postId),
    countActiveSavesForPost(postId),
  ]);

  return { postId, hasSaved, savesCount };
}

export async function savePost(
  user: AuthUser,
  postId: string,
): Promise<SavePostResult> {
  await assertCanAccessPost(user, postId);

  const existing = await findSavedPost(user.id, postId);

  if (existing && existing.deletedAt === null) {
    return buildSaveResult(user.id, postId);
  }

  if (existing) {
    await reactivateSavedPost(existing.id);
    return buildSaveResult(user.id, postId);
  }

  await insertSavedPost(user.id, postId);
  return buildSaveResult(user.id, postId);
}

export async function unsavePost(
  user: AuthUser,
  postId: string,
): Promise<SavePostResult> {
  await assertCanAccessPost(user, postId);

  const existing = await findSavedPost(user.id, postId);

  if (!existing || existing.deletedAt !== null) {
    return buildSaveResult(user.id, postId);
  }

  await softDeleteSavedPost(existing.id);
  return buildSaveResult(user.id, postId);
}

export async function getSavedPosts(
  user: AuthUser,
  pagination: PaginationParams,
  ownerId: string = user.id,
) {
  const { items, total } = await findActiveSavedPostsByUser(
    ownerId,
    pagination,
  );

  const posts = items.map((row) => row.post);
  const hydratedPosts = await hydratePosts(posts, user.id);

  const hydratedById = new Map(
    hydratedPosts.map((post) => [post.id, post]),
  );

  const resultItems: HydratedPost[] = items.map((row) => {
    const hydrated = hydratedById.get(row.post.id);
    if (!hydrated) {
      throw new Error(`Missing hydrated post for ${row.post.id}`);
    }
    return hydrated;
  });

  return paginate(resultItems, total, pagination);
}

export async function getPost(
  user: AuthUser,
  postId: string,
): Promise<HydratedPost> {
  const post = await assertCanAccessPost(user, postId);
  const [hydrated] = await hydratePosts([post], user.id);
  return hydrated;
}
