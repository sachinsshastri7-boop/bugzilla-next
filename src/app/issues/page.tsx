"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import IssueKanban from "@/components/issues/IssueKanban";
import IssueTable from "@/components/issues/IssueTable";
import CreateIssueModal from "@/components/issues/CreateIssueModal";
import IssueDetailView from "@/components/issues/IssueDetailView";
import CommandPalette from "@/components/layout/CommandPalette";
import { IssueItem, IssueStatus, Priority, Severity, Role } from "@/types";
import { LayoutGrid, List, PlusCircle } from "lucide-react";

const INITIAL_ISSUES: IssueItem[] = [
  {
    id: "iss-101",
    key: "CORE-101",
    title: "Memory leak during concurrent state transitions",
    description:
      "When 50+ concurrent requests attempt to update issue status, the state machine validation worker leaks memory handles in worker threads.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    severity: "BLOCKER",
    environment: "Node v20.20 / PostgreSQL 16 / Linux x64",
    version: "v1.2.0-beta",
    createdAt: new Date("2026-08-25"),
    updatedAt: new Date("2026-08-27"),
    project: { key: "CORE", name: "Core Engine Infrastructure" },
    component: { name: "State Machine" },
    assignee: {
      id: "u1",
      name: "Sachin (Lead Dev)",
      email: "sachin@dev.org",
      role: "ADMIN",
    },
    reporter: {
      id: "u3",
      name: "Sreenidhi (QA Manager)",
      email: "sreenidhi@qa.org",
      role: "QA",
    },
    _count: { comments: 2, blockedBy: 1 },
  },
  {
    id: "iss-201",
    key: "UI-201",
    title: "Kanban board card drag animation stutters on Safari",
    description:
      "Dragging issue cards across status columns causes frame drops below 30fps on WebKit engines.",
    status: "NEW",
    priority: "HIGH",
    severity: "MINOR",
    environment: "Safari 17.5 / macOS Sequoia",
    version: "v2.0.0",
    createdAt: new Date("2026-08-26"),
    updatedAt: new Date("2026-08-26"),
    project: { key: "UI", name: "Next.js Frontend & Visuals" },
    component: { name: "Kanban Board" },
    assignee: {
      id: "u2",
      name: "Shrivishnu",
      email: "vishnu@dev.org",
      role: "DEVELOPER",
    },
    reporter: {
      id: "u1",
      name: "Sachin (Lead Dev)",
      email: "sachin@dev.org",
      role: "ADMIN",
    },
    _count: { comments: 0, blockedBy: 0 },
  },
  {
    id: "iss-102",
    key: "CORE-102",
    title: "Unauthorized role can view private security comments",
    description:
      "Users with REPORTER role can bypass ACL restrictions via direct API calls to fetch private comments.",
    status: "ASSIGNED",
    priority: "URGENT",
    severity: "CRITICAL",
    environment: "Production Cluster EU-1",
    version: "v1.1.9",
    createdAt: new Date("2026-08-24"),
    updatedAt: new Date("2026-08-27"),
    project: { key: "CORE", name: "Core Engine Infrastructure" },
    component: { name: "Auth & ACL" },
    assignee: {
      id: "u1",
      name: "Sachin (Lead Dev)",
      email: "sachin@dev.org",
      role: "ADMIN",
    },
    reporter: {
      id: "u3",
      name: "Sreenidhi (QA Manager)",
      email: "sreenidhi@qa.org",
      role: "QA",
    },
    _count: { comments: 1, blockedBy: 0 },
  },
];

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.component?.name &&
        issue.component.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus } : iss))
    );
  };

  const handleCreateBug = (newBugData: any) => {
    const newIssue: IssueItem = {
      id: `iss-${Date.now()}`,
      key: `${newBugData.projectKey}-${Math.floor(100 + Math.random() * 900)}`,
      title: newBugData.title,
      description: newBugData.description,
      status: "NEW",
      priority: newBugData.priority,
      severity: newBugData.severity,
      environment: newBugData.environment,
      version: newBugData.version,
      createdAt: new Date(),
      updatedAt: new Date(),
      project: { key: newBugData.projectKey, name: newBugData.projectKey === "CORE" ? "Core Engine Infrastructure" : "Next.js Frontend" },
      component: { name: newBugData.component },
      assignee: null,
      reporter: { id: "u1", name: "Sachin (Lead Dev)", email: "sachin@dev.org", role: "ADMIN" },
      _count: { comments: 0, blockedBy: 0 },
    };

    setIssues([newIssue, ...issues]);
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

          {viewMode === "kanban" ? (
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