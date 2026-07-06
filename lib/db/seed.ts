import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "@/lib/db";
import {
  courseEnrollments,
  courses,
  posts,
  savedPosts,
  users,
} from "@/lib/db/schema";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

async function seed() {
  migrate(db, { migrationsFolder: "./drizzle" });

  await db.delete(savedPosts);
  await db.delete(posts);
  await db.delete(courseEnrollments);
  await db.delete(courses);
  await db.delete(users);

  await db.insert(users).values([
    { id: "user-alice", name: "Alice Johnson", role: "student" },
    { id: "user-bob", name: "Bob Smith", role: "student" },
    { id: "user-carol", name: "Carol Lee", role: "student" },
    { id: "user-dan", name: "Dan Rivera", role: "student" },
    { id: "user-mod", name: "Morgan Admin", role: "moderator" },
  ]);

  await db.insert(courses).values([
    { id: "course-ts", name: "Intro to TypeScript" },
    { id: "course-security", name: "Web Security Fundamentals" },
  ]);

  await db.insert(courseEnrollments).values([
    { userId: "user-alice", courseId: "course-ts" },
    { userId: "user-bob", courseId: "course-ts" },
    { userId: "user-bob", courseId: "course-security" },
    { userId: "user-carol", courseId: "course-security" },
    { userId: "user-dan", courseId: "course-ts" },
  ]);

  await db.insert(posts).values([
    {
      id: "post-1",
      courseId: "course-ts",
      authorId: "user-alice",
      title: "Best practices for strict TypeScript",
      body: "Enable strict mode and avoid any. What patterns do you use?",
      createdAt: daysAgo(1),
    },
    {
      id: "post-2",
      courseId: "course-ts",
      authorId: "user-bob",
      title: "Generics in React components",
      body: "How do you type reusable components without over-complicating props?",
      createdAt: daysAgo(3),
    },
    {
      id: "post-3",
      courseId: "course-ts",
      authorId: "user-dan",
      title: "Drizzle vs Prisma for small projects",
      body: "Curious what people prefer for SQLite-backed apps.",
      createdAt: daysAgo(5),
    },
    {
      id: "post-4",
      courseId: "course-security",
      authorId: "user-carol",
      title: "CSRF protection in modern SPAs",
      body: "Are cookie-based CSRF tokens still the default approach?",
      createdAt: daysAgo(2),
    },
    {
      id: "post-5",
      courseId: "course-security",
      authorId: "user-bob",
      title: "Rate limiting API routes",
      body: "What strategies work well without adding Redis?",
      createdAt: daysAgo(4),
    },
    {
      id: "post-6",
      courseId: "course-security",
      authorId: "user-alice",
      title: "OWASP top 10 refresher",
      body: "Sharing notes from a recent security workshop.",
      createdAt: daysAgo(6),
    },
  ]);

  const savedAt = daysAgo(2);
  const unsavedAt = daysAgo(1);

  await db.insert(savedPosts).values([
    {
      userId: "user-alice",
      postId: "post-2",
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
      deletedAt: null,
    },
    {
      userId: "user-alice",
      postId: "post-4",
      createdAt: savedAt,
      updatedAt: savedAt,
      deletedAt: null,
    },
    {
      userId: "user-bob",
      postId: "post-1",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
      deletedAt: null,
    },
    {
      userId: "user-bob",
      postId: "post-5",
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
      deletedAt: null,
    },
    {
      userId: "user-carol",
      postId: "post-1",
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
      deletedAt: null,
    },
    // Soft-deleted save — history preserved for reactivation demos
    {
      userId: "user-alice",
      postId: "post-5",
      createdAt: daysAgo(8),
      updatedAt: unsavedAt,
      deletedAt: unsavedAt,
    },
  ]);

  console.log("Database seeded.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
