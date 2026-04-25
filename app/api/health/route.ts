import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok({
    service: "noesis-api",
    status: "ok",
    time: new Date().toISOString()
  });
}
