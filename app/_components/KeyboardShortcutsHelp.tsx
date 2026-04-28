"use client";

import { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SHORTCUTS = [
  { keys: ["?"],            desc: "Show / hide this keyboard shortcuts panel" },
  { keys: ["← →"],         desc: "Move between navigation tabs (when any tab is focused)" },
  { keys: ["← → ↑ ↓"],    desc: "Navigate the dashboard section cards" },
  { keys: ["Home", "End"], desc: "Jump to first / last item in a focused group" },
  { keys: ["Enter"],        desc: "Activate the focused link or button" },
  { keys: ["Tab", "⇧ Tab"], desc: "Move forward / backward through all focusable elements" },
  { keys: ["Esc"],          desc: "Close an open dialog or panel" },
  { keys: ["Skip link"],   desc: "Press Tab from the very top of the page to skip to main content" },
];

export default function KeyboardShortcutsHelp({ isOpen, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    function trapTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    }
    function closeOnEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", trapTab);
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("keydown", trapTab);
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kbd-help-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 hc-card"
      >
        <div className="flex items-start justify-between mb-5 gap-4">
          <h2 id="kbd-help-title" className="font-serif text-xl font-bold text-stone-900">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 text-stone-500 hover:text-stone-900 rounded-lg p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label="Close keyboard shortcuts panel"
          >
            <span aria-hidden="true" className="text-lg leading-none">✕</span>
          </button>
        </div>

        <ul className="space-y-3" role="list">
          {SHORTCUTS.map(({ keys, desc }) => (
            <li key={desc} className="flex items-start gap-3">
              <span className="shrink-0 flex gap-1 flex-wrap">
                {keys.map((k) => (
                  <kbd
                    key={k}
                    className="bg-stone-100 border border-stone-300 text-stone-800 text-xs font-mono px-2 py-1 rounded-md whitespace-nowrap"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
              <span className="text-sm text-stone-700 pt-0.5">{desc}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-stone-500">
          Press{" "}
          <kbd className="bg-stone-100 border border-stone-300 text-stone-800 font-mono px-1.5 py-0.5 rounded text-xs">
            ?
          </kbd>{" "}
          anywhere outside a text field to toggle this panel.
        </p>
      </div>
    </div>
  );
}
