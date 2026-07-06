import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";

export async function findAllCourses() {
  return db.select().from(courses).orderBy(asc(courses.name));
}

export async function findCourseById(courseId: string) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  return course ?? null;
}
