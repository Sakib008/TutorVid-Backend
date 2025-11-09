import { z } from "zod";
import { SessionSchema } from "./session.schema.js";

const userTypes = ["ADMIN", "STUDENT"] as const;
export type UserType = (typeof userTypes)[number];

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9]{3,20}$/,
      "Username must not contain Special character."
    ),
  userType: z.enum(userTypes),
  password: z.string().min(8, "Password must be at least 8 characters"),
  sessions: z.array(SessionSchema),
  createdAt: z.date().safeParse(new Date()),
});

export type User = z.infer<typeof UserSchema>;
