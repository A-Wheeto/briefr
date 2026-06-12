"use client";

import { useState } from "react";

type Props = {
  onAdd: (title: string) => void;
  onClose: () => void;
};

export default function QuickAdd({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");

  function submit() {
    const trimmed = title.trim();
    if (trimmed) onAdd(trimmed);
    onClose();
  }

  return (
    <div
      data-modal-root
      role="dialog"
      aria-modal="true"
      aria-label="Quick add task"
      className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 pt-[20vh]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl w-full max-w-md p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          aria-label="New task title"
          className="w-full text-sm outline-none text-gray-800 dark:text-gray-200 bg-transparent placeholder-gray-300 dark:placeholder-gray-700"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onClose();
          }}
        />
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-3">
          Enter to add to Todo · Esc to cancel
        </p>
      </div>
    </div>
  );
}
