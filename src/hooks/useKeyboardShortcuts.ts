"use client";

import { useEffect } from "react";

type Options = {
  visibleByColumn: { id: string }[][];
  selectedTaskId: string | null;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  onOpenTask: (id: string) => void;
  onQuickAdd: () => void;
  onHelp: () => void;
};

// [column delta, row delta] per key
const NAV: Record<string, [number, number]> = {
  ArrowDown: [0, 1],
  j: [0, 1],
  ArrowUp: [0, -1],
  k: [0, -1],
  ArrowLeft: [-1, 0],
  h: [-1, 0],
  ArrowRight: [1, 0],
  l: [1, 0],
};

export default function useKeyboardShortcuts({
  visibleByColumn,
  selectedTaskId,
  onSelect,
  onClearSelection,
  onOpenTask,
  onQuickAdd,
  onHelp,
}: Options) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }
      if (document.querySelector("[data-modal-root]")) return;

      if (e.key === "n") {
        e.preventDefault();
        onQuickAdd();
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        onHelp();
        return;
      }
      if (e.key === "Escape") {
        onClearSelection();
        return;
      }

      // Locate the current selection in the visible grid
      let col = -1;
      let row = -1;
      if (selectedTaskId) {
        for (let c = 0; c < visibleByColumn.length; c++) {
          const r = visibleByColumn[c].findIndex((t) => t.id === selectedTaskId);
          if (r !== -1) {
            col = c;
            row = r;
            break;
          }
        }
      }

      if (e.key === "Enter") {
        if (col !== -1 && selectedTaskId) {
          e.preventDefault();
          onOpenTask(selectedTaskId);
        }
        return;
      }

      const nav = NAV[e.key];
      if (!nav) return;
      e.preventDefault();

      if (col === -1) {
        const firstCol = visibleByColumn.findIndex((c) => c.length > 0);
        if (firstCol !== -1) onSelect(visibleByColumn[firstCol][0].id);
        return;
      }

      const [dCol, dRow] = nav;
      if (dRow !== 0) {
        const next = Math.min(Math.max(row + dRow, 0), visibleByColumn[col].length - 1);
        onSelect(visibleByColumn[col][next].id);
      } else {
        let c = col + dCol;
        while (c >= 0 && c < visibleByColumn.length && visibleByColumn[c].length === 0) c += dCol;
        if (c < 0 || c >= visibleByColumn.length) return;
        onSelect(visibleByColumn[c][Math.min(row, visibleByColumn[c].length - 1)].id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibleByColumn, selectedTaskId, onSelect, onClearSelection, onOpenTask, onQuickAdd, onHelp]);
}
