import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

export async function serveProjectFile(relativePath: string) {
  const root = process.cwd();
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "content-type": contentTypes[path.extname(filePath)] ?? "application/octet-stream"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
