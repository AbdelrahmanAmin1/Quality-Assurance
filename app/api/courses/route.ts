import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const courseSchema = z.object({
  code: z.string().trim().min(2).max(24),
  title: z.string().trim().min(1).max(120),
  term: z.string().trim().max(40).optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const courses = await prisma.course.findMany({ where: { userId: user.id }, orderBy: { code: "asc" } });
    return ok({ courses });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request) {
  const parsed = await readJson(request, courseSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const course = await prisma.course.upsert({
      where: { userId_code: { userId: user.id, code: parsed.data.code } },
      update: { title: parsed.data.title, term: parsed.data.term },
      create: { userId: user.id, ...parsed.data }
    });
    return created({ course });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
