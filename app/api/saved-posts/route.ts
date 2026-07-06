import { ForbiddenError } from "@/lib/errors";
import { handleRoute } from "@/lib/api/handler";
import { savedPostsQuerySchema } from "@/lib/validators/pagination";
import { parseSearchParams } from "@/lib/validators/parse";
import { getSavedPosts } from "@/services/saved-post-service";

export async function GET(request: Request) {
  return handleRoute(request, async ({ user, request: req }) => {
    const query = parseSearchParams(req, savedPostsQuerySchema);
    const ownerId = query.userId ?? user.id;

    if (user.role === "student" && ownerId !== user.id) {
      throw new ForbiddenError("You can only view your own saved posts");
    }

    return getSavedPosts(user, query, ownerId);
  });
}
