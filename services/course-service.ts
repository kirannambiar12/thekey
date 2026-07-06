import type { AuthUser } from "@/lib/auth";
import { findAllCourses } from "@/repositories/course-repository";
import { getEnrolledCourseIds } from "@/repositories/enrollment-repository";

export async function listCoursesForUser(user: AuthUser) {
  const courses = await findAllCourses();

  if (user.role === "moderator") {
    return courses;
  }

  const enrolledIds = new Set(await getEnrolledCourseIds(user.id));
  return courses.filter((course) => enrolledIds.has(course.id));
}
