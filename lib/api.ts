import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export type ApiErrorCode = "bad_request" | "unauthorized" | "forbidden" | "not_found" | "conflict" | "server_error";

const statusByCode: Record<ApiErrorCode, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  server_error: 500
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(code: ApiErrorCode, message: string, details?: unknown) {
  return NextResponse.json({ error: { code, message, details } }, { status: statusByCode[code] });
}

export async function readJson<T>(request: Request, schema: ZodSchema<T>): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await request.json();
    return { data: schema.parse(body) };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: fail("bad_request", "Request body failed validation.", error.flatten()) };
    }
    return { error: fail("bad_request", "Request body must be valid JSON.") };
  }
}
