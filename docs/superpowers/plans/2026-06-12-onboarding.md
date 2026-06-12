# Onboarding Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a 3-step welcome modal to first-time users, and allow it to be re-opened any time from the user menu.

**Architecture:** A new `OnboardingModal` component manages its own step state and takes a single `onClose` prop. `Board` controls visibility via `showOnboarding` state — set to `true` on first mount if `localStorage` key `hasSeenOnboarding` is absent, and re-set when a `storage` event with `key: "showOnboarding"` fires. `UserMenu` gets a "Show welcome guide" button that dispatches that event.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS

---

### Task 1: Create OnboardingModal component

**Files:**
- Create: `src/components/OnboardingModal.tsx`

No test suite exists in this project — verification is TypeScript + manual.

- [ ] **Step 1: Create the file with the full component**

  Create `src/components/OnboardingModal.tsx` with this exact content:

  ```tsx
  "use client"

  import { useState } from "react"

  type Props = {
    onClose: () => void
  }

  export default function OnboardingModal({ onClose }: Props) {
    const [step, setStep] = useState(0)
    const totalSteps = 3

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl w-full max-w-md flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Welcome to briefr</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {step === 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">📋 Your board</p>
                <div className="flex gap-1 mb-4">
                  {["Backlog", "Todo", "In Progress", "Review", "Done"].map((col, i) => (
                    <span
                      key={col}
                      className={`flex-1 text-center text-xs rounded py-1 ${
                        i === 4
                          ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {col}
                    </span>
                  ))}
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Drag tasks between columns as you work through them</li>
                  <li>Click a task to open and edit its title or notes</li>
                  <li>
                    Add tasks with the{" "}
                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">+</span>
                    {" "}at the bottom of any column
                  </li>
                  <li>
                    Press{" "}
                    <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded border border-gray-200 dark:border-gray-700">Enter</kbd>
                    {" "}in the title to save,{" "}
                    <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded border border-gray-200 dark:border-gray-700">Cmd+Enter</kbd>
                    {" "}in notes, or click away to apply changes
                  </li>
                </ul>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">📦 Archive</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>
                    Done tasks older than 7 days are automatically hidden into an{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">"X archived ↓"</span>
                    {" "}section at the bottom of the Done column
                  </li>
                  <li>Expand it to view or delete archived tasks</li>
                  <li>Change the threshold in the user menu (your initials, top right)</li>
                </ul>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">🗒️ Standup report</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>
                    Hit the{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">Standup</span>
                    {" "}button in the header to generate a plain-text summary of what you completed today and yesterday, and what's in progress
                  </li>
                  <li>Copy it to your clipboard for Slack or your daily standup</li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 pb-5">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === step ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 items-center">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="text-sm px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back
                </button>
              )}
              {step < totalSteps - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="text-sm px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="text-sm px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Get started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Verify TypeScript is clean**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no output (no errors).

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/OnboardingModal.tsx
  git commit -m "Add OnboardingModal component with 3-step welcome guide"
  ```

---

### Task 2: Wire OnboardingModal into Board

**Files:**
- Modify: `src/components/Board.tsx`

The existing `Board.tsx` already has a storage event listener for `archiveAfterDays` (lines 66–74). We extend that same listener to also handle `showOnboarding`, and add a separate `useEffect` for the first-login check.

- [ ] **Step 1: Add the import and `showOnboarding` state**

  At the top of `Board.tsx`, add the import after the existing imports:

  ```tsx
  import OnboardingModal from "./OnboardingModal";
  ```

  Inside `export default function Board()`, add this state declaration after the existing `const [archiveAfterDays, setArchiveAfterDays] = useState(7)` line:

  ```tsx
  const [showOnboarding, setShowOnboarding] = useState(false);
  ```

- [ ] **Step 2: Add the first-login check useEffect**

  Add this `useEffect` after the existing `archiveAfterDays` localStorage `useEffect` (after line 64):

  ```tsx
  useEffect(() => {
    if (!localStorage.getItem("hasSeenOnboarding")) {
      setShowOnboarding(true);
    }
  }, []);
  ```

- [ ] **Step 3: Extend the storage event listener to handle `showOnboarding`**

  Replace the existing storage event `useEffect` (lines 66–74) with this version that handles both keys:

  ```tsx
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "archiveAfterDays" && e.newValue) {
        setArchiveAfterDays(Number(e.newValue));
      }
      if (e.key === "showOnboarding") {
        setShowOnboarding(true);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  ```

- [ ] **Step 4: Add the close handler**

  Add this function inside `Board`, after `handleDelete`:

  ```tsx
  function handleOnboardingClose() {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  }
  ```

- [ ] **Step 5: Render the modal**

  Inside the returned JSX, add `<OnboardingModal>` just before the closing `</DndContext>` tag (after the `<DragOverlay>` block):

  ```tsx
      {showOnboarding && (
        <OnboardingModal onClose={handleOnboardingClose} />
      )}
    </DndContext>
  ```

- [ ] **Step 6: Verify TypeScript is clean**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no output.

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/Board.tsx
  git commit -m "Show onboarding modal on first login and on StorageEvent trigger"
  ```

---

### Task 3: Add "Show welcome guide" to UserMenu

**Files:**
- Modify: `src/components/UserMenu.tsx`

- [ ] **Step 1: Add the "Show welcome guide" button**

  In `UserMenu.tsx`, insert this block between the name/email `<div>` (the one with the `border-b` on line 50) and the `"Archive after"` `<div>` (line 54):

  ```tsx
  <button
    onClick={() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "showOnboarding", newValue: "true" }));
      setOpen(false);
    }}
    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
  >
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    Show welcome guide
  </button>
  ```

- [ ] **Step 2: Verify TypeScript is clean**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no output.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/UserMenu.tsx
  git commit -m "Add 'Show welcome guide' to user menu"
  ```
