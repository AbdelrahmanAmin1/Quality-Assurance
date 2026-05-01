import { z } from "zod";
import { created, fail, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { scoreQuizAttempt } from "@/lib/assessment";
import { prisma } from "@/lib/prisma";

const attemptSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().cuid(),
    answer: z.string().trim().max(1000)
  })).min(1).max(50)
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, attemptSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const quiz = await prisma.quiz.findFirst({
      where: { id: params.id, OR: [{ userId: user.id }, { material: { userId: user.id } }] },
      include: { questions: true }
    });
    if (!quiz) return fail("not_found", "Quiz not found.");

    const { correct, total, score, feedback } = scoreQuizAttempt(quiz.questions, parsed.data.answers);

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: user.id,
        score,
        answers: JSON.stringify(parsed.data.answers),
        feedback
      }
    });
    return created({ attempt, correct, total });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
