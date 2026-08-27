"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bug,
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  ShieldAlert,
  Settings,
  PlusCircle,
  Terminal,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Issues Dashboard", href: "/issues", icon: LayoutDashboard },
  { label: "Projects & Modules", href: "/projects", icon: FolderKanban },
  { label: "Dependency Map", href: "/issues?view=dependencies", icon: GitBranch },
  { label: "Security & ACLs", href: "/issues?filter=security", icon: ShieldAlert },
];

interface SidebarProps {
  onOpenCreateModal?: () => void;
}

export default function Sidebar({ onOpenCreateModal }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 p-4 select-none">
      <div className="space-y-6">
        {/* App Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/10">
            <Bug className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Bugzilla<span className="text-rose-400 font-mono text-xs font-semibold">2.0</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono">Modern Issue Tracking</p>
          </div>
        </div>

        {/* Quick Create Action */}
        <button
          onClick={onOpenCreateModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-semibold text-xs transition-all duration-200 shadow-lg shadow-rose-500/15 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" /> File New Bug
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            Workspaces
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-zinc-800/80 text-white border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-rose-400" : "text-zinc-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User / System Info Footer */}
      <div className="pt-4 border-t border-zinc-800/80 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center">
            S
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-zinc-200 truncate">Sachin (Admin)</p>
            <p className="text-[10px] text-zinc-500 font-mono">sachin@dev.org</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-2 pt-2 border-t border-zinc-900">
          <span className="flex items-center gap-1">
            <Terminal className="h-3 w-3 text-emerald-400" /> PostgreSQL Sync
          </span>
          <span>v2.0.0</span>
        </div>
      </div>
    </aside>
  );
}