"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCourseFeed } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuth } from "@/lib/auth/context";

interface UseCourseFeedOptions {
  courseId: string | null;
  page?: number;
  limit?: number;
}

export function useCourseFeed({
  courseId,
  page = 1,
  limit = 20,
}: UseCourseFeedOptions) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.feed.list(user.id, courseId ?? "", page, limit),
    queryFn: () => fetchCourseFeed(user, courseId!, page, limit),
    enabled: Boolean(courseId),
  });
}
