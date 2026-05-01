import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, publicUser, verifyPassword } from "../lib/auth";
import { emailSchema, passwordSchema } from "../lib/validators";

test("user-authentication-account-management: validators normalize email and enforce password length", () => {
  assert.equal(emailSchema.parse("  USER@Example.COM "), "user@example.com");
  assert.throws(() => passwordSchema.parse("short"));
});

test("user-authentication-account-management: password hashes verify only matching secrets", async () => {
  const hash = await hashPassword("correct-password");
  assert.equal(await verifyPassword("correct-password", hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});

test("user-authentication-account-management: public user hides sensitive fields", () => {
  const createdAt = new Date("2026-05-01T12:00:00.000Z");
  assert.deepEqual(publicUser({ id: "u1", email: "u@example.com", name: "User", createdAt }), {
    id: "u1",
    email: "u@example.com",
    name: "User",
    createdAt: createdAt.toISOString()
  });
});
