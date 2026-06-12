"use client"

import { useEffect } from "react"

type Props = {
  onClose: () => void
}

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["↑", "k"], label: "Move selection up" },
  { keys: ["↓", "j"], label: "Move selection down" },
  { keys: ["←", "h"], label: "Move selection left" },
  { keys: ["→", "l"], label: "Move selection right" },
  { keys: ["Enter"], label: "Open selected task" },
  { keys: ["n"], label: "New task in Todo" },
  { keys: ["?"], label: "Show this help" },
  { keys: ["Esc"], label: "Clear selection / close" },
]

export default function HelpModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      data-modal-root
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl w-full max-w-md flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Keyboard shortcuts</h2>
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

        <div className="px-6 py-5">
          <ul className="space-y-2.5">
            {SHORTCUTS.map(({ keys, label }) => (
              <li key={label} className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                <span className="flex gap-1">
                  {keys.map(key => (
                    <kbd
                      key={key}
                      className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      {key}
                    </kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
