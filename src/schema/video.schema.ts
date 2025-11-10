import { z } from "zod";

export const createVideoSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  url: z.url("Invalid URL"),
  publicId: z.string().optional(),
  duration: z.number().int().positive().optional(),
  sessionId: z.uuid("Invalid session ID"),
});

export const updateVideoSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  url: z.url("Invalid URL").optional(),
  sessionId: z.uuid("Invalid session ID").optional(),
  publicId: z.string().optional(),
  duration: z.number().int().positive().optional(),
});

export const VideoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(3, "Video title must be at least 3 characters"),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  url: z.url(),
  publicId: z.string().optional(),
  sessionId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
export type Video = z.infer<typeof VideoSchema>;
