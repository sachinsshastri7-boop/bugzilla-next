"use client";

import { GitPullRequest, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { getStatusStyle, getPriorityStyle } from "@/lib/utils";
import { IssueItem } from "@/types";

interface DependencyNode {
  issue: IssueItem;
  relationship: "blocking" | "blockedBy";
}

interface DependencyGraphProps {
  currentIssue: IssueItem;
  blockingIssues?: IssueItem[];
  blockedByIssues?: IssueItem[];
  onSelectIssue?: (key: string) => void;
}

export default function DependencyGraph({
  currentIssue,
  blockingIssues = [],
  blockedByIssues = [],
  onSelectIssue,
}: DependencyGraphProps) {
  const isBlocked = blockedByIssues.length > 0;

  return (
    <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <GitPullRequest className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Issue Dependency Tree
            </h3>
            <p className="text-[11px] text-zinc-400">
              Directional blockages and dependency chains
            </p>
          </div>
        </div>

        {isBlocked ? (
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-semibold">
            <ShieldAlert className="h-3 w-3" /> Blocked ({blockedByIssues.length})
          </span>
        ) : (
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" /> Ready to Work
          </span>
        )}
      </div>

      {/* Visual Graph Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center font-sans text-xs">
        
        {/* Left Column: Blocked By (Prerequisites) */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block text-center md:text-left">
            Depends On (Prerequisites)
          </span>
          {blockedByIssues.length === 0 ? (
            <div className="p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 text-center text-[11px] text-zinc-500 italic">
              No prerequisites blocking this issue.
            </div>
          ) : (
            blockedByIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onSelectIssue && onSelectIssue(issue.key)}
                className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/10 hover:bg-rose-900/20 transition cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-rose-400">
                    {issue.key}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400">
                    {issue.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-zinc-200 group-hover:text-rose-300 truncate">
                  {issue.title}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Center Node: Current Issue */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-rose-500/50 bg-zinc-900 shadow-xl shadow-rose-500/5 text-center space-y-2 relative">
          <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20">
            {currentIssue.key}
          </span>
          <h4 className="text-xs font-bold text-white line-clamp-2">
            {currentIssue.title}
          </h4>
          <span className="text-[10px] font-mono text-zinc-400">
            Status: {currentIssue.status}
          </span>
        </div>

        {/* Right Column: Blocking (Dependents) */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block text-center md:text-left">
            Blocks (Dependents)
          </span>
          {blockingIssues.length === 0 ? (
            <div className="p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 text-center text-[11px] text-zinc-500 italic">
              Not blocking any other issues.
            </div>
          ) : (
            blockingIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onSelectIssue && onSelectIssue(issue.key)}
                className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/10 hover:bg-amber-900/20 transition cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-400">
                    {issue.key}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400">
                    {issue.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-zinc-200 group-hover:text-amber-300 truncate">
                  {issue.title}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}