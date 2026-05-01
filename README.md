# Noesis

Noesis is an intelligent learning workspace prototype with a branch-by-branch backend MVP implementation.

The repository started as an exported HTML/CSS/React prototype. Backend work has been implemented on feature branches so each product area can be reviewed independently.

## Repository Structure

- `master` contains the merged frontend prototype screens.
- `noesis-backend-foundation` contains the shared Next.js, Prisma, TypeScript, and test foundation.
- Feature branches contain backend APIs for their assigned product areas.
- `components/`, `styles/`, `assets/`, and `uploads/` contain the original prototype assets.

## Backend Stack

- Next.js App Router API routes
- TypeScript
- Prisma ORM
- SQLite for local MVP development
- Zod request validation
- HTTP-only cookie sessions
- Backend service functions for local tutor replies and material metadata processing

## Feature Branches

| Branch | Backend Scope | Status |
| --- | --- | --- |
| `noesis-backend-foundation` | Shared app scaffold, Prisma schema, API helpers, auth utilities, smoke checks | Complete |
| `user-authentication-account-management` | Register, login, logout, current user, onboarding, courses, settings | Complete |
| `learning-content` | Materials CRUD, material extraction, material detail, notes CRUD | Complete |
| `ai-learning-assistant` | Tutor sessions, session messages, backend-generated tutor replies | Complete |
| `assessment-feedback-system` | Flashcards, confidence review, quizzes, quiz attempts, feedback | Complete |
| `dashboard-progress-tracking` | Dashboard summary, progress timelines, daily progress snapshots | Complete |
| `collaboration-study-rooms` | Study rooms, membership, board state, room messages | Complete |

## Local Setup

```powershell
npm.cmd install --no-audit --no-fund
npx.cmd prisma generate
Copy-Item .env.example .env.local
npm.cmd run build
npm.cmd test
```

Set `DATABASE_URL` in `.env.local`. The MVP default is:

```env
DATABASE_URL="file:./dev.db"
NOESIS_SESSION_SECRET="replace-with-a-long-random-secret"
NOESIS_AI_PROVIDER="local"
```

## Useful Commands

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd test
npx.cmd prisma generate
npm.cmd run prisma:push
npm.cmd run prisma:seed
```

## QA Checklist

### Code Quality Checklist

- [x] Code follows clear indentation, naming, and comments where useful.
- [x] Error handling is present through validation, authentication checks, and API error responses.
- [x] No commented-out code or known unused variables were left in the implemented backend files.
- [x] Code is readable and organized by product area.
- [x] Shared behavior is centralized in reusable helpers to avoid duplicated API boilerplate where practical.

### Testing Checklist

- [x] Happy path smoke checks were run.
- [x] Edge-case validation is covered through Zod schemas with min, max, enum, optional, and default constraints.
- [x] Negative-path behavior is implemented for invalid input, unauthorized requests, missing resources, conflicts, and forbidden actions.
- [x] `npm.cmd run build` completed on each backend feature branch with no TypeScript build failures.

### Review Checklist

- [x] Self-review completed after implementation.
- [ ] Peer review still needs to be completed by another reviewer.
- [x] QA assignment requirements were mapped to backend branch scopes and verified against the pushed branches.

## Current Limitations

- The backend branches are intentionally separate and have not been consolidated back into `master`.
- AI tutor and material extraction behavior uses local backend services until external provider keys and processing pipelines are configured.
- Peer review is pending and should be completed before final submission.
