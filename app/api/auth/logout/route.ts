import { cookies } from "next/headers";
import { ok } from "@/lib/api";
import { hashSessionToken, sessionCookieName } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const token = cookies().get(sessionCookieName)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
  }
  cookies().delete(sessionCookieName);
  return ok({ loggedOut: true });
}
