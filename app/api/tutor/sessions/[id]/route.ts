import { fail, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const session = await prisma.tutorSession.findFirst({
      where: { id: params.id, userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } }
    });
    if (!session) return fail("not_found", "Tutor session not found.");
    return ok({ session });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const session = await prisma.tutorSession.findFirst({ where: { id: params.id, userId: user.id } });
    if (!session) return fail("not_found", "Tutor session not found.");
    await prisma.tutorSession.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
