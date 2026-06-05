"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";

type Task = {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  position: number;
  completedAt: string | null;
};

type Props = {
  title: string;
  status: string;
  tasks: Task[];
  onAdd: (title: string, status: string) => void;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
};

const accentClasses: Record<string, string> = {
  IN_PROGRESS: "text-slate-600",
  DONE: "text-emerald-600",
};

const countClasses: Record<string, string> = {
  IN_PROGRESS: "bg-slate-50 text-slate-600",
  DONE: "bg-emerald-50 text-emerald-600",
};

export default function Column({ title, status, tasks, onAdd, onUpdate, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  function submitAdd() {
    if (newTitle.trim()) onAdd(newTitle.trim(), status);
    setNewTitle("");
    setAdding(false);
  }

  function cancelAdd() {
    setNewTitle("");
    setAdding(false);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden min-w-0">
      <div className="px-3 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs font-semibold uppercase tracking-wide ${accentClasses[status] ?? "text-gray-400"}`}>
          {title}
        </span>
        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ml-auto ${countClasses[status] ?? "bg-gray-100 text-gray-400"}`}>
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>

      <div className="p-2 flex-shrink-0">
        {adding ? (
          <div
            tabIndex={-1}
            className="border border-slate-300 rounded-md p-2"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) submitAdd();
            }}
          >
            <input
              autoFocus
              className="w-full text-sm outline-none text-gray-800"
              placeholder="Task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitAdd();
                if (e.key === "Escape") cancelAdd();
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-xs text-gray-400 border border-dashed border-gray-200 rounded-md py-2 hover:border-gray-300 hover:text-gray-500 transition-colors"
          >
            + Add task
          </button>
        )}
      </div>
    </div>
  );
}
