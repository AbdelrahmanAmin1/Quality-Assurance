import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateMaterialSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  summary: z.string().trim().max(4000).optional(),
  status: z.enum(["uploaded", "processing", "processed", "failed"]).optional(),
  progress: z.number().int().min(0).max(100).optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const material = await prisma.material.findFirst({
      where: { id: params.id, userId: user.id },
      include: { course: true, notes: true, flashcards: true, quizzes: true }
    });
    if (!material) return fail("not_found", "Material not found.");
    return ok({ material });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, updateMaterialSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const existing = await prisma.material.findFirst({ where: { id: params.id, userId: user.id } });
    if (!existing) return fail("not_found", "Material not found.");
    const material = await prisma.material.update({ where: { id: params.id }, data: parsed.data });
    return ok({ material });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const existing = await prisma.material.findFirst({ where: { id: params.id, userId: user.id } });
    if (!existing) return fail("not_found", "Material not found.");
    await prisma.material.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
