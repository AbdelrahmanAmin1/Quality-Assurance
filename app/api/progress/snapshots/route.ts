import { z } from "zod";
import { created, fail, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/progress-utils";

const snapshotSchema = z.object({
  date: z.string().datetime().optional(),
  minutesStudied: z.number().int().min(0).max(1440).default(0),
  masteryScore: z.number().int().min(0).max(100).default(0),
  cardsReviewed: z.number().int().min(0).max(10000).default(0),
  quizzesTaken: z.number().int().min(0).max(1000).default(0)
});

export async function POST(request: Request) {
  const parsed = await readJson(request, snapshotSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const date = startOfDay(parsed.data.date ? new Date(parsed.data.date) : new Date());
    const snapshot = await prisma.progressSnapshot.upsert({
      where: { userId_date: { userId: user.id, date } },
      update: {
        minutesStudied: parsed.data.minutesStudied ?? 0,
        masteryScore: parsed.data.masteryScore ?? 0,
        cardsReviewed: parsed.data.cardsReviewed ?? 0,
        quizzesTaken: parsed.data.quizzesTaken ?? 0
      },
      create: {
        userId: user.id,
        date,
        minutesStudied: parsed.data.minutesStudied ?? 0,
        masteryScore: parsed.data.masteryScore ?? 0,
        cardsReviewed: parsed.data.cardsReviewed ?? 0,
        quizzesTaken: parsed.data.quizzesTaken ?? 0
      }
    });
    return created({ snapshot });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
