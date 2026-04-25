import { cookies } from "next/headers";
import { z } from "zod";
import { created, fail, readJson } from "@/lib/api";
import { createSessionToken, hashPassword, hashSessionToken, publicUser, sessionCookieName, sessionExpiry } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailSchema, passwordSchema } from "@/lib/validators";

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(1).max(120)
});

export async function POST(request: Request) {
  const parsed = await readJson(request, registerSchema);
  if ("error" in parsed) return parsed.error;

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return fail("conflict", "An account already exists for this email.");

  const token = createSessionToken();
  const expiresAt = sessionExpiry();
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash: await hashPassword(parsed.data.password),
      sessions: { create: { tokenHash: hashSessionToken(token), expiresAt } },
      settings: { create: {} },
      profile: { create: {} }
    }
  });

  cookies().set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });

  return created({ user: publicUser(user) });
}
