import { IssueStatus } from "@/types";

export const ALLOWED_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  UNCONFIRMED: ["NEW", "RESOLVED", "CLOSED"],
  NEW: ["ASSIGNED", "IN_PROGRESS", "RESOLVED"],
  ASSIGNED: ["IN_PROGRESS", "RESOLVED"],
  IN_PROGRESS: ["RESOLVED", "NEW"],
  RESOLVED: ["VERIFIED", "REOPENED", "CLOSED"],
  VERIFIED: ["CLOSED", "REOPENED"],
  CLOSED: ["REOPENED"],
  REOPENED: ["ASSIGNED", "IN_PROGRESS", "RESOLVED"],
};

export function isValidTransition(current: IssueStatus, next: IssueStatus): boolean {
  return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
}