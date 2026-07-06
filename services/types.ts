import type { posts } from "@/lib/db/schema";

export type Post = typeof posts.$inferSelect;

export interface HydratedPost extends Post {
  hasSaved: boolean;
  savesCount: number;
}

export interface SavePostResult {
  postId: string;
  hasSaved: boolean;
  savesCount: number;
}
