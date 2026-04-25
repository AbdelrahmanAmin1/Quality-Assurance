import { cookies } from "next/headers";
import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { createSessionToken, hashSessionToken, publicUser, sessionCookieName, sessionExpiry, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailSchema, passwordSchema } from "@/lib/validators";

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export async function POST(request: Request) {
  const parsed = await readJson(request, loginSchema);
  if ("error" in parsed) return parsed.error;

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return fail("unauthorized", "Invalid email or password.");
  }

  const token = createSessionToken();
  const expiresAt = sessionExpiry();
  await prisma.session.create({ data: { userId: user.id, tokenHash: hashSessionToken(token), expiresAt } });

  const isHttps = request.url.startsWith("https://") || request.headers.get("x-forwarded-proto") === "https";
  cookies().set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    expires: expiresAt,
    path: "/"
  });

  return ok({ user: publicUser(user) });
}
