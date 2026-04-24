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
