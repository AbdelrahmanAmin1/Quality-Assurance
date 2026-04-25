import { z } from "zod";

export const emailSchema = z.string().trim().email().toLowerCase();
export const passwordSchema = z.string().min(8).max(128);
export const idSchema = z.string().cuid();

export const paginationSchema = z.object({
  take: z.coerce.number().int().min(1).max(100).default(25),
  skip: z.coerce.number().int().min(0).default(0)
});
