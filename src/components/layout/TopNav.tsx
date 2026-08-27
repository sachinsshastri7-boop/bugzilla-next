"use client";

import { Search, Command, Bell, Filter, SlidersHorizontal } from "lucide-react";

interface TopNavProps {
  onOpenCommandPalette?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function TopNav({ onOpenCommandPalette, searchQuery, setSearchQuery }: TopNavProps) {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Global Quick Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search bugs by title, key (e.g. CORE-101), or component..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-xl pl-9 pr-12 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/10 focus:outline-none transition-all"
          />
          <button
            onClick={onOpenCommandPalette}
            className="absolute right-2 top-1.5 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-[10px] font-mono text-zinc-400 flex items-center gap-1 hover:text-zinc-200"
          >
            <Command className="h-2.5 w-2.5" /> K
          </button>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs text-zinc-300 hover:border-zinc-700 transition"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-rose-400" /> Quick Filter
        </button>

        <button className="relative p-2 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
}