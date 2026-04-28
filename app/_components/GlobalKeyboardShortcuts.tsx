"use client";

import { useState, useEffect } from "react";
import KeyboardShortcutsHelp from "./KeyboardShortcutsHelp";

export default function GlobalKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      const isTextField =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target as HTMLElement).isContentEditable;
      if (isTextField) return;

      if (e.key === "?") {
        e.preventDefault();
        setShowHelp((v) => !v);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <KeyboardShortcutsHelp
      isOpen={showHelp}
      onClose={() => setShowHelp(false)}
    />
  );
}
