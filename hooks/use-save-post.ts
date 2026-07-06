"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePost, unsavePost } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuth } from "@/lib/auth/context";

function useInvalidatePostQueries() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.feed.all(user.id) });
    queryClient.invalidateQueries({
      queryKey: queryKeys.savedPosts.all(user.id),
    });
  };
}

export function useSavePost() {
  const { user } = useAuth();
  const invalidate = useInvalidatePostQueries();

  return useMutation({
    mutationFn: (postId: string) => savePost(user, postId),
    onSuccess: invalidate,
  });
}

export function useUnsavePost() {
  const { user } = useAuth();
  const invalidate = useInvalidatePostQueries();

  return useMutation({
    mutationFn: (postId: string) => unsavePost(user, postId),
    onSuccess: invalidate,
  });
}
