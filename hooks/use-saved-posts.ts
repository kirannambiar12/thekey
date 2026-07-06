"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSavedPosts } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuth } from "@/lib/auth/context";

interface UseSavedPostsOptions {
  page?: number;
  limit?: number;
}

export function useSavedPosts({ page = 1, limit = 20 }: UseSavedPostsOptions = {}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.savedPosts.list(user.id, page, limit),
    queryFn: () => fetchSavedPosts(user, page, limit),
  });
}
