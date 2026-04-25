import { fail, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const quiz = await prisma.quiz.findFirst({
      where: { id: params.id, OR: [{ material: { userId: user.id } }, { materialId: null }] },
      include: { questions: true, attempts: { where: { userId: user.id }, orderBy: { createdAt: "desc" } } }
    });
    if (!quiz) return fail("not_found", "Quiz not found.");
    return ok({ quiz });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
