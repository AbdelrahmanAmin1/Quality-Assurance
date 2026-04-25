import { created, fail } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const room = await prisma.studyRoom.findUnique({ where: { id: params.id } });
    if (!room) return fail("not_found", "Study room not found.");
    const member = await prisma.studyRoomMember.upsert({
      where: { roomId_userId: { roomId: params.id, userId: user.id } },
      update: {},
      create: { roomId: params.id, userId: user.id, role: "member" }
    });
    return created({ member });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
