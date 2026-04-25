import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const onboardingSchema = z.object({
  field: z.string().trim().min(1).max(80),
  goal: z.string().trim().min(1).max(80),
  dailyMinutes: z.number().int().min(15).max(180),
  courses: z.array(z.object({
    code: z.string().trim().min(2).max(24),
    title: z.string().trim().min(1).max(120),
    term: z.string().trim().max(40).optional()
  })).max(12).default([])
});

export async function PUT(request: Request) {
  const parsed = await readJson(request, onboardingSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        field: parsed.data.field,
        goal: parsed.data.goal,
        dailyMinutes: parsed.data.dailyMinutes,
        onboardingDone: true
      },
      create: {
        userId: user.id,
        field: parsed.data.field,
        goal: parsed.data.goal,
        dailyMinutes: parsed.data.dailyMinutes,
        onboardingDone: true
      }
    });

    for (const course of parsed.data.courses ?? []) {
      await prisma.course.upsert({
        where: { userId_code: { userId: user.id, code: course.code } },
        update: { title: course.title, term: course.term },
        create: { userId: user.id, code: course.code, title: course.title, term: course.term }
      });
    }

    return ok({ profile });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
