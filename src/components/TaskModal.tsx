"use client"

import { useEffect, useRef, useState } from "react"

type Task = {
  id: string
  title: string
  notes: string | null
  status: string
  position: number
  completedAt: string | null
  statusChangedAt: string | null
  createdAt: string
}

type Props = {
  task: Task
  onUpdate: (id: string, data: Partial<Task>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const COLUMNS = [
  { status: "BACKLOG", label: "Backlog" },
  { status: "TODO", label: "Todo" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "REVIEW", label: "Review" },
  { status: "DONE", label: "Done" },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function TaskModal({ task, onUpdate, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(task.title)
  const [notes, setNotes] = useState(task.notes ?? "")
  const [status, setStatus] = useState(task.status)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = el.scrollHeight + "px"
    }
  }, [notes])

  function save() {
    if (!title.trim()) return onClose()
    const changed =
      title.trim() !== task.title ||
      (notes.trim() || null) !== task.notes ||
      status !== task.status
    if (changed) onUpdate(task.id, { title: title.trim(), notes: notes.trim() || null, status })
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={save}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3 flex-shrink-0">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-none rounded-md px-2 py-1.5 outline-none cursor-pointer"
          >
            {COLUMNS.map(col => (
              <option key={col.status} value={col.status}>{col.label}</option>
            ))}
          </select>
          <div className="flex-1" />
          <button
            onClick={save}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="px-5 pb-3 flex-shrink-0">
          <input
            autoFocus
            className="w-full text-lg font-semibold text-gray-900 dark:text-gray-100 bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-700"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); save() } }}
          />
        </div>

        {/* Notes */}
        <div className="px-5 pb-4 flex-1 overflow-y-auto min-h-0">
          <div className="mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-600">Notes</span>
          </div>
          <textarea
            ref={textareaRef}
            className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent outline-none resize-none overflow-hidden placeholder-gray-300 dark:placeholder-gray-700 leading-relaxed"
            rows={5}
            placeholder="Add notes..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save() }}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-400 dark:text-gray-600">
            Created {formatDate(task.createdAt)}
          </span>
          <div className="flex-1" />
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500">Delete task?</span>
              <button
                onClick={() => { onDelete(task.id); onClose() }}
                className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-gray-300 dark:text-gray-700 hover:text-red-400 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6 4V3h4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="4" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.5 7.5v3M9.5 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
