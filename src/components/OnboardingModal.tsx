"use client"

import { useEffect, useState } from "react"

type Props = {
  onClose: () => void
}

export default function OnboardingModal({ onClose }: Props) {
  const [step, setStep] = useState(0)
  const totalSteps = 4

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      data-modal-root
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
            aria-label="Close"
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

          {step === 3 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">⌨️ Keyboard shortcuts</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  Use the{" "}
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded border border-gray-200 dark:border-gray-700">arrow keys</kbd>
                  {" "}or{" "}
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded border border-gray-200 dark:border-gray-700">h j k l</kbd>
                  {" "}to move between tasks, and{" "}
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded border border-gray-200 dark:border-gray-700">Enter</kbd>
                  {" "}to open one
                </li>
                <li>
                  Press{" "}
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded border border-gray-200 dark:border-gray-700">n</kbd>
                  {" "}to quickly add a task to Todo
                </li>
                <li>
                  Press{" "}
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded border border-gray-200 dark:border-gray-700">?</kbd>
                  {" "}any time to see the full list of shortcuts
                </li>
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
