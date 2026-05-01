import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateQuizSchema = z.object({
  title: z.string().trim().min(1).max(160).optional()
});

async function findOwnedQuiz(id: string, userId: string) {
  return prisma.quiz.findFirst({
    where: { id, OR: [{ userId }, { material: { userId } }] },
    include: { questions: true, attempts: { where: { userId }, orderBy: { createdAt: "desc" } } }
  });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const quiz = await findOwnedQuiz(params.id, user.id);
    if (!quiz) return fail("not_found", "Quiz not found.");
    return ok({ quiz });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, updateQuizSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const existing = await findOwnedQuiz(params.id, user.id);
    if (!existing) return fail("not_found", "Quiz not found.");
    const quiz = await prisma.quiz.update({ where: { id: params.id }, data: parsed.data });
    return ok({ quiz });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const existing = await findOwnedQuiz(params.id, user.id);
    if (!existing) return fail("not_found", "Quiz not found.");
    await prisma.quiz.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
