import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { FolderKanban, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-rose-400" /> Projects & Modules
              </h1>
              <p className="text-xs text-zinc-400">
                Manage product components, sub-modules, and release targets
              </p>
            </div>
            <button className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-black font-semibold text-xs rounded-xl transition flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
              <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                CORE
              </span>
              <h3 className="text-sm font-bold text-white">Core Engine Infrastructure</h3>
              <p className="text-xs text-zinc-400">Low-level system architecture and memory management.</p>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
              <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                UI
              </span>
              <h3 className="text-sm font-bold text-white">Next.js Frontend & Visuals</h3>
              <p className="text-xs text-zinc-400">Kanban boards, command palette, and interactive UI.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}