import { z } from "zod";

export const courseIdParamSchema = z.object({
  courseId: z.string().min(1),
});

export const postIdParamSchema = z.object({
  postId: z.string().min(1),
});
