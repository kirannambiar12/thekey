"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { useSavedPosts } from "@/hooks/use-saved-posts";
import { useSavePost, useUnsavePost } from "@/hooks/use-save-post";
import type { ApiPost } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/context";

export default function SavedPage() {
  const { t } = useTranslations();
  const [page, setPage] = useState(1);

  const savedQuery = useSavedPosts({ page, limit: 10 });
  const saveMutation = useSavePost();
  const unsaveMutation = useUnsavePost();

  const togglingPostId = saveMutation.isPending
    ? saveMutation.variables
    : unsaveMutation.isPending
      ? unsaveMutation.variables
      : undefined;

  function handleToggleSave(post: ApiPost) {
    if (post.hasSaved) {
      unsaveMutation.mutate(post.id);
      return;
    }

    saveMutation.mutate(post.id);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {t("saved.title")}
        </h1>

        {savedQuery.isLoading ? (
          <LoadingState message={t("saved.loading")} />
        ) : null}

        {savedQuery.isError ? (
          <ErrorState message={t("common.error")} />
        ) : null}

        {savedQuery.data?.items.length === 0 ? (
          <EmptyState
            title={t("saved.empty")}
            description={t("saved.emptyHint")}
          />
        ) : null}

        {savedQuery.data && savedQuery.data.items.length > 0 ? (
          <div className="space-y-4">
            {savedQuery.data.items.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleSave={handleToggleSave}
                isToggling={togglingPostId === post.id}
              />
            ))}

            <Pagination
              page={savedQuery.data.page}
              totalPages={savedQuery.data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
