import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { fail, ok, readJson } from "../lib/api";
import { paginationSchema } from "../lib/validators";

test("noesis-backend-foundation: ok response wraps backend data", async () => {
  const response = ok({ service: "foundation" });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: { service: "foundation" } });
});

test("noesis-backend-foundation: fail response maps error code to status", async () => {
  const response = fail("not_found", "Missing record.");
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: { code: "not_found", message: "Missing record." }
  });
});

test("noesis-backend-foundation: pagination has safe defaults and bounds", () => {
  assert.deepEqual(paginationSchema.parse({}), { take: 25, skip: 0 });
  assert.deepEqual(paginationSchema.parse({ take: 100, skip: 0 }), { take: 100, skip: 0 });
  assert.throws(() => paginationSchema.parse({ take: 101 }));
});

test("noesis-backend-foundation: readJson rejects malformed or invalid bodies", async () => {
  const schema = z.object({ title: z.string().min(1) });
  const malformed = await readJson(new Request("http://local.test", { method: "POST", body: "{" }), schema);
  assert.equal("error" in malformed, true);
  if ("error" in malformed) {
    assert.equal(malformed.error.status, 400);
  }

  const invalidShape = await readJson(
    new Request("http://local.test", { method: "POST", body: JSON.stringify({ title: 42 }) }),
    schema
  );
  assert.equal("error" in invalidShape, true);
  if ("error" in invalidShape) {
    assert.equal(invalidShape.error.status, 400);
  }
});
