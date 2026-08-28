export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, projectKey, component, priority, severity, environment, version } = body;

    if (!title || !description || !projectKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let project = await prisma.project.findUnique({ where: { key: projectKey } });
    if (!project) {
      project = await prisma.project.findFirst();
    }
    
    if (!project) {
      project = await prisma.project.create({
        data: {
          key: projectKey || "CORE",
          name: "Core Infrastructure",
        },
      });
    }

    let reporter = await prisma.user.findFirst();
    if (!reporter) {
      reporter = await prisma.user.create({
        data: {
          name: "Sachin",
          email: "sachin@bugzilla.local",
          role: "ADMIN",
        },
      });
    }

    const issueCount = await prisma.issue.count({ where: { projectId: project.id } });
    const issueKey = `${project.key}-${101 + issueCount}`;

    let componentId: string | undefined = undefined;
    if (component) {
      let comp = await prisma.component.findFirst({
        where: { projectId: project.id, name: component },
      });

      if (!comp) {
        comp = await prisma.component.create({
          data: {
            name: component,
            projectId: project.id,
          },
        });
      }
      componentId = comp.id;
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