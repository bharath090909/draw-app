import { z } from "zod";

// =========================
// User Schema
// =========================

export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  photo: z.string().url().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

// =========================
// Room Schema
// =========================

export const createRoomSchema = z.object({
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" }),
  adminId: z.string(),
});

export const joinRoomSchema = z.object({
  roomSlug: z.string(),
  userId: z.string().uuid(),
});

// =========================
// Chat Schema
// =========================

export const createChatSchema = z.object({
  roomId: z.number({ message: "Room ID is required" }),
  userId: z.string(),
  message: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(500, { message: "Message too long (max 500 chars)" }),
});
