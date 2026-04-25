import { fail, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    const [snapshots, materialProgress, recentReviews, recentAttempts] = await Promise.all([
      prisma.progressSnapshot.findMany({ where: { userId: user.id }, orderBy: { date: "asc" }, take: 90 }),
      prisma.material.findMany({ where: { userId: user.id }, select: { id: true, title: true, progress: true, updatedAt: true } }),
      prisma.flashcardReview.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 25 }),
      prisma.quizAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 25, include: { quiz: true } })
    ]);

    return ok({
      snapshots,
      materialProgress,
      recentReviews,
      recentAttempts
    });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
