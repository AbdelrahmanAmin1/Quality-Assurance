import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roomUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  topic: z.string().trim().max(200).optional(),
  board: z.record(z.unknown()).optional()
});

async function requireRoomMember(roomId: string, userId: string) {
  return prisma.studyRoomMember.findUnique({ where: { roomId_userId: { roomId, userId } } });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const member = await requireRoomMember(params.id, user.id);
    if (!member) return fail("not_found", "Study room not found.");
    const room = await prisma.studyRoom.findUnique({
      where: { id: params.id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        messages: { orderBy: { createdAt: "asc" }, take: 100 }
      }
    });
    return ok({ room });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, roomUpdateSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const member = await requireRoomMember(params.id, user.id);
    if (!member) return fail("not_found", "Study room not found.");
    const room = await prisma.studyRoom.update({
      where: { id: params.id },
      data: {
        name: parsed.data.name,
        topic: parsed.data.topic,
        board: parsed.data.board ? JSON.stringify(parsed.data.board) : undefined
      }
    });
    return ok({ room });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const member = await requireRoomMember(params.id, user.id);
    if (!member) return fail("not_found", "Study room not found.");
    if (member.role !== "owner") return fail("forbidden", "Only the room owner can delete the room.");
    await prisma.studyRoom.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
