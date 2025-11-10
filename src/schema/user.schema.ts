import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["ADMIN", "STUDENT"]).default("STUDENT"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

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
  userType: z.enum(["ADMIN", "STUDENT"]).default("STUDENT"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  sessions: z.array(z.object({})).optional(),
  createdAt: z.date().safeParse(new Date()),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof UserSchema>;
