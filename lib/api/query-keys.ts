export const queryKeys = {
  all: ["forum"] as const,
  courses: {
    all: (userId: string) => [...queryKeys.all, "courses", userId] as const,
  },
  feed: {
    all: (userId: string) => [...queryKeys.all, "feed", userId] as const,
    list: (
      userId: string,
      courseId: string,
      page: number,
      limit: number,
    ) => [...queryKeys.feed.all(userId), courseId, page, limit] as const,
  },
  savedPosts: {
    all: (userId: string) => [...queryKeys.all, "saved-posts", userId] as const,
    list: (userId: string, page: number, limit: number) =>
      [...queryKeys.savedPosts.all(userId), page, limit] as const,
  },
};
