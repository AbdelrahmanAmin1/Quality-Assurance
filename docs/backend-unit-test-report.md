# Backend Unit Test Report

Generated: 2026-05-01

Command:

```powershell
npm.cmd test
```

Status: passing after the latest local run.

| Feature branch | Unit test file | Coverage focus |
| --- | --- | --- |
| `noesis-backend-foundation` | `tests/noesis-backend-foundation.test.ts` | API response helpers, pagination validation |
| `user-authentication-account-management` | `tests/user-authentication-account-management.test.ts` | email/password validation, password hashing, public user shaping |
| `learning-content` | `tests/learning-content.test.ts` | material metadata extraction, note tag serialization |
| `ai-learning-assistant` | `tests/ai-learning-assistant.test.ts` | tutor reply generation and empty prompt handling |
| `assessment-feedback-system` | `tests/assessment-feedback-system.test.ts` | answer normalization, quiz scoring, empty quiz scoring |
| `dashboard-progress-tracking` | `tests/dashboard-progress-tracking.test.ts` | day normalization, average and sum aggregation |
| `collaboration-study-rooms` | `tests/collaboration-study-rooms.test.ts` | board serialization and parser failure handling |

Additional checks included in the test command:

- `tests/smoke.mjs` confirms every backend route and shared backend module exists.
- The separate branch-owned unit tests cover happy paths, empty input handling, invalid input handling, and non-crashing edge cases where those behaviors live in shared backend logic.
