"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { useCourseFeed } from "@/hooks/use-course-feed";
import { useCourses } from "@/hooks/use-courses";
import { useSavePost, useUnsavePost } from "@/hooks/use-save-post";
import type { ApiPost } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/context";

export default function ForumPage() {
  const { t } = useTranslations();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const coursesQuery = useCourses();
  const feedQuery = useCourseFeed({ courseId, page, limit: 10 });
  const saveMutation = useSavePost();
  const unsaveMutation = useUnsavePost();

  const togglingPostId = saveMutation.isPending
    ? saveMutation.variables
    : unsaveMutation.isPending
      ? unsaveMutation.variables
      : undefined;

  useEffect(() => {
    if (!courseId && coursesQuery.data?.length) {
      setCourseId(coursesQuery.data[0].id);
    }
  }, [courseId, coursesQuery.data]);

  useEffect(() => {
    setPage(1);
  }, [courseId]);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("forum.title")}
          </h1>

          {coursesQuery.data && coursesQuery.data.length > 0 ? (
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              <span className="font-medium">{t("forum.selectCourse")}</span>
              <select
                className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                value={courseId ?? ""}
                onChange={(event) => setCourseId(event.target.value)}
              >
                {coursesQuery.data.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {coursesQuery.isLoading ? (
          <LoadingState message={t("common.loading")} />
        ) : null}

        {coursesQuery.isError ? (
          <ErrorState message={t("common.error")} />
        ) : null}

        {!coursesQuery.isLoading &&
        !coursesQuery.isError &&
        coursesQuery.data?.length === 0 ? (
          <EmptyState title={t("forum.noCourse")} />
        ) : null}

        {courseId && feedQuery.isLoading ? (
          <LoadingState message={t("forum.loading")} />
        ) : null}

        {courseId && feedQuery.isError ? (
          <ErrorState message={t("common.error")} />
        ) : null}

        {courseId &&
        feedQuery.data &&
        !feedQuery.isLoading &&
        feedQuery.data.items.length === 0 ? (
          <EmptyState title={t("forum.noPosts")} />
        ) : null}

        {feedQuery.data && feedQuery.data.items.length > 0 ? (
          <div className="space-y-4">
            {feedQuery.data.items.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleSave={handleToggleSave}
                isToggling={togglingPostId === post.id}
              />
            ))}

            <Pagination
              page={feedQuery.data.page}
              totalPages={feedQuery.data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
