import { z } from "zod";
import { created, fail, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  confidence: z.number().int().min(1).max(5),
  correct: z.boolean()
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, reviewSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const card = await prisma.flashcard.findFirst({
      where: { id: params.id, OR: [{ userId: user.id }, { material: { userId: user.id } }] }
    });
    if (!card) return fail("not_found", "Flashcard not found.");
    const review = await prisma.flashcardReview.create({
      data: { userId: user.id, flashcardId: params.id, confidence: parsed.data.confidence, correct: parsed.data.correct }
    });
    return created({ review });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
