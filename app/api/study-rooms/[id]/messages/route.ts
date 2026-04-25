import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const messageSchema = z.object({
  content: z.string().trim().min(1).max(2000)
});

async function isMember(roomId: string, userId: string) {
  return prisma.studyRoomMember.findUnique({ where: { roomId_userId: { roomId, userId } } });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const member = await isMember(params.id, user.id);
    if (!member) return fail("not_found", "Study room not found.");
    const messages = await prisma.studyRoomMessage.findMany({ where: { roomId: params.id }, orderBy: { createdAt: "asc" } });
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
    const member = await isMember(params.id, user.id);
    if (!member) return fail("not_found", "Study room not found.");
    const message = await prisma.studyRoomMessage.create({
      data: { roomId: params.id, authorId: user.id, content: parsed.data.content }
    });
    await prisma.studyRoom.update({ where: { id: params.id }, data: { updatedAt: new Date() } });
    return created({ message });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
