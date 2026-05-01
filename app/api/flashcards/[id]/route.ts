import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateFlashcardSchema = z.object({
  prompt: z.string().trim().min(1).max(1000).optional(),
  answer: z.string().trim().min(1).max(4000).optional(),
  concept: z.string().trim().max(120).optional()
});

async function findOwnedCard(id: string, userId: string) {
  return prisma.flashcard.findFirst({
    where: { id, OR: [{ userId }, { material: { userId } }] },
    include: { material: { select: { id: true, title: true } } }
  });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const card = await findOwnedCard(params.id, user.id);
    if (!card) return fail("not_found", "Flashcard not found.");
    return ok({ card });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, updateFlashcardSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const existing = await findOwnedCard(params.id, user.id);
    if (!existing) return fail("not_found", "Flashcard not found.");
    const card = await prisma.flashcard.update({ where: { id: params.id }, data: parsed.data });
    return ok({ card });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const existing = await findOwnedCard(params.id, user.id);
    if (!existing) return fail("not_found", "Flashcard not found.");
    await prisma.flashcard.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
