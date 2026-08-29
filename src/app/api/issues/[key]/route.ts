export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidTransition } from "@/lib/stateMachine";

// PATCH /api/issues/[key] - Update status & record audit log
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body = await request.json();
    const { status, assigneeId } = body;

    const issue = await prisma.issue.findUnique({ where: { key } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    if (status && status !== issue.status) {
      if (!isValidTransition(issue.status as any, status)) {
        return NextResponse.json(
          { error: `Invalid state transition from ${issue.status} to ${status}` },
          { status: 400 }
        );
      }
    }

    const updatedIssue = await prisma.issue.update({
      where: { key },
      data: {
        ...(status ? { status } : {}),
        ...(assigneeId !== undefined ? { assigneeId } : {}),
      },
      include: {
        project: { select: { key: true, name: true } },
        component: { select: { name: true } },
        assignee: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        reporter: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        _count: { select: { comments: true, blockedBy: true } },
      },
    });

    if (status && status !== issue.status) {
      const actor = await prisma.user.findFirst();
      if (actor) {
        await prisma.auditLog.create({
          data: {
            action: "UPDATE_STATUS",
            field: "status",
            oldValue: issue.status,
            newValue: status,
            issueId: issue.id,
            userId: actor.id,
          },
        });
      }
    }

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("PATCH /api/issues/[key] error:", error);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}