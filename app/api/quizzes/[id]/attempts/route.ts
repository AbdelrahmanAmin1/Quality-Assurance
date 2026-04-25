import { z } from "zod";
import { created, fail, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
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
      where: { id: params.id, OR: [{ material: { userId: user.id } }, { materialId: null }] },
      include: { questions: true }
    });
    if (!quiz) return fail("not_found", "Quiz not found.");

    const answerMap = new Map(parsed.data.answers.map((entry) => [entry.questionId, entry.answer.trim().toLowerCase()]));
    const correct = quiz.questions.filter((question) => answerMap.get(question.id) === question.answer.trim().toLowerCase()).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    const feedback = score >= 80 ? "Strong attempt. Review only missed concepts." : "Review the explanations and retry after a short spaced-repetition pass.";

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: user.id,
        score,
        answers: JSON.stringify(parsed.data.answers),
        feedback
      }
    });
    return created({ attempt, correct, total: quiz.questions.length });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
