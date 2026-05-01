import { z } from "zod";
import { created, fail, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractMaterialMetadata } from "@/lib/learning-services";

const extractSchema = z.object({
  filename: z.string().trim().min(1).max(240),
  type: z.enum(["pdf", "slides", "video", "note", "pset", "link", "code"]).default("pdf"),
  courseId: z.string().cuid().optional()
});

export async function POST(request: Request) {
  const parsed = await readJson(request, extractSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const type = parsed.data.type ?? "pdf";
    const extraction = extractMaterialMetadata(parsed.data.filename, type);
    const material = await prisma.material.create({
      data: {
        userId: user.id,
        courseId: parsed.data.courseId,
        title: extraction.title,
        type,
        sourceName: parsed.data.filename,
        status: extraction.status,
        summary: extraction.summary,
        progress: 0
      }
    });
    return created({ material, extraction });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
