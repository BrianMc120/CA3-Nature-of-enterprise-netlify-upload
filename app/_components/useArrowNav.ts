"use client";

import { useCallback } from "react";

type Orientation = "horizontal" | "vertical" | "grid";

const NAV_KEYS = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End",
]);

/**
 * Returns an onKeyDown handler for containers that hold [data-kbd-item] children.
 * Moves focus with arrow keys and prevents browser scroll while a kbd-item is focused.
 */
export function useArrowNav(orientation: Orientation) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      // Ignore anything that isn't a navigation key
      if (!NAV_KEYS.has(e.key)) return;

      const container = e.currentTarget;
      const items = Array.from(
        container.querySelectorAll<HTMLElement>("[data-kbd-item]")
      );
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      if (currentIndex === -1) return;

      // Stop the browser scroll NOW — focus is confirmed on a kbd-item
      e.preventDefault();

      let next = currentIndex;

      if (orientation === "grid") {
        const cols = computeGridCols(container);
        if      (e.key === "ArrowLeft")  next = Math.max(0, currentIndex - 1);
        else if (e.key === "ArrowRight") next = Math.min(items.length - 1, currentIndex + 1);
        else if (e.key === "ArrowUp")    next = Math.max(0, currentIndex - cols);
        else if (e.key === "ArrowDown")  next = Math.min(items.length - 1, currentIndex + cols);
        else if (e.key === "Home")       next = 0;
        else if (e.key === "End")        next = items.length - 1;
      } else {
        const fwd = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
        const bwd = orientation === "horizontal" ? "ArrowLeft"  : "ArrowUp";
        if      (e.key === fwd)    next = (currentIndex + 1) % items.length;
        else if (e.key === bwd)    next = (currentIndex - 1 + items.length) % items.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End")  next = items.length - 1;
        // Perpendicular arrows (e.g. Up/Down on a horizontal row): scroll is already
        // blocked above, focus stays where it is — next === currentIndex, so nothing moves
      }

      if (next !== currentIndex) {
        items[next].focus();
      }
    },
    [orientation]
  );
}

function computeGridCols(el: HTMLElement): number {
  const cols = window.getComputedStyle(el).gridTemplateColumns;
  if (!cols || cols === "none") return 1;
  return cols.trim().split(/\s+/).length;
}
