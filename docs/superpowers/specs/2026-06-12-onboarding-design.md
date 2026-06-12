# Onboarding Modal Design

## Context

New users land on the board with no explanation of how it works. The onboarding modal gives first-time users a quick orientation — covering the board columns, task editing, notes, archive, and standup report — and can be re-opened at any time from the user menu.

## Decisions

- **Format:** Paginated modal (3 steps) shown over a dimmed backdrop, matching the existing TaskModal pattern
- **Trigger — first login:** Show automatically if `localStorage` key `hasSeenOnboarding` is absent
- **Trigger — show again:** "Show welcome guide" link in UserMenu dispatches a `StorageEvent`; `Board` listens and re-opens the modal
- **Dismiss:** ✕ button on any step, or "Get started" button on step 3 — both set `hasSeenOnboarding` in localStorage and close the modal
- **Storage:** `localStorage` key `hasSeenOnboarding` (`"true"` when seen) — consistent with `theme` and `archiveAfterDays`

## Step Content

### Step 1 — Your board
- 5 columns: Backlog → Todo → In Progress → Review → Done
- Drag tasks between columns, or click a task to open and edit it
- Add tasks with the + at the bottom of any column
- Each task has a title and notes field — press Enter in the title to save, Cmd+Enter (Mac) / Ctrl+Enter (Windows) in notes, or click away to apply changes

### Step 2 — Archive
- Done tasks auto-archive after 7 days — they collapse into an "X archived ↓" section at the bottom of the Done column
- Expand the section to view or delete archived tasks
- Change the threshold in the user menu (your initials, top right)

### Step 3 — Standup report
- Hit the "Standup" button in the header to generate a plain-text summary of what you completed today and yesterday, and what's in progress
- Copy it to your clipboard for Slack or your daily standup

## Components

### `src/components/OnboardingModal.tsx` (new)

A client component that renders a centred modal with:
- Dimmed full-screen backdrop (`fixed inset-0 bg-black/50`)
- White card (max-width ~480px), matching the TaskModal visual style
- Header: title ("Welcome to briefr") + ✕ close button
- Body: step content — one section per step, toggled by `currentStep` state
- Footer: dot pagination indicators + Prev / Next buttons; "Get started" replaces Next on step 3
- Internal state: `currentStep` (0-indexed, 0–2)
- Props: `onClose: () => void`

### `src/components/Board.tsx` (modify)

- On mount: if `localStorage.getItem("hasSeenOnboarding")` is absent, set `showOnboarding` state to `true`
- Listen for `StorageEvent` with `key: "showOnboarding"` — set `showOnboarding` to `true`
- Render `<OnboardingModal onClose={handleOnboardingClose} />` when `showOnboarding` is true
- `handleOnboardingClose`: sets `localStorage.setItem("hasSeenOnboarding", "true")`, sets `showOnboarding` to `false`

### `src/components/UserMenu.tsx` (modify)

- Add a "Show welcome guide" button above the "Archive after" row
- On click: `window.dispatchEvent(new StorageEvent("storage", { key: "showOnboarding", newValue: "true" }))` and close the dropdown

## Data Flow

```
First visit:
Board mounts → no hasSeenOnboarding in localStorage → showOnboarding = true → modal shown
User dismisses → hasSeenOnboarding set → modal hidden

Show again:
UserMenu "Show welcome guide" → StorageEvent → Board listener → showOnboarding = true → modal shown
User dismisses → hasSeenOnboarding set → modal hidden
```

## What Does Not Change

- Prisma schema — no new fields
- API routes — no changes
- Auth flow — onboarding is purely client-side, triggered after the board renders

## Verification

1. Clear `hasSeenOnboarding` from localStorage; refresh — modal appears automatically
2. Step through all 3 steps using Next/Prev — content and dot indicators update correctly
3. Close with ✕ on step 2 — modal closes; refreshing does not show it again
4. Complete to step 3, click "Get started" — modal closes; refreshing does not show it again
5. Open user menu → "Show welcome guide" — modal re-opens regardless of localStorage state
6. Dark mode — modal renders correctly with dark variants
