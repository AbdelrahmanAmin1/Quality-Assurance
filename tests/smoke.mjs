import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");

assert.equal(pkg.scripts.build, "next build");
assert.equal(pkg.dependencies.next.startsWith("^14."), true);

for (const model of ["User", "Session", "Material", "TutorSession", "Quiz", "StudyRoom", "ProgressSnapshot"]) {
  assert.match(schema, new RegExp(`model ${model} \\{`));
}

for (const path of [
  "../app/api/health/route.ts",
  "../app/api/flashcards/route.ts",
  "../app/api/flashcards/[id]/review/route.ts",
  "../app/api/quizzes/route.ts",
  "../app/api/quizzes/[id]/route.ts",
  "../app/api/quizzes/[id]/attempts/route.ts",
  "../lib/api.ts",
  "../lib/auth.ts",
  "../lib/prisma.ts",
  "../lib/stubs.ts"
]) {
  assert.equal(existsSync(new URL(path, import.meta.url)), true, `${path} should exist`);
}

console.log("smoke checks passed");
