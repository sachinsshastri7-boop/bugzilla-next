"use client";

import { Clock, User, ShieldAlert, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: Date | string;
  actor: {
    name: string;
    avatarUrl?: string | null;
  };
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-center text-xs text-zinc-500 font-mono">
        No audit activity recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-rose-400" /> Audit History Trail
      </h4>

      <div className="relative pl-4 border-l border-zinc-800 space-y-4 font-sans text-xs">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-zinc-800 border border-zinc-600 group-hover:bg-rose-500 group-hover:border-rose-400 transition-colors" />

            <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/50 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <User className="h-3 w-3 text-zinc-400" /> {act.actor.name}
                </span>
                <span className="font-mono text-zinc-500 text-[10px]">
                  {formatDate(act.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="font-mono text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  {act.field}
                </span>
                <span className="text-zinc-500 line-through text-[11px]">
                  {act.oldValue || "None"}
                </span>
                <ArrowRight className="h-3 w-3 text-zinc-600 shrink-0" />
                <span className="font-semibold text-emerald-400 text-[11px]">
                  {act.newValue || "None"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}