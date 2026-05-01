import { z } from "zod";
import { fail, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { generateTutorReply } from "@/lib/learning-services";

const explainSchema = z.object({
  prompt: z.string().trim().min(1).max(4000)
});

export async function POST(request: Request) {
  const parsed = await readJson(request, explainSchema);
  if ("error" in parsed) return parsed.error;

  try {
    await requireUser();
    return ok({ reply: generateTutorReply(parsed.data.prompt) });
  } catch {
    return fail("unauthorized", "Authentication required.");
  }
}
