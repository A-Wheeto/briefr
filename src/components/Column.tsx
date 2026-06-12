"use client";

import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { isArchived } from "@/lib/archive";

type Task = {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  position: number;
  completedAt: string | null;
  statusChangedAt: string | null;
  createdAt: string;
};

type Props = {
  title: string;
  status: string;
  tasks: Task[];
  onAdd: (title: string, status: string) => void;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
  archiveAfterDays?: number;
  selectedTaskId?: string | null;
};

const countClasses: Record<string, string> = {
  IN_PROGRESS: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  DONE: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-500",
};

export default function Column({ title, status, tasks, onAdd, onUpdate, onDelete, archiveAfterDays, selectedTaskId }: Props) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [archiveExpanded, setArchiveExpanded] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const { setNodeRef, isOver } = useDroppable({ id: status });

  const hasArchive = status === "DONE" && archiveAfterDays != null;
  const activeTasks = hasArchive ? tasks.filter(t => !isArchived(t, archiveAfterDays)) : tasks;
  const archivedTasks = hasArchive ? tasks.filter(t => isArchived(t, archiveAfterDays)) : [];

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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col overflow-hidden min-w-0">
      <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ml-auto ${countClasses[status] ?? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
          {activeTasks.length}
        </span>
      </div>

      <SortableContext items={activeTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-1 overflow-y-auto p-2 flex flex-col gap-2 transition-colors ${isOver ? "bg-slate-50 dark:bg-gray-800" : ""}`}
        >
          {activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isSelected={task.id === selectedTaskId}
            />
          ))}
        </div>
      </SortableContext>

      {archivedTasks.length > 0 && (
        <div className="px-2 pb-1 flex-shrink-0">
          <button
            onClick={() => setArchiveExpanded(prev => !prev)}
            className="w-full text-left text-xs text-gray-400 dark:text-gray-600 py-1.5 px-1 hover:text-gray-500 dark:hover:text-gray-500 transition-colors"
          >
            {archivedTasks.length} archived {archiveExpanded ? "↑" : "↓"}
          </button>
          {archiveExpanded && (
            <div className="flex flex-col gap-1 mt-0.5">
              {archivedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md px-2.5 py-1.5"
                >
                  <button
                    onClick={() => setViewingTask(task)}
                    className="text-xs text-gray-400 dark:text-gray-500 text-left truncate flex-1 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  >
                    {task.title}
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-gray-300 dark:text-gray-700 hover:text-red-400 flex-shrink-0 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M3 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M6 4V3h4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="4" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6.5 7.5v3M9.5 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewingTask && (
        <TaskModal
          task={viewingTask}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onClose={() => setViewingTask(null)}
        />
      )}

      <div className="p-2 flex-shrink-0">
        {adding ? (
          <div
            tabIndex={-1}
            className="border border-slate-300 dark:border-gray-700 rounded-md p-2 dark:bg-gray-800"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) submitAdd();
            }}
          >
            <input
              autoFocus
              className="w-full text-sm outline-none text-gray-800 dark:text-gray-200 bg-transparent"
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
            className="w-full text-xs text-gray-400 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-700 rounded-md py-2 hover:border-gray-300 hover:text-gray-500 dark:hover:border-gray-600 dark:hover:text-gray-500 transition-colors"
          >
            + Add task
          </button>
        )}
      </div>
    </div>
  );
}
