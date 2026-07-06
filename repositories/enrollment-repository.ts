import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courseEnrollments } from "@/lib/db/schema";

export async function isUserEnrolledInCourse(
  userId: string,
  courseId: string,
): Promise<boolean> {
  const [enrollment] = await db
    .select({ id: courseEnrollments.id })
    .from(courseEnrollments)
    .where(
      and(
        eq(courseEnrollments.userId, userId),
        eq(courseEnrollments.courseId, courseId),
      ),
    )
    .limit(1);

  return Boolean(enrollment);
}

export async function getEnrolledCourseIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ courseId: courseEnrollments.courseId })
    .from(courseEnrollments)
    .where(eq(courseEnrollments.userId, userId));

  return rows.map((row) => row.courseId);
}
