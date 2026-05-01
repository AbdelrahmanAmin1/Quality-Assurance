# Backend Unit Test Report

Generated: 2026-05-01

Command:

```powershell
npm.cmd test
```

Status: passing after the latest local run.

| Feature branch | Unit test file | Test count |
| --- | --- | ---: |
| `noesis-backend-foundation` | `tests/noesis-backend-foundation.test.ts` | 3 |
| `user-authentication-account-management` | `tests/user-authentication-account-management.test.ts` | 3 |
| `learning-content` | `tests/learning-content.test.ts` | 3 |
| `ai-learning-assistant` | `tests/ai-learning-assistant.test.ts` | 2 |
| `assessment-feedback-system` | `tests/assessment-feedback-system.test.ts` | 3 |
| `dashboard-progress-tracking` | `tests/dashboard-progress-tracking.test.ts` | 2 |
| `collaboration-study-rooms` | `tests/collaboration-study-rooms.test.ts` | 2 |

## Test Details

| Feature branch | Unit test file | Test | What it does |
| --- | --- | --- | --- |
| `noesis-backend-foundation` | `tests/noesis-backend-foundation.test.ts` | ok response wraps backend data | Verifies successful API helpers return HTTP 200 JSON in the shared `{ data }` shape. |
| `noesis-backend-foundation` | `tests/noesis-backend-foundation.test.ts` | fail response maps error code to status | Verifies shared API errors produce the expected HTTP status and `{ error }` body. |
| `noesis-backend-foundation` | `tests/noesis-backend-foundation.test.ts` | pagination has safe defaults and bounds | Verifies default pagination values and rejects oversized page sizes. |
| `user-authentication-account-management` | `tests/user-authentication-account-management.test.ts` | validators normalize email and enforce password length | Verifies auth input validation lowercases emails and rejects weak passwords. |
| `user-authentication-account-management` | `tests/user-authentication-account-management.test.ts` | password hashes verify only matching secrets | Verifies password hashing accepts the correct password and rejects an incorrect one. |
| `user-authentication-account-management` | `tests/user-authentication-account-management.test.ts` | public user hides sensitive fields | Verifies the public user serializer omits password/session data. |
| `learning-content` | `tests/learning-content.test.ts` | material extraction creates metadata from uploaded filename | Verifies backend material metadata is derived from the uploaded filename. |
| `learning-content` | `tests/learning-content.test.ts` | material extraction handles empty names safely | Verifies empty or extension-only filenames do not crash and receive a fallback title. |
| `learning-content` | `tests/learning-content.test.ts` | note tags are trimmed, deduplicated, and serialized | Verifies note tags are cleaned before being stored as JSON. |
| `ai-learning-assistant` | `tests/ai-learning-assistant.test.ts` | tutor reply includes the incoming prompt | Verifies the tutor service uses the student's prompt and returns follow-up prompts. |
| `ai-learning-assistant` | `tests/ai-learning-assistant.test.ts` | empty prompt still returns a safe tutoring response | Verifies blank prompts do not crash and return a useful fallback response. |
| `assessment-feedback-system` | `tests/assessment-feedback-system.test.ts` | answers normalize before scoring | Verifies answer comparison trims whitespace and ignores casing. |
| `assessment-feedback-system` | `tests/assessment-feedback-system.test.ts` | quiz scoring covers correct, missing, and wrong answers | Verifies mixed answer submissions calculate correct count, total, and score. |
| `assessment-feedback-system` | `tests/assessment-feedback-system.test.ts` | empty quizzes score without crashing | Verifies the scorer handles an empty quiz safely. |
| `dashboard-progress-tracking` | `tests/dashboard-progress-tracking.test.ts` | startOfDay normalizes date values | Verifies progress snapshots are grouped by midnight-normalized dates. |
| `dashboard-progress-tracking` | `tests/dashboard-progress-tracking.test.ts` | aggregates handle values and empty inputs | Verifies average and sum helpers work for normal and empty datasets. |
| `collaboration-study-rooms` | `tests/collaboration-study-rooms.test.ts` | board state serializes for storage | Verifies room board objects are stored as JSON strings. |
| `collaboration-study-rooms` | `tests/collaboration-study-rooms.test.ts` | board text parser handles valid and invalid content | Verifies board parsing reads valid text and safely ignores invalid JSON. |

Additional checks included in the test command:

- `tests/smoke.mjs` confirms every backend route and shared backend module exists.
- The separate branch-owned unit tests cover happy paths, empty input handling, invalid input handling, and non-crashing edge cases where those behaviors live in shared backend logic.
