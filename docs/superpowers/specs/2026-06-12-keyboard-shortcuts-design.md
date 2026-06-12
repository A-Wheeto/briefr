# Keyboard Shortcuts Design

**Date:** 2026-06-12
**Status:** Implemented

## Goal

Make the board usable without a mouse: navigate cards, open tasks, add tasks, and discover shortcuts — all from the keyboard.

## Scope

1. **Card navigation** — arrow keys and vim h/j/k/l move a visible selection ring between cards. j/k/↑/↓ move within a column (clamped at ends); h/l/←/→ move to the nearest non-empty column, row index clamped. The first navigation keypress with no selection selects the first task of the first non-empty column. Enter opens the TaskModal for the selected card. Escape clears the selection.
2. **Quick-add** — `n` opens a command-palette-style floating input; Enter creates the task in Todo via the existing `POST /api/tasks` flow; Escape, backdrop click, or empty Enter cancels.
3. **Help overlay** — `?` opens a shortcuts cheatsheet modal.
4. **Suppression** — shortcuts are ignored while typing in inputs/textareas/selects/contenteditable, when a modifier key is held, or while any modal is open.

Out of scope (deferred): moving/reordering tasks via keyboard, insights/stats view.

## Architecture

- **`src/hooks/useKeyboardShortcuts.ts`** — single `window` keydown listener consumed by `Board`. Modal-open detection uses `document.querySelector('[data-modal-root]')`; every modal backdrop (`TaskModal`, `OnboardingModal`, `StandupModal`, `QuickAdd`, `HelpModal`) carries `data-modal-root`, avoiding plumbing modal state up from components that open modals locally.
- **Selection state** — `Board` owns `selectedTaskId`, passed through `Column` to `TaskCard` (`isSelected` → ring classes, `data-selected`, `scrollIntoView`).
- **Visibility** — `Board` builds a `visibleByColumn` memo excluding archived Done tasks via `src/lib/archive.ts` → `isArchived()`, a pure helper extracted from `Column`'s archive split so board navigation and column rendering share one definition. Archived tasks are never navigable.
- **Enter to open** — `Board` holds `keyboardTaskId` and renders a `TaskModal` at board level; TaskCard's click-to-open path is unchanged.
- **Accessibility** — `role="dialog" aria-modal="true"` on new overlays; a visually-hidden `aria-live="polite"` region announces the selected task and column. No roving tabindex (it would conflict with dnd-kit's drag sensors).

## Components

- `src/hooks/useKeyboardShortcuts.ts` (new)
- `src/lib/archive.ts` (new)
- `src/components/QuickAdd.tsx` (new)
- `src/components/HelpModal.tsx` (new)
- `src/components/Board.tsx`, `Column.tsx`, `TaskCard.tsx` (modified)
- `TaskModal.tsx`, `OnboardingModal.tsx`, `StandupModal.tsx` (`data-modal-root` added)

## Verification

Verified end-to-end with Playwright against the dev server with a real session: navigation/clamping, Enter-to-open, suppression while typing and while modals open, quick-add creation into Todo, help overlay open/close, and the selection ring rendering.
