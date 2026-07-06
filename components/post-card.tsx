"use client";

import type { ApiPost } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/context";
import { formatPostDate } from "@/lib/utils/format-date";

interface PostCardProps {
  post: ApiPost;
  onToggleSave: (post: ApiPost) => void;
  isToggling?: boolean;
}

export function PostCard({ post, onToggleSave, isToggling }: PostCardProps) {
  const { t, locale } = useTranslations();

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-700">{post.body}</p>
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(post)}
          disabled={isToggling}
          aria-pressed={post.hasSaved}
          className={[
            "shrink-0 rounded border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
            post.hasSaved
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
          ].join(" ")}
        >
          {post.hasSaved ? t("post.unsave") : t("post.save")}
        </button>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <time dateTime={post.createdAt}>
          {formatPostDate(post.createdAt, locale)}
        </time>
        <span aria-hidden="true">·</span>
        <span>{t("post.savesCount", { count: post.savesCount })}</span>
      </footer>
    </article>
  );
}
