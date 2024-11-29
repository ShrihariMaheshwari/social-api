import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const createPostSchema = z.object({
  content: z.string().min(1, "Content cannot be empty").max(280, "Content too long"),
  mediaUrls: z.array(z.string().url("Invalid URL")).optional().default([]),
  platform: z.enum(['twitter', 'facebook', 'instagram'] as const),
  status: z.enum(['draft', 'published', 'scheduled'] as const).default('draft'),
  scheduledFor: z.string().datetime().optional()
});

export const updatePostSchema = createPostSchema.partial();

