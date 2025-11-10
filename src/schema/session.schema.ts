import { z } from 'zod';
import { VideoSchema } from "./video.schema.js";
import type { create } from 'domain';

export const createSessionSchema = z.object({
  title: z.string().min(3, 'Title is required 3 characters minimum'),
  description: z.string().optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(3, 'Title is required 3 characters minimum'),
  description: z.string().optional(),
});

export const SessionSchema = z.object({
    id: z.uuid(),
    title: z.string().min(3, "Session name must be at least 3 characters"),
    description: z.string().optional(),
    createdById: z.uuid(),
    videos: z.array(VideoSchema),
    createdAt: z.date(),
});
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type Session = z.infer<typeof SessionSchema>;