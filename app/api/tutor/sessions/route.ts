import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const sessionSchema = z.object({
  topic: z.string().trim().min(1).max(160),
  openingPrompt: z.string().trim().max(2000).optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const sessions = await prisma.tutorSession.findMany({
      where: { userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 4 } },
      orderBy: { updatedAt: "desc" }
    });
    return ok({ sessions });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request) {
  const parsed = await readJson(request, sessionSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const session = await prisma.tutorSession.create({
      data: {
        userId: user.id,
        topic: parsed.data.topic,
        messages: parsed.data.openingPrompt
          ? { create: { role: "user", content: parsed.data.openingPrompt } }
          : undefined
      },
      include: { messages: true }
    });
    return created({ session });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
