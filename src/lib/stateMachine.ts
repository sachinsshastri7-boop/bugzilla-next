import { IssueStatus } from "@prisma/client";

export const ALLOWED_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  UNCONFIRMED: [IssueStatus.NEW, IssueStatus.RESOLVED, IssueStatus.CLOSED],
  NEW: [IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED],
  ASSIGNED: [IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED],
  IN_PROGRESS: [IssueStatus.RESOLVED, IssueStatus.NEW],
  RESOLVED: [IssueStatus.VERIFIED, IssueStatus.REOPENED, IssueStatus.CLOSED],
  VERIFIED: [IssueStatus.CLOSED, IssueStatus.REOPENED],
  CLOSED: [IssueStatus.REOPENED],
  REOPENED: [IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED],
};

export function isValidTransition(current: IssueStatus, next: IssueStatus): boolean {
  return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
}