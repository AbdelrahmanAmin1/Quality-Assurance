import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const flashcardSchema = z.object({
  materialId: z.string().cuid().optional(),
  prompt: z.string().trim().min(1).max(1000),
  answer: z.string().trim().min(1).max(4000),
  concept: z.string().trim().max(120).optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const cards = await prisma.flashcard.findMany({
      where: { OR: [{ userId: user.id }, { material: { userId: user.id } }] },
      include: { material: { select: { id: true, title: true } }, reviews: { where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" }
    });
    return ok({ cards });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request) {
  const parsed = await readJson(request, flashcardSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    if (parsed.data.materialId) {
      const material = await prisma.material.findFirst({ where: { id: parsed.data.materialId, userId: user.id } });
      if (!material) return fail("not_found", "Material not found.");
    }
    const card = await prisma.flashcard.create({ data: { ...parsed.data, userId: user.id } });
    return created({ card });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
