"use client";

import { useState } from "react";
import { IssueItem } from "@/types";
import {
  getStatusStyle,
  getPriorityStyle,
  getSeverityStyle,
  formatDate,
} from "@/lib/utils";
import { ArrowUpDown, User, ExternalLink } from "lucide-react";

interface IssueTableProps {
  issues: IssueItem[];
  onSelectIssue?: (issueKey: string) => void;
}

type SortField = "key" | "title" | "status" | "priority" | "createdAt";

export default function IssueTable({ issues, onSelectIssue }: IssueTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    let valueA: string | number | Date = a[sortField] || "";
    let valueB: string | number | Date = b[sortField] || "";

    if (sortField === "createdAt") {
      valueA = new Date(a.createdAt).getTime();
      valueB = new Date(b.createdAt).getTime();
    }

    if (valueA < valueB) return sortAsc ? -1 : 1;
    if (valueA > valueB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 font-mono text-[11px] uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort("key")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  Key <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("title")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  Summary / Title <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  Status <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("priority")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  Priority <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                </div>
              </th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Component</th>
              <th className="py-3.5 px-4">Assignee</th>
              <th
                onClick={() => handleSort("createdAt")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  Reported <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
            {sortedIssues.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-500 font-mono">
                  No issues found matching the criteria.
                </td>
              </tr>
            ) : (
              sortedIssues.map((issue) => {
                const statusStyle = getStatusStyle(issue.status);
                const priorityInfo = getPriorityStyle(issue.priority);
                const severityInfo = getSeverityStyle(issue.severity);

                return (
                  <tr
                    key={issue.id}
                    onClick={() => onSelectIssue && onSelectIssue(issue.key)}
                    className="hover:bg-zinc-900/80 transition-colors duration-150 cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">
                      <span className="bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {issue.key}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs font-medium text-zinc-100 group-hover:text-rose-300 transition-colors truncate">
                      {issue.title}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {statusStyle.label}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                      <span className={priorityInfo.color}>{priorityInfo.label}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                      <span className={severityInfo.color}>{severityInfo.label}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {issue.component ? (
                        <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                          {issue.component.name}
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[10px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {issue.assignee ? (
                          <>
                            <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] font-bold text-zinc-300 flex items-center justify-center">
                              {issue.assignee.name.charAt(0)}
                            </div>
                            <span className="text-xs text-zinc-300">
                              {issue.assignee.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-zinc-600 font-mono text-[10px] flex items-center gap-1">
                            <User className="h-3 w-3" /> Unassigned
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                      {formatDate(issue.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectIssue) onSelectIssue(issue.key);
                        }}
                        className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}