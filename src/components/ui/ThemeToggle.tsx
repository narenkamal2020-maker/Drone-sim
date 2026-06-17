"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary-accent)] transition-all duration-300 group cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="h-4 w-4 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}

export default ThemeToggle;
