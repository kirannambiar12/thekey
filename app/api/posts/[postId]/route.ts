import { handleRoute } from "@/lib/api/handler";
import { postIdParamSchema } from "@/lib/validators/params";
import { parseParams } from "@/lib/validators/parse";
import { getPost } from "@/services/saved-post-service";

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  return handleRoute(request, async ({ user }) => {
    const { postId } = parseParams(await params, postIdParamSchema);
    return getPost(user, postId);
  });
}
