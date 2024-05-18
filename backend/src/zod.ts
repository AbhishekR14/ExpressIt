import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
  postId: z.string(),
});

export const onlyPostIdSchema = z.object({
  postId: z.string(),
});
