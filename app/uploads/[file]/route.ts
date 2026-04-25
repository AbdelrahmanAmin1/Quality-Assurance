import { serveProjectFile } from "@/lib/static-file";

export async function GET(_: Request, { params }: { params: { file: string } }) {
  return serveProjectFile(`uploads/${params.file}`);
}
