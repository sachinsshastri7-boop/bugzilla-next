import { IssueStatus, Priority, Severity, Resolution, Role } from "@prisma/client";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: Role;
}

export interface IssueItem {
  id: string;
  key: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  severity: Severity;
  resolution?: Resolution | null;
  environment?: string | null;
  version?: string | null;
  createdAt: Date;
  updatedAt: Date;
  project: {
    key: string;
    name: string;
  };
  component?: {
    name: string;
  } | null;
  assignee?: UserSummary | null;
  reporter: UserSummary;
  _count?: {
    comments: number;
    blockedBy: number;
  };
}