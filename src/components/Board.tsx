"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./Column";
import TaskCard from "./TaskCard";
import BoardSkeleton from "./BoardSkeleton";

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

const COLUMNS = [
  { title: "Backlog", status: "BACKLOG" },
  { title: "Todo", status: "TODO" },
  { title: "In Progress", status: "IN_PROGRESS" },
  { title: "Review", status: "REVIEW" },
  { title: "Done", status: "DONE" },
];

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("IN_PROGRESS");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
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
    const optimistic = { ...data };
    if (data.status === "DONE") optimistic.completedAt = new Date().toISOString();
    else if (data.status && data.status !== "DONE") optimistic.completedAt = null;

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...optimistic } : t)));
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

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overTask = tasks.find((t) => t.id === over.id);
    const targetStatus = overTask ? overTask.status : (over.id as string);

    if (activeTask.status !== targetStatus) {
      // Moving to a different column
      setTasks((prev) =>
        prev.map((t) => (t.id === active.id ? { ...t, status: targetStatus } : t))
      );
    } else if (overTask) {
      // Reordering within the same column
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === active.id);
        const overIndex = prev.findIndex((t) => t.id === over.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event;
    setActiveTask(null);

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    // Calculate position from neighbours in the current (reordered) tasks array
    const columnTasks = tasks.filter((t) => t.status === task.status);
    const index = columnTasks.findIndex((t) => t.id === active.id);
    const prev = columnTasks[index - 1];
    const next = columnTasks[index + 1];

    let newPosition: number;
    if (!prev && !next) newPosition = 1000;
    else if (!prev) newPosition = next.position / 2;
    else if (!next) newPosition = prev.position + 1000;
    else newPosition = (prev.position + next.position) / 2;

    handleUpdate(task.id, { status: task.status, position: newPosition });
  }

  const columnProps = {
    onAdd: handleAdd,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };

  if (loading) return <BoardSkeleton />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Mobile: tab bar + single column */}
      <div className="flex flex-col h-full md:hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto flex-shrink-0">
          {COLUMNS.map((col) => {
            const count = tasks.filter((t) => t.status === col.status).length;
            const isActive = activeTab === col.status;
            return (
              <button
                key={col.status}
                onClick={() => setActiveTab(col.status)}
                className={`flex-1 min-w-0 px-2 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-slate-600 text-slate-600 dark:text-slate-400"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
                }`}
              >
                {col.title}
                {count > 0 && (
                  <span className={`ml-1 text-xs rounded-full px-1.5 py-0.5 ${isActive ? "bg-slate-100" : "bg-gray-100"}`}>
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
      <div className="hidden md:grid md:grid-cols-5 gap-3 h-full p-4" style={{ minWidth: "900px" }}>
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

      <DragOverlay>
        {activeTask && (
          <div className="rotate-1 opacity-90">
            <TaskCard
              task={activeTask}
              onUpdate={() => {}}
              onDelete={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
