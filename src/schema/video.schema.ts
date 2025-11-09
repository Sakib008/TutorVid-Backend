import { z } from "zod";

export const VideoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(3, "Video title must be at least 3 characters"),
  url: z.url(),
  sessionId: z.uuid(),
  createdAt: z.date(),
});

export type Video = z.infer<typeof VideoSchema>;
