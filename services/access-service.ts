import type { AuthUser } from "@/lib/auth";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { findCourseById } from "@/repositories/course-repository";
import { isUserEnrolledInCourse } from "@/repositories/enrollment-repository";
import { findPostById } from "@/repositories/post-repository";
import type { Post } from "@/services/types";

export async function getPostOrThrow(postId: string): Promise<Post> {
  const post = await findPostById(postId);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  return post;
}

export async function assertCanAccessCourse(
  user: AuthUser,
  courseId: string,
): Promise<void> {
  const course = await findCourseById(courseId);

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (user.role === "moderator") {
    return;
  }

  const enrolled = await isUserEnrolledInCourse(user.id, courseId);

  if (!enrolled) {
    throw new ForbiddenError("You are not enrolled in this course");
  }
}

export async function assertCanAccessPost(
  user: AuthUser,
  postId: string,
): Promise<Post> {
  const post = await getPostOrThrow(postId);
  await assertCanAccessCourse(user, post.courseId);
  return post;
}
