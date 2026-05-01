# Noesis Feature Branch Map

This frontend prototype was split into branches by screen ownership so each branch represents a coherent product area.

## Branches

- `user-authentication-account-management`
  Files: `components/Auth.jsx`, `components/Settings.jsx`
  Scope: sign in/up, onboarding, profile, account sessions, privacy, notification and appearance settings.

- `learning-content`
  Files: `components/Materials.jsx`, `components/Notes.jsx`
  Scope: materials library, material detail, note-taking workspace, content browsing and source-linked study assets.

- `ai-learning-assistant`
  Files: `components/Tutor.jsx`
  Scope: Socratic tutor workspace, guided explanation flow, answer feedback, tutor session actions.

- `dashboard-progress-tracking`
  Files: `components/Dashboard.jsx`, `components/Progress.jsx`
  Scope: daily dashboard, mastery summaries, streaks, charts, retention and activity analytics.

- `collaboration-study-rooms`
  Files: `components/Collab.jsx`
  Scope: study room layout, members, shared board, voice panel, live collaboration surface.

- `assessment-feedback-system`
  Files: `components/Flashcards.jsx`, `components/Quiz.jsx`
  Scope: flashcard review, confidence scoring, quiz flow, answer explanations and review prompts.

## Shared Baseline

- `Noesis.html`
- `styles/tokens.css`
- `components/App.jsx`
- `components/Shell.jsx`
- `components/Icons.jsx`
- `components/Splash.jsx`
- `components/Landing.jsx`
- `components/Marketing.jsx`
- `components/Hero3D.jsx`
- `components/Ambient3D.jsx`

These shared files stay on `master` as the common shell/marketing foundation that every feature branch builds on.

## Phase 3 Integration

`phase-3-backend-completion` is the review branch for cross-feature backend wiring, ownership hardening, and unit tests after the original feature branches were merged into `master`. Feature ownership remains:

- Auth/account changes: `components/Auth.jsx`, `components/Settings.jsx`, `app/api/auth/*`, `app/api/settings/*`, `app/api/onboarding/*`, `app/api/courses/*`.
- Learning content changes: `components/Materials.jsx`, `components/Notes.jsx`, `app/api/materials/*`, `app/api/notes/*`.
- Tutor changes: `components/Tutor.jsx`, `app/api/tutor/*`, `lib/learning-services.ts`.
- Assessment changes: `components/Flashcards.jsx`, `components/Quiz.jsx`, `app/api/flashcards/*`, `app/api/quizzes/*`, `lib/assessment.ts`.
- Dashboard/progress changes: `components/Dashboard.jsx`, `components/Progress.jsx`, `app/api/dashboard/*`, `app/api/progress/*`, `lib/progress-utils.ts`.
- Collaboration changes: `components/Collab.jsx`, `app/api/study-rooms/*`, `lib/study-room-utils.ts`.
