export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/issues - Fetch bugs with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const issues = await prisma.issue.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { key: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          status ? { status: status as any } : {},
        ],
      },
      include: {
        project: { select: { key: true, name: true } },
        component: { select: { name: true } },
        assignee: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        reporter: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        _count: { select: { comments: true, blockedBy: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

// POST /api/issues - File a new bug
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, projectKey, component, priority, severity, environment, version } = body;

    if (!title || !description || !projectKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { key: projectKey } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const reporter = await prisma.user.findFirst();
    if (!reporter) {
      return NextResponse.json({ error: "No system user found for reporting" }, { status: 400 });
    }

    const issueCount = await prisma.issue.count({ where: { projectId: project.id } });
    const issueKey = `${projectKey}-${101 + issueCount}`;

    let componentId: string | undefined = undefined;
    if (component) {
      const comp = await prisma.component.findFirst({
        where: { projectId: project.id, name: component },
      });
      if (comp) componentId = comp.id;
    }

    const newIssue = await prisma.issue.create({
      data: {
        key: issueKey,
        title,
        description,
        status: "NEW",
        priority: priority || "MEDIUM",
        severity: severity || "NORMAL",
        environment,
        version,
        projectId: project.id,
        componentId,
        reporterId: reporter.id,
      },
      include: {
        project: { select: { key: true, name: true } },
        component: { select: { name: true } },
        assignee: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        reporter: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        _count: { select: { comments: true, blockedBy: true } },
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("POST /api/issues error:", error);
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}