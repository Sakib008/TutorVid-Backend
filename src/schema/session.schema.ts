
import { z } from "zod";
import { VideoSchema } from "./video.schema.js";

export const SessionSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3, "Session name must be at least 3 characters"),
    sessionUrl: z.string(),
    userId: z.uuid(),
    videos: z.array(VideoSchema),
    createdAt: z.date(),
});

export type Session = z.infer<typeof SessionSchema>;