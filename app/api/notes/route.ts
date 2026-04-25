import { z } from "zod";
import { created, fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const noteSchema = z.object({
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(20000),
  materialId: z.string().cuid().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([])
});

export async function GET() {
  try {
    const user = await requireUser();
    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      include: { material: { select: { id: true, title: true } } },
      orderBy: { updatedAt: "desc" }
    });
    return ok({ notes });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function POST(request: Request) {
  const parsed = await readJson(request, noteSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    if (parsed.data.materialId) {
      const material = await prisma.material.findFirst({ where: { id: parsed.data.materialId, userId: user.id } });
      if (!material) return fail("not_found", "Material not found.");
    }
    const note = await prisma.note.create({
      data: {
        userId: user.id,
        materialId: parsed.data.materialId,
        title: parsed.data.title,
        body: parsed.data.body,
        tags: JSON.stringify(parsed.data.tags)
      }
    });
    return created({ note });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
