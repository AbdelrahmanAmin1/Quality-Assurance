import assert from "node:assert/strict";
import test from "node:test";
import { fail, ok } from "../lib/api";
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
  assert.throws(() => paginationSchema.parse({ take: 101 }));
});
