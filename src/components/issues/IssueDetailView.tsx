"use client";

import { useState } from "react";
import { IssueItem, IssueStatus } from "@/types";
import {
  getStatusStyle,
  getPriorityStyle,
  getSeverityStyle,
} from "@/lib/utils";
import { ALLOWED_TRANSITIONS } from "@/lib/stateMachine";
import ActivityTimeline from "./ActivityTimeline";
import { X, Send } from "lucide-react";

interface IssueDetailViewProps {
  issue: IssueItem;
  onClose: () => void;
  onUpdateStatus?: (issueId: string, nextStatus: IssueStatus) => void;
}

export default function IssueDetailView({
  issue,
  onClose,
  onUpdateStatus,
}: IssueDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"details" | "audit">("details");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<
    { id: string; author: string; text: string; date: string }[]
  >([
    {
      id: "c1",
      author: "Sachin (Lead Dev)",
      text: "Investigating the worker thread pool setup. Connection handles are remaining open.",
      date: "Aug 27, 2026",
    },
  ]);

  const statusStyle = getStatusStyle(issue.status);
  const priorityInfo = getPriorityStyle(issue.priority);
  const severityInfo = getSeverityStyle(issue.severity);
  const allowedNextStates = ALLOWED_TRANSITIONS[issue.status] || [];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        author: "Sachin (Admin)",
        text: commentText,
        date: "Just now",
      },
    ]);
    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4 mb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20">
                {issue.key}
              </span>
              <span
                className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {statusStyle.label}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{issue.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2">
              <h4 className="text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider">
                Description / Reproduction Steps
              </h4>
              <p className="text-xs text-zinc-200 leading-relaxed font-mono whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2.5">
              <h4 className="text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider">
                State Machine Transition
              </h4>
              <div className="flex flex-wrap gap-2">
                {allowedNextStates.length === 0 ? (
                  <span className="text-xs text-zinc-500 italic">No further state transitions available.</span>
                ) : (
                  allowedNextStates.map((nextStatus) => (
                    <button
                      key={nextStatus}
                      onClick={() => onUpdateStatus && onUpdateStatus(issue.id, nextStatus)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500 hover:text-black border border-zinc-700/60 text-xs font-mono transition-all duration-150"
                    >
                      Move to {nextStatus}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex border-b border-zinc-800 text-xs font-mono">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 px-3 border-b-2 transition ${
                    activeTab === "details"
                      ? "border-rose-400 text-rose-400 font-bold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Comments ({comments.length})
                </button>
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`pb-2 px-3 border-b-2 transition ${
                    activeTab === "audit"
                      ? "border-rose-400 text-rose-400 font-bold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Audit History
                </button>
              </div>

              {activeTab === "details" ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-zinc-200 font-mono">{c.author}</span>
                          <span className="text-zinc-500 text-[10px]">{c.date}</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-sans">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment or update developer notes..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-rose-500/50 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <Send className="h-3.5 w-3.5" /> Comment
                    </button>
                  </form>
                </div>
              ) : (
                <ActivityTimeline
                  activities={[
                    {
                      id: "act-1",
                      field: "status",
                      oldValue: "NEW",
                      newValue: issue.status,
                      createdAt: issue.createdAt,
                      actor: { name: issue.reporter.name },
                    },
                  ]}
                />
              )}
            </div>

          </div>

          <div className="space-y-4 text-xs font-mono bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80 h-fit">
            <div className="space-y-1 pb-3 border-b border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">Priority / Severity</span>
              <div className="flex items-center justify-between">
                <span className={priorityInfo.color}>{priorityInfo.label} Priority</span>
                <span className={severityInfo.color}>{severityInfo.label}</span>
              </div>
            </div>

            <div className="space-y-1 pb-3 border-b border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">Project / Component</span>
              <p className="text-zinc-200">{issue.project.name}</p>
              {issue.component && (
                <span className="inline-block text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 mt-1">
                  {issue.component.name}
                </span>
              )}
            </div>

            <div className="space-y-1 pb-3 border-b border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">People</span>
              <div className="space-y-1.5 pt-1 text-[11px]">
                <p className="text-zinc-300">
                  <strong className="text-zinc-500">Assignee:</strong>{" "}
                  {issue.assignee ? issue.assignee.name : "Unassigned"}
                </p>
                <p className="text-zinc-300">
                  <strong className="text-zinc-500">Reporter:</strong> {issue.reporter.name}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">System Context</span>
              <p className="text-zinc-400 text-[11px]">{issue.environment || "None provided"}</p>
              <p className="text-zinc-500 text-[10px]">Version: {issue.version || "N/A"}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}