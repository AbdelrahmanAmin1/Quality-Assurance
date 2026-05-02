import { writeFileSync } from "node:fs";

const branches = [
  {
    branch: "noesis-backend-foundation",
    file: "tests/noesis-backend-foundation.test.ts",
    tests: [
      { category: "Happy path", name: "ok response wraps backend data", purpose: "Verifies successful API helpers return HTTP 200 JSON in the shared `{ data }` shape." },
      { category: "Negative", name: "fail response maps error code to status", purpose: "Verifies shared API errors produce the expected HTTP status and `{ error }` body." },
      { category: "Edge", name: "pagination has safe defaults and bounds", purpose: "Verifies default pagination values, max allowed page size, and oversized page rejection." },
      { category: "Negative", name: "readJson rejects malformed or invalid bodies", purpose: "Verifies malformed JSON and wrong request body types return controlled HTTP 400 errors." }
    ]
  },
  {
    branch: "user-authentication-account-management",
    file: "tests/user-authentication-account-management.test.ts",
    tests: [
      { category: "Happy path", name: "validators normalize email and enforce password length", purpose: "Verifies auth input validation lowercases valid emails and enforces password constraints." },
      { category: "Happy path", name: "password hashes verify only matching secrets", purpose: "Verifies password hashing accepts the correct password and rejects an incorrect one." },
      { category: "Edge", name: "public user handles nullable profile fields", purpose: "Verifies the public user serializer handles a null profile name while omitting sensitive fields." },
      { category: "Negative", name: "invalid auth inputs and malformed hashes are rejected", purpose: "Verifies invalid emails, wrong input types, overlong passwords, and malformed hashes fail safely." }
    ]
  },
  {
    branch: "learning-content",
    file: "tests/learning-content.test.ts",
    tests: [
      { category: "Happy path", name: "material extraction creates metadata from uploaded filename", purpose: "Verifies backend material metadata is derived from the uploaded filename." },
      { category: "Edge", name: "material extraction handles empty names safely", purpose: "Verifies empty or extension-only filenames do not crash and receive a fallback title." },
      { category: "Happy path", name: "note tags are trimmed, deduplicated, and serialized", purpose: "Verifies note tags are cleaned before being stored as JSON." },
      { category: "Negative", name: "invalid tag and metadata inputs do not crash", purpose: "Verifies wrong runtime values are ignored or converted to safe fallback material/tag output." }
    ]
  },
  {
    branch: "ai-learning-assistant",
    file: "tests/ai-learning-assistant.test.ts",
    tests: [
      { category: "Happy path", name: "tutor reply includes the incoming prompt", purpose: "Verifies the tutor service uses the student's prompt and returns follow-up prompts." },
      { category: "Edge", name: "empty prompt still returns a safe tutoring response", purpose: "Verifies blank prompts do not crash and return a useful fallback response." },
      { category: "Negative", name: "invalid prompt types do not crash", purpose: "Verifies non-string prompt values return the same safe tutoring fallback." }
    ]
  },
  {
    branch: "assessment-feedback-system",
    file: "tests/assessment-feedback-system.test.ts",
    tests: [
      { category: "Happy path", name: "answers normalize before scoring", purpose: "Verifies answer comparison trims whitespace and ignores casing." },
      { category: "Happy path", name: "quiz scoring covers correct, missing, and wrong answers", purpose: "Verifies mixed answer submissions calculate correct count, total, and score." },
      { category: "Edge", name: "empty quizzes score without crashing", purpose: "Verifies the scorer handles an empty quiz safely." },
      { category: "Negative", name: "invalid answer inputs do not crash scoring", purpose: "Verifies null or malformed answer inputs produce controlled zero-score output." }
    ]
  },
  {
    branch: "dashboard-progress-tracking",
    file: "tests/dashboard-progress-tracking.test.ts",
    tests: [
      { category: "Happy path", name: "startOfDay normalizes date values", purpose: "Verifies progress snapshots are grouped by midnight-normalized dates." },
      { category: "Edge", name: "aggregates handle values and empty inputs", purpose: "Verifies average and sum helpers work for normal and empty datasets." },
      { category: "Negative", name: "aggregates ignore invalid numeric inputs", purpose: "Verifies NaN, infinity, null, and wrong-type values are ignored without crashing." }
    ]
  },
  {
    branch: "collaboration-study-rooms",
    file: "tests/collaboration-study-rooms.test.ts",
    tests: [
      { category: "Happy path", name: "board state serializes for storage", purpose: "Verifies room board objects are stored as JSON strings." },
      { category: "Edge", name: "board text parser handles valid and invalid content", purpose: "Verifies board parsing reads valid text and safely ignores invalid JSON." },
      { category: "Negative", name: "invalid board values do not crash", purpose: "Verifies null boards and non-string board text values return safe empty output." }
    ]
  }
];

const summaryRows = branches.map(({ branch, file, tests }) => (
  `| \`${branch}\` | \`${file}\` | ${tests.length} |`
)).join("\n");

const checklistRows = branches.map(({ branch, file, tests }) => {
  const byCategory = (category) => tests
    .filter((test) => test.category === category)
    .map((test) => `\`${test.name}\``)
    .join("<br>");
  return `| \`${branch}\` | \`${file}\` | ${byCategory("Happy path")} | ${byCategory("Edge")} | ${byCategory("Negative")} |`;
}).join("\n");

const testRows = branches.flatMap(({ branch, file, tests }) => (
  tests.map(({ category, name, purpose }) => `| \`${branch}\` | \`${file}\` | ${category} | ${name} | ${purpose} |`)
)).join("\n");

const body = `# Backend Unit Test Report

Generated: 2026-05-02

Command:

\`\`\`powershell
npm.cmd test
\`\`\`

Status: passing after the latest local run.

| Feature branch | Unit test file | Test count |
| --- | --- | ---: |
${summaryRows}

## Testing Checklist Coverage

| Feature branch | Unit test file | Happy path | Edge cases | Negative cases |
| --- | --- | --- | --- | --- |
${checklistRows}

## Test Details

| Feature branch | Unit test file | Checklist area | Test | What it does |
| --- | --- | --- | --- | --- |
${testRows}

Additional checks included in the test command:

- \`tests/smoke.mjs\` confirms every backend route and shared backend module exists.
- The separate branch-owned unit tests now explicitly cover happy paths, edge cases, negative cases, and non-crashing invalid input handling where those behaviors live in shared backend logic.
`;

writeFileSync(new URL("../docs/backend-unit-test-report.md", import.meta.url), body);
console.log("backend unit test report written to docs/backend-unit-test-report.md");
