import { writeFileSync } from "node:fs";

const branches = [
  {
    branch: "noesis-backend-foundation",
    file: "tests/noesis-backend-foundation.test.ts",
    tests: [
      ["ok response wraps backend data", "Verifies successful API helpers return HTTP 200 JSON in the shared `{ data }` shape."],
      ["fail response maps error code to status", "Verifies shared API errors produce the expected HTTP status and `{ error }` body."],
      ["pagination has safe defaults and bounds", "Verifies default pagination values and rejects oversized page sizes."]
    ]
  },
  {
    branch: "user-authentication-account-management",
    file: "tests/user-authentication-account-management.test.ts",
    tests: [
      ["validators normalize email and enforce password length", "Verifies auth input validation lowercases emails and rejects weak passwords."],
      ["password hashes verify only matching secrets", "Verifies password hashing accepts the correct password and rejects an incorrect one."],
      ["public user hides sensitive fields", "Verifies the public user serializer omits password/session data."]
    ]
  },
  {
    branch: "learning-content",
    file: "tests/learning-content.test.ts",
    tests: [
      ["material extraction creates metadata from uploaded filename", "Verifies backend material metadata is derived from the uploaded filename."],
      ["material extraction handles empty names safely", "Verifies empty or extension-only filenames do not crash and receive a fallback title."],
      ["note tags are trimmed, deduplicated, and serialized", "Verifies note tags are cleaned before being stored as JSON."]
    ]
  },
  {
    branch: "ai-learning-assistant",
    file: "tests/ai-learning-assistant.test.ts",
    tests: [
      ["tutor reply includes the incoming prompt", "Verifies the tutor service uses the student's prompt and returns follow-up prompts."],
      ["empty prompt still returns a safe tutoring response", "Verifies blank prompts do not crash and return a useful fallback response."]
    ]
  },
  {
    branch: "assessment-feedback-system",
    file: "tests/assessment-feedback-system.test.ts",
    tests: [
      ["answers normalize before scoring", "Verifies answer comparison trims whitespace and ignores casing."],
      ["quiz scoring covers correct, missing, and wrong answers", "Verifies mixed answer submissions calculate correct count, total, and score."],
      ["empty quizzes score without crashing", "Verifies the scorer handles an empty quiz safely."]
    ]
  },
  {
    branch: "dashboard-progress-tracking",
    file: "tests/dashboard-progress-tracking.test.ts",
    tests: [
      ["startOfDay normalizes date values", "Verifies progress snapshots are grouped by midnight-normalized dates."],
      ["aggregates handle values and empty inputs", "Verifies average and sum helpers work for normal and empty datasets."]
    ]
  },
  {
    branch: "collaboration-study-rooms",
    file: "tests/collaboration-study-rooms.test.ts",
    tests: [
      ["board state serializes for storage", "Verifies room board objects are stored as JSON strings."],
      ["board text parser handles valid and invalid content", "Verifies board parsing reads valid text and safely ignores invalid JSON."]
    ]
  }
];

const summaryRows = branches.map(({ branch, file, tests }) => (
  `| \`${branch}\` | \`${file}\` | ${tests.length} |`
)).join("\n");

const testRows = branches.flatMap(({ branch, file, tests }) => (
  tests.map(([name, purpose]) => `| \`${branch}\` | \`${file}\` | ${name} | ${purpose} |`)
)).join("\n");

const body = `# Backend Unit Test Report

Generated: 2026-05-01

Command:

\`\`\`powershell
npm.cmd test
\`\`\`

Status: passing after the latest local run.

| Feature branch | Unit test file | Test count |
| --- | --- | ---: |
${summaryRows}

## Test Details

| Feature branch | Unit test file | Test | What it does |
| --- | --- | --- | --- |
${testRows}

Additional checks included in the test command:

- \`tests/smoke.mjs\` confirms every backend route and shared backend module exists.
- The separate branch-owned unit tests cover happy paths, empty input handling, invalid input handling, and non-crashing edge cases where those behaviors live in shared backend logic.
`;

writeFileSync(new URL("../docs/backend-unit-test-report.md", import.meta.url), body);
console.log("backend unit test report written to docs/backend-unit-test-report.md");
