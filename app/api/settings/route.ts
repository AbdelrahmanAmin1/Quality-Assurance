import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  theme: z.enum(["dark", "studious", "light", "space"]).optional(),
  emailDigest: z.boolean().optional(),
  studyReminders: z.boolean().optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    });
    return ok({ settings });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function PATCH(request: Request) {
  const parsed = await readJson(request, settingsSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: parsed.data,
      create: { userId: user.id, ...parsed.data }
    });
    return ok({ settings });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
