import { handleRoute } from "@/lib/api/handler";
import { postIdParamSchema } from "@/lib/validators/params";
import { parseParams } from "@/lib/validators/parse";
import { savePost, unsavePost } from "@/services/saved-post-service";

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  return handleRoute(request, async ({ user }) => {
    const { postId } = parseParams(await params, postIdParamSchema);
    return savePost(user, postId);
  });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  return handleRoute(request, async ({ user }) => {
    const { postId } = parseParams(await params, postIdParamSchema);
    return unsavePost(user, postId);
  });
}
