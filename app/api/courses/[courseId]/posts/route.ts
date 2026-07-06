import { handleRoute } from "@/lib/api/handler";
import { courseIdParamSchema } from "@/lib/validators/params";
import { paginationSchema } from "@/lib/validators/pagination";
import { parseParams, parseSearchParams } from "@/lib/validators/parse";
import { getCourseFeed } from "@/services/post-service";

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  return handleRoute(request, async ({ user, request: req }) => {
    const { courseId } = parseParams(await params, courseIdParamSchema);
    const pagination = parseSearchParams(req, paginationSchema);

    return getCourseFeed(user, courseId, pagination);
  });
}
