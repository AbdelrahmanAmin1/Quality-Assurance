import { serveProjectFile } from "@/lib/static-file";

export async function GET() {
  return serveProjectFile("Noesis.html");
}
