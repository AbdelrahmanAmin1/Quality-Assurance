import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const questionSchema = z.object({
  prompt: z.string().trim().min(1).max(1000),
  answer: z.string().trim().min(1).max(1000),
  choices: z.array(z.string().trim().min(1).max(240)).max(8).default([])
});

const quizSchema = z.object({
  title: z.string().trim().min(1).max(160),
  materialId: z.string().cuid().optional(),
  questions: z.array(questionSchema).min(1).max(25)
});

export async function GET() {
  try {
    const user = await requireUser();
    const quizzes = await prisma.quiz.findMany({
      where: { OR: [{ userId: user.id }, { material: { userId: user.id } }] },
      include: { material: { select: { id: true, title: true } }, questions: true, attempts: { where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" }
    });
    return ok({ quizzes });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request) {
  const parsed = await readJson(request, quizSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    if (parsed.data.materialId) {
      const material = await prisma.material.findFirst({ where: { id: parsed.data.materialId, userId: user.id } });
      if (!material) return fail("not_found", "Material not found.");
    }
    const quiz = await prisma.quiz.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        materialId: parsed.data.materialId,
        questions: {
          create: parsed.data.questions.map((question) => ({
            prompt: question.prompt,
            answer: question.answer,
            choices: JSON.stringify(question.choices ?? [])
          }))
        }
      },
      include: { questions: true }
    });
    return created({ quiz });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
