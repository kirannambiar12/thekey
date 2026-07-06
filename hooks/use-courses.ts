"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuth } from "@/lib/auth/context";

export function useCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.courses.all(user.id),
    queryFn: () => fetchCourses(user),
  });
}
