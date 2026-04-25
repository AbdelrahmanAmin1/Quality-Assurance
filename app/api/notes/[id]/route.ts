import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const noteUpdateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  body: z.string().trim().min(1).max(20000).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const note = await prisma.note.findFirst({ where: { id: params.id, userId: user.id }, include: { material: true } });
    if (!note) return fail("not_found", "Note not found.");
    return ok({ note });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const parsed = await readJson(request, noteUpdateSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const user = await requireUser();
    const existing = await prisma.note.findFirst({ where: { id: params.id, userId: user.id } });
    if (!existing) return fail("not_found", "Note not found.");
    const note = await prisma.note.update({
      where: { id: params.id },
      data: { ...parsed.data, tags: parsed.data.tags ? JSON.stringify(parsed.data.tags) : undefined }
    });
    return ok({ note });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const existing = await prisma.note.findFirst({ where: { id: params.id, userId: user.id } });
    if (!existing) return fail("not_found", "Note not found.");
    await prisma.note.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
