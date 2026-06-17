"use client";

import Link from "next/link";
import React from "react";
import { Activity, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-[var(--border-color)] backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo — WorkSync branding */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-all duration-300">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
              Work<span className="text-sky-500">Sync</span>
            </h1>
            <p className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-widest -mt-0.5">
              Project Workspace
            </p>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-sky-400 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--border-color)] text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}