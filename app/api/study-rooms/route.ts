import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roomSchema = z.object({
  name: z.string().trim().min(1).max(120),
  topic: z.string().trim().max(200).optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const rooms = await prisma.studyRoom.findMany({
      where: { members: { some: { userId: user.id } } },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { updatedAt: "desc" }
    });
    return ok({ rooms });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request) {
  const parsed = await readJson(request, roomSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const room = await prisma.studyRoom.create({
      data: {
        name: parsed.data.name,
        topic: parsed.data.topic,
        members: { create: { userId: user.id, role: "owner" } }
      },
      include: { members: true }
    });
    return created({ room });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
