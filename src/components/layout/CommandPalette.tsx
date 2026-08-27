"use client";

import { useState, useEffect } from "react";
import { Search, Bug, X, Command, ArrowRight } from "lucide-react";
import { IssueItem } from "@/types";

interface CommandPaletteProps {
  issues: IssueItem[];
  onClose: () => void;
  onSelectIssue: (key: string) => void;
}

export default function CommandPalette({
  issues,
  onClose,
  onSelectIssue,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filtered = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.key.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-zinc-800/80">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search bugs (e.g. CORE-101)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-3.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 border border-zinc-700/60 rounded text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              No bugs matching "{query}"
            </div>
          ) : (
            filtered.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue.key)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                    {issue.key}
                  </span>
                  <span className="text-xs text-zinc-200 font-medium truncate group-hover:text-rose-300">
                    {issue.title}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-300 shrink-0 ml-2" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}