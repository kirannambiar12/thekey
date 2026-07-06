import type { AuthUser } from "@/lib/auth";
import { ApiError } from "@/lib/api/errors";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiPost,
  Course,
  PaginatedResponse,
  SavePostResponse,
} from "@/lib/api/types";

async function request<T>(
  path: string,
  auth: AuthUser,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": auth.id,
      "x-role": auth.role,
      ...options.headers,
    },
  });

  const body = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok) {
    const error = "error" in body ? body.error : undefined;
    throw new ApiError(
      error?.message ?? "Request failed",
      response.status,
      error?.code ?? "UNKNOWN",
    );
  }

  return (body as ApiSuccessResponse<T>).data;
}

export function fetchCourses(auth: AuthUser) {
  return request<Course[]>("/api/courses", auth);
}

export function fetchCourseFeed(
  auth: AuthUser,
  courseId: string,
  page: number,
  limit: number,
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return request<PaginatedResponse<ApiPost>>(
    `/api/courses/${courseId}/posts?${params}`,
    auth,
  );
}

export function fetchSavedPosts(
  auth: AuthUser,
  page: number,
  limit: number,
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return request<PaginatedResponse<ApiPost>>(
    `/api/saved-posts?${params}`,
    auth,
  );
}

export function savePost(auth: AuthUser, postId: string) {
  return request<SavePostResponse>(`/api/posts/${postId}/save`, auth, {
    method: "POST",
  });
}

export function unsavePost(auth: AuthUser, postId: string) {
  return request<SavePostResponse>(`/api/posts/${postId}/save`, auth, {
    method: "DELETE",
  });
}
