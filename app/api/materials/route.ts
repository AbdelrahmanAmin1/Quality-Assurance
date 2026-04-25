import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const materialSchema = z.object({
  title: z.string().trim().min(1).max(160),
  type: z.enum(["pdf", "slides", "video", "note", "pset", "link", "code"]),
  courseId: z.string().cuid().optional(),
  sourceName: z.string().trim().max(240).optional(),
  summary: z.string().trim().max(4000).optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const materials = await prisma.material.findMany({
      where: { userId: user.id },
      include: { course: true, notes: { select: { id: true } } },
      orderBy: { updatedAt: "desc" }
    });
    return ok({ materials });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request) {
  const parsed = await readJson(request, materialSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    if (parsed.data.courseId) {
      const course = await prisma.course.findFirst({ where: { id: parsed.data.courseId, userId: user.id } });
      if (!course) return fail("not_found", "Course not found.");
    }

    const material = await prisma.material.create({
      data: {
        userId: user.id,
        courseId: parsed.data.courseId,
        title: parsed.data.title,
        type: parsed.data.type,
        sourceName: parsed.data.sourceName,
        summary: parsed.data.summary,
        status: "uploaded"
      }
    });
    return created({ material });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
