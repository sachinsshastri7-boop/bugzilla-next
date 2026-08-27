import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IssueStatus, Priority, Severity } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusStyle(status: IssueStatus): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case "UNCONFIRMED":
      return { label: "UNCONFIRMED", bg: "bg-zinc-800/60", text: "text-zinc-400", border: "border-zinc-700/60" };
    case "NEW":
      return { label: "NEW", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" };
    case "ASSIGNED":
      return { label: "ASSIGNED", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" };
    case "IN_PROGRESS":
      return { label: "IN PROGRESS", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" };
    case "RESOLVED":
      return { label: "RESOLVED", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
    case "VERIFIED":
      return { label: "VERIFIED", bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" };
    case "CLOSED":
      return { label: "CLOSED", bg: "bg-zinc-900", text: "text-zinc-500", border: "border-zinc-800" };
    case "REOPENED":
      return { label: "REOPENED", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" };
    default:
      return { label: status, bg: "bg-zinc-800", text: "text-zinc-300", border: "border-zinc-700" };
  }
}

export function getPriorityStyle(priority: Priority): { label: string; color: string } {
  switch (priority) {
    case "URGENT":
      return { label: "Urgent", color: "text-rose-500" };
    case "HIGH":
      return { label: "High", color: "text-amber-500" };
    case "MEDIUM":
      return { label: "Medium", color: "text-blue-400" };
    case "LOW":
      return { label: "Low", color: "text-zinc-400" };
  }
}

export function getSeverityStyle(severity: Severity): { label: string; color: string } {
  switch (severity) {
    case "BLOCKER":
      return { label: "Blocker", color: "text-red-500 font-bold" };
    case "CRITICAL":
      return { label: "Critical", color: "text-rose-400 font-semibold" };
    case "MAJOR":
      return { label: "Major", color: "text-amber-400" };
    case "NORMAL":
      return { label: "Normal", color: "text-zinc-300" };
    case "MINOR":
      return { label: "Minor", color: "text-zinc-400" };
    case "TRIVIAL":
      return { label: "Trivial", color: "text-zinc-500" };
  }
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}