"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { IssueItem, IssueStatus, Priority, Severity } from "@/types";
import {
  getStatusStyle,
  getPriorityStyle,
  getSeverityStyle,
} from "@/lib/utils";
import { isValidTransition } from "@/lib/stateMachine";
import {
  MessageSquare,
  GitPullRequest,
  User,
  ShieldAlert,
} from "lucide-react";

interface IssueKanbanProps {
  initialIssues: IssueItem[];
  onStatusChange?: (issueId: string, newStatus: IssueStatus) => void;
  onSelectIssue?: (issueKey: string) => void;
}

const KANBAN_COLUMNS: { id: IssueStatus; title: string; color: string }[] = [
  { id: "NEW", title: "New / Reported", color: "border-blue-500/40" },
  { id: "ASSIGNED", title: "Assigned", color: "border-purple-500/40" },
  { id: "IN_PROGRESS", title: "In Progress", color: "border-amber-500/40" },
  { id: "RESOLVED", title: "Resolved", color: "border-emerald-500/40" },
  { id: "VERIFIED", title: "Verified / Closed", color: "border-teal-500/40" },
];

export default function IssueKanban({
  initialIssues,
  onStatusChange,
  onSelectIssue,
}: IssueKanbanProps) {
  const [issues, setIssues] = useState<IssueItem[]>(initialIssues);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getIssuesByStatus = (status: IssueStatus) => {
    if (status === "VERIFIED") {
      return issues.filter(
        (i) => i.status === "VERIFIED" || i.status === "CLOSED"
      );
    }
    return issues.filter((i) => i.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const targetStatus = destination.droppableId as IssueStatus;
    const draggedIssue = issues.find((i) => i.id === draggableId);

    if (!draggedIssue) return;

    if (!isValidTransition(draggedIssue.status, targetStatus)) {
      setErrorMessage(
        `Invalid status transition from '${draggedIssue.status}' to '${targetStatus}'.`
      );
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }

    const updatedIssues = issues.map((i) =>
      i.id === draggableId ? { ...i, status: targetStatus } : i
    );
    setIssues(updatedIssues);

    if (onStatusChange) {
      onStatusChange(draggableId, targetStatus);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-200 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
          {KANBAN_COLUMNS.map((col) => {
            const colIssues = getIssuesByStatus(col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-3 min-w-[260px] min-h-[600px]"
              >
                <div
                  className={`flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 border-t-2 ${col.color} pt-2 px-1`}
                >
                  <h3 className="font-semibold text-xs text-zinc-200 tracking-wide uppercase font-mono">
                    {col.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 font-semibold">
                    {colIssues.length}
                  </span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 transition-colors duration-200 rounded-xl p-1 ${
                        snapshot.isDraggingOver ? "bg-zinc-900/60" : ""
                      }`}
                    >
                      {colIssues.map((issue, index) => {
                        const priorityInfo = getPriorityStyle(issue.priority);
                        const severityInfo = getSeverityStyle(issue.severity);

                        return (
                          <Draggable
                            key={issue.id}
                            draggableId={issue.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() =>
                                  onSelectIssue && onSelectIssue(issue.key)
                                }
                                className={`p-3.5 rounded-xl border bg-zinc-900/90 hover:bg-zinc-800/80 transition-all duration-150 cursor-grab active:cursor-grabbing group ${
                                  snapshot.isDragging
                                    ? "border-rose-500/60 shadow-xl shadow-rose-500/10 scale-105 z-50 bg-zinc-900"
                                    : "border-zinc-800/90 hover:border-zinc-700/80"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                    {issue.key}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-[10px]">
                                    <span className={severityInfo.color}>
                                      {severityInfo.label}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-rose-300 transition-colors mb-2">
                                  {issue.title}
                                </h4>

                                {issue.component && (
                                  <div className="mb-3">
                                    <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700/50">
                                      {issue.component.name}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-500">
                                  <div className="flex items-center gap-2">
                                    {issue._count?.comments !== undefined && (
                                      <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {issue._count.comments}
                                      </span>
                                    )}
                                    {issue._count?.blockedBy ? (
                                      <span className="flex items-center gap-1 text-amber-400">
                                        <GitPullRequest className="h-3 w-3" />
                                        {issue._count.blockedBy}
                                      </span>
                                    ) : null}
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {issue.assignee ? (
                                      <div
                                        className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] font-bold text-zinc-300 flex items-center justify-center"
                                        title={`Assigned to ${issue.assignee.name}`}
                                      >
                                        {issue.assignee.name.charAt(0)}
                                      </div>
                                    ) : (
                                      <User className="h-3.5 w-3.5 text-zinc-600" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}