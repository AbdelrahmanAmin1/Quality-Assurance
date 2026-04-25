import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stubTutorReply } from "@/lib/stubs";

const messageSchema = z.object({
  content: z.string().trim().min(1).max(4000)
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const session = await prisma.tutorSession.findFirst({ where: { id: params.id, userId: user.id } });
    if (!session) return fail("not_found", "Tutor session not found.");
    const messages = await prisma.tutorMessage.findMany({ where: { sessionId: params.id }, orderBy: { createdAt: "asc" } });
    return ok({ messages });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, messageSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const session = await prisma.tutorSession.findFirst({ where: { id: params.id, userId: user.id } });
    if (!session) return fail("not_found", "Tutor session not found.");

    const reply = stubTutorReply(parsed.data.content);
    const [userMessage, assistantMessage] = await prisma.$transaction([
      prisma.tutorMessage.create({ data: { sessionId: params.id, role: "user", content: parsed.data.content } }),
      prisma.tutorMessage.create({
        data: {
          sessionId: params.id,
          role: "assistant",
          content: reply.message,
          metadata: JSON.stringify({ provider: reply.provider, nextPrompts: reply.nextPrompts })
        }
      }),
      prisma.tutorSession.update({ where: { id: params.id }, data: { updatedAt: new Date() } })
    ]).then(([userCreated, assistantCreated]) => [userCreated, assistantCreated]);

    return created({ messages: [userMessage, assistantMessage], nextPrompts: reply.nextPrompts });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
