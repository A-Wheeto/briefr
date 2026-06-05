"use client";

import { useEffect, useState } from "react";
import Column from "./Column";

type Task = {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  position: number;
  completedAt: string | null;
};

const COLUMNS = [
  { title: "Backlog", status: "BACKLOG" },
  { title: "Todo", status: "TODO" },
  { title: "In Progress", status: "IN_PROGRESS" },
  { title: "Review", status: "REVIEW" },
  { title: "Done", status: "DONE" },
];

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("IN_PROGRESS");

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks);
  }, []);

  async function handleAdd(title: string, status: string) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });
    const task = await res.json();
    setTasks((prev) => [...prev, task]);
  }

  async function handleUpdate(id: string, data: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  const columnProps = {
    onAdd: handleAdd,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };

  return (
    <>
      {/* Mobile: tab bar + single column */}
      <div className="flex flex-col h-full md:hidden">
        <div className="flex border-b border-gray-200 bg-white overflow-x-auto flex-shrink-0">
          {COLUMNS.map((col) => {
            const count = tasks.filter((t) => t.status === col.status).length;
            const isActive = activeTab === col.status;
            return (
              <button
                key={col.status}
                onClick={() => setActiveTab(col.status)}
                className={`flex-1 min-w-0 px-2 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-slate-600 text-slate-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {col.title}
                {count > 0 && (
                  <span
                    className={`ml-1 text-xs rounded-full px-1.5 py-0.5 ${
                      isActive ? "bg-slate-100" : "bg-gray-100"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {COLUMNS.filter((col) => col.status === activeTab).map((col) => (
            <Column
              key={col.status}
              title={col.title}
              status={col.status}
              tasks={tasks.filter((t) => t.status === col.status)}
              {...columnProps}
            />
          ))}
        </div>
      </div>

      {/* Desktop: all columns side by side */}
      <div
        className="hidden md:grid md:grid-cols-5 gap-3 h-full p-4"
        style={{ minWidth: "900px" }}
      >
        {COLUMNS.map((col) => (
          <Column
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={tasks.filter((t) => t.status === col.status)}
            {...columnProps}
          />
        ))}
      </div>
    </>
  );
}
