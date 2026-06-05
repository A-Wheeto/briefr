"use client"

import { useEffect, useState } from "react"
import { getStandupTasks, formatStandupText } from "@/lib/standup"

type Task = {
  id: string
  title: string
  status: string
  completedAt: string | null
}

type Props = {
  onClose: () => void
}

export default function StandupModal({ onClose }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/tasks").then(r => r.json()).then(setTasks)
  }, [])

  const { completedToday, completedYesterday, inProgressToday } = getStandupTasks(tasks)

  async function copyToClipboard() {
    const text = formatStandupText(completedToday, completedYesterday, inProgressToday)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2.5 5l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 5.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M2.5 10l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Standup Summary
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>

        {completedToday.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              Completed today
            </p>
            {completedToday.map(t => (
              <div key={t.id} className="flex items-start gap-2 py-1">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.title}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
            Yesterday I completed
          </p>
          {completedYesterday.length > 0 ? (
            completedYesterday.map(t => (
              <div key={t.id} className="flex items-start gap-2 py-1">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.title}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-600 italic">Nothing completed yesterday</p>
          )}
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
            Today I&apos;m working on
          </p>
          {inProgressToday.length > 0 ? (
            inProgressToday.map(t => (
              <div key={t.id} className="flex items-start gap-2 py-1">
                <span className="text-slate-500 mt-0.5">•</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.title}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-600 italic">Nothing in progress</p>
          )}
        </div>

        <button
          onClick={copyToClipboard}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          {copied ? "✓ Copied!" : "📋 Copy to clipboard"}
        </button>
      </div>
    </div>
  )
}
