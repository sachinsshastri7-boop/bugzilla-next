"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import IssueKanban from "@/components/issues/IssueKanban";
import IssueTable from "@/components/issues/IssueTable";
import CreateIssueModal from "@/components/issues/CreateIssueModal";
import IssueDetailView from "@/components/issues/IssueDetailView";
import CommandPalette from "@/components/layout/CommandPalette";
import { IssueItem, IssueStatus } from "@/types";
import { LayoutGrid, List, PlusCircle, RefreshCw } from "lucide-react";

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);

  // Fetch issues from the database API endpoint
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/issues");
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (error) {
      console.error("Failed to load issues from API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.component?.name &&
        issue.component.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle status update by sending PATCH request to DB
  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    // Optimistic UI update
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus } : iss))
    );

    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) return;

    try {
      const res = await fetch(`/api/issues/${targetIssue.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        fetchIssues();
      }
    } catch (error) {
      console.error("Failed to update status on server:", error);
      fetchIssues();
    }
  };

  // Handle bug creation by sending POST request to DB
  const handleCreateBug = async (newBugData: any) => {
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBugData),
      });

      if (res.ok) {
        fetchIssues(); // Refresh list from database
      }
    } catch (error) {
      console.error("Failed to create issue on server:", error);
    }
  };

  const activeIssue = issues.find((i) => i.key === selectedIssueKey);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500 selection:text-black">
      <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Issues Workspace
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                  {filteredIssues.length} active
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                Track, triage, and resolve software bugs across project modules
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchIssues}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
                title="Refresh from Database"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-rose-400" : ""}`} />
              </button>

              <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === "kanban"
                      ? "bg-zinc-800 text-rose-400 font-bold border border-zinc-700/60 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Board
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === "table"
                      ? "bg-zinc-800 text-rose-400 font-bold border border-zinc-700/60 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <List className="h-3.5 w-3.5" /> Data Grid
                </button>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-semibold text-xs transition shadow-lg shadow-rose-500/10 active:scale-95"
              >
                <PlusCircle className="h-4 w-4" /> File Bug
              </button>
            </div>
          </div>

          {loading && issues.length === 0 ? (
            <div className="py-20 text-center font-mono text-xs text-zinc-500 animate-pulse">
              Connecting to database & loading bugs...
            </div>
          ) : viewMode === "kanban" ? (
            <IssueKanban
              initialIssues={filteredIssues}
              onStatusChange={handleStatusChange}
              onSelectIssue={(key) => setSelectedIssueKey(key)}
            />
          ) : (
            <IssueTable
              issues={filteredIssues}
              onSelectIssue={(key) => setSelectedIssueKey(key)}
            />
          )}
        </main>
      </div>

      {isCreateModalOpen && (
        <CreateIssueModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateBug}
        />
      )}

      {selectedIssueKey && activeIssue && (
        <IssueDetailView
          issue={activeIssue}
          onClose={() => setSelectedIssueKey(null)}
          onUpdateStatus={(id, status) => {
            handleStatusChange(id, status);
            setSelectedIssueKey(null);
          }}
        />
      )}

      {isCommandPaletteOpen && (
        <CommandPalette
          issues={issues}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectIssue={(key) => {
            setSelectedIssueKey(key);
            setIsCommandPaletteOpen(false);
          }}
        />
      )}
    </div>
  );
}