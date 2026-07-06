import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role", { enum: ["student", "moderator"] }).notNull(),
});

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const courseEnrollments = sqliteTable(
  "course_enrollments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id),
  },
  (table) => [
    uniqueIndex("course_enrollments_user_course_idx").on(
      table.userId,
      table.courseId,
    ),
  ],
);

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const savedPosts = sqliteTable(
  "saved_posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    uniqueIndex("saved_posts_user_post_idx").on(table.userId, table.postId),
  ],
);
