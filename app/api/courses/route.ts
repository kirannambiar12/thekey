import { handleRoute } from "@/lib/api/handler";
import { listCoursesForUser } from "@/services/course-service";

export async function GET(request: Request) {
  return handleRoute(request, async ({ user }) => {
    return listCoursesForUser(user);
  });
}
