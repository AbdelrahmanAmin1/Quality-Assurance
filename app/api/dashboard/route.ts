import { fail, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function GET() {
  try {
    const user = await requireUser();
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const [materials, notes, tutorSessions, cardReviews, quizAttempts, snapshots] = await Promise.all([
      prisma.material.findMany({ where: { userId: user.id }, select: { id: true, progress: true, status: true } }),
      prisma.note.count({ where: { userId: user.id } }),
      prisma.tutorSession.count({ where: { userId: user.id, updatedAt: { gte: since } } }),
      prisma.flashcardReview.findMany({ where: { userId: user.id, createdAt: { gte: since } } }),
      prisma.quizAttempt.findMany({ where: { userId: user.id, createdAt: { gte: since } } }),
      prisma.progressSnapshot.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 14 })
    ]);

    const averageMastery = materials.length
      ? Math.round(materials.reduce((sum, material) => sum + material.progress, 0) / materials.length)
      : 0;
    const today = snapshots.find((snapshot) => snapshot.date.getTime() === startOfToday().getTime());

    return ok({
      summary: {
        materials: materials.length,
        processedMaterials: materials.filter((material) => material.status === "processed").length,
        notes,
        tutorSessionsThisWeek: tutorSessions,
        cardsReviewedThisWeek: cardReviews.length,
        quizAverageThisWeek: quizAttempts.length
          ? Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length)
          : 0,
        averageMastery,
        todayMinutes: today?.minutesStudied ?? 0
      },
      snapshots
    });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
