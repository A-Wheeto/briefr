"use client";

import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  position: number;
  completedAt: string | null;
  createdAt: string;
};

type Props = {
  task: Task;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
};

const COLUMN_ORDER = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"];

const statusFooter: Record<string, { label: string; bg: string; text: string; border: string }> = {
  BACKLOG:     { label: "Backlog",     bg: "bg-gray-50 dark:bg-gray-800",    text: "text-gray-400 dark:text-gray-500",   border: "border-gray-100 dark:border-gray-700" },
  TODO:        { label: "Todo",        bg: "bg-gray-50 dark:bg-gray-800",    text: "text-gray-400 dark:text-gray-500",   border: "border-gray-100 dark:border-gray-700" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-slate-50 dark:bg-gray-800",  text: "text-slate-600 dark:text-slate-400", border: "border-slate-100 dark:border-gray-700" },
  REVIEW:      { label: "Review",      bg: "bg-amber-50 dark:bg-gray-800",   text: "text-amber-600 dark:text-amber-500",  border: "border-amber-100 dark:border-gray-700" },
  DONE:        { label: "Done",        bg: "bg-emerald-50 dark:bg-gray-800", text: "text-emerald-600 dark:text-emerald-500", border: "border-emerald-100 dark:border-gray-700" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatAge(iso: string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return weeks === 1 ? "1 week" : `${weeks} weeks`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month" : `${months} months`;
}

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes ?? "");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!confirmingDelete) return;
    function handleClickOutside() { setConfirmingDelete(false); }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [confirmingDelete]);

  const isDone = task.status === "DONE";
  const footer = statusFooter[task.status] ?? statusFooter.BACKLOG;
  const colIndex = COLUMN_ORDER.indexOf(task.status);
  const prevStatus = colIndex > 0 ? COLUMN_ORDER[colIndex - 1] : null;
  const nextStatus = colIndex < COLUMN_ORDER.length - 1 ? COLUMN_ORDER[colIndex + 1] : null;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [notes, editing]);

  function save() {
    if (title.trim())
      onUpdate(task.id, { title: title.trim(), notes: notes.trim() || null });
    setEditing(false);
  }

  function cancel() {
    setTitle(task.title);
    setNotes(task.notes ?? "");
    setEditing(false);
  }

  if (editing) {
    return (
      <div
        className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
        tabIndex={-1}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) save();
        }}
      >
        <div className="p-3">
          <input
            autoFocus
            className="w-full text-sm text-gray-800 dark:text-gray-200 bg-transparent outline-none mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
          />
          <textarea
            ref={textareaRef}
            className="w-full text-xs text-gray-500 dark:text-gray-400 bg-transparent outline-none resize-none overflow-hidden"
            rows={1}
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
          />
        </div>
        <div className="flex justify-end px-3 pb-3">
          <button
            onClick={() => onDelete(task.id)}
            className="bg-red-50 hover:bg-red-100 text-red-400 rounded-md px-2.5 py-1.5 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 4V3h4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.5 7.5v3M9.5 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        onClick={() => setEditing(true)}
        className={`bg-white dark:bg-gray-900 border rounded-lg overflow-hidden hover:shadow-sm transition-all ${
          isDone ? "border-gray-100 dark:border-gray-800 opacity-60" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
      <div className="px-3 pt-3 pb-2 cursor-grab active:cursor-grabbing" {...listeners}>
        <p className={`text-sm leading-snug ${isDone ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-200"}`}>
          {task.title}
        </p>
        {task.notes && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-snug line-clamp-2">{task.notes}</p>
        )}
      </div>
      {confirmingDelete ? (
        <div className="px-3 py-2 border-t border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950 flex items-center justify-between">
          <span className="text-xs text-red-500 font-medium">Delete task?</span>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="px-2 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            >
              Delete
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmingDelete(false); }}
              className="px-2 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={`px-2 py-1.5 border-t flex items-center gap-1 ${footer.bg} ${footer.border}`}>
          <div className="md:hidden">
            {prevStatus ? (
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { status: prevStatus }); }}
                className={`px-2 py-2 rounded transition-colors ${footer.text} hover:opacity-70`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <div className="px-2 py-2 w-[32px]" />
            )}
          </div>

          <span className={`text-xs flex-1 text-center ${footer.text}`}>
            {isDone && task.completedAt
              ? `Done · ${formatDate(task.completedAt)}`
              : `${footer.label} · ${formatAge(task.createdAt)}`}
          </span>

          <div className="md:hidden">
            {nextStatus ? (
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { status: nextStatus }); }}
                className={`px-2 py-2 rounded transition-colors ${footer.text} hover:opacity-70`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <div className="px-2 py-2 w-[32px]" />
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setConfirmingDelete(true); }}
            className="px-2 py-2 text-gray-300 hover:text-red-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 4V3h4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.5 7.5v3M9.5 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
