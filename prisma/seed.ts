import { PrismaClient, Role, Priority, Severity, IssueStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Bugzilla Reconstruction Database...");

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.issueDependency.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.component.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const alice = await prisma.user.create({
    data: {
      name: "Sachin (Lead Dev)",
      email: "sachin@dev.org",
      role: Role.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Shrivishnu",
      email: "vishnu@dev.org",
      role: Role.DEVELOPER,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
  });

  const sreenidhi = await prisma.user.create({
    data: {
      name: "Sreenidhi (QA Manager)",
      email: "sreenidhi@qa.org",
      role: Role.QA,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    },
  });

  // 2. Create Projects & Components
  const coreProject = await prisma.project.create({
    data: {
      key: "CORE",
      name: "Core Engine Infrastructure",
      description: "Low-level system architecture and memory management engine.",
      components: {
        create: [
          { name: "Auth & ACL", description: "Role-based access control and session management." },
          { name: "Database Engine", description: "Prisma ORM data access layers and query optimization." },
          { name: "State Machine", description: "Bugzilla lifecycle transitions and status enforcement." },
        ],
      },
    },
    include: { components: true },
  });

  const uiProject = await prisma.project.create({
    data: {
      key: "UI",
      name: "Next.js Frontend & Visuals",
      description: "Modern Kanban board, command palette, and interactive workflows.",
      components: {
        create: [
          { name: "Kanban Board", description: "Drag and drop board transitions." },
          { name: "Command Palette", description: "Ctrl+K keyboard quick navigation." },
        ],
      },
    },
    include: { components: true },
  });

  // 3. Create Issues / Bugs
  const bug1 = await prisma.issue.create({
    data: {
      key: "CORE-101",
      title: "Memory leak during concurrent state transitions",
      description: "When 50+ concurrent requests attempt to update issue status, the state machine validation worker leaks memory in worker threads.",
      status: IssueStatus.IN_PROGRESS,
      priority: Priority.URGENT,
      severity: Severity.BLOCKER,
      environment: "Node v20.20 / PostgreSQL 16 / Linux x64",
      version: "v1.2.0-beta",
      projectId: coreProject.id,
      componentId: coreProject.components[2].id, // State Machine
      assigneeId: alice.id,
      reporterId: sreenidhi.id,
    },
  });

  const bug2 = await prisma.issue.create({
    data: {
      key: "UI-201",
      title: "Kanban board card drag animation stutters on Safari",
      description: "Dragging issue cards across status columns causes frame drops below 30fps on WebKit engines.",
      status: IssueStatus.NEW,
      priority: Priority.HIGH,
      severity: Severity.MINOR,
      environment: "Safari 17.5 / macOS Sequoia",
      version: "v2.0.0",
      projectId: uiProject.id,
      componentId: uiProject.components[0].id, // Kanban Board
      assigneeId: bob.id,
      reporterId: alice.id,
    },
  });

  const bug3 = await prisma.issue.create({
    data: {
      key: "CORE-102",
      title: "Unauthorized role can view private security comments",
      description: "Users with REPORTER role can bypass ACL restrictions via direct API calls to fetch private comments.",
      status: IssueStatus.ASSIGNED,
      priority: Priority.URGENT,
      severity: Severity.CRITICAL,
      environment: "Production Cluster EU-1",
      version: "v1.1.9",
      projectId: coreProject.id,
      componentId: coreProject.components[0].id, // Auth & ACL
      assigneeId: alice.id,
      reporterId: sreenidhi.id,
    },
  });

  // 4. Create Issue Dependencies (CORE-102 Blocks BUG-101)
  await prisma.issueDependency.create({
    data: {
      blockingIssueId: bug3.id,
      blockedIssueId: bug1.id,
    },
  });

  // 5. Create Comments & Audit Logs
  await prisma.comment.create({
    data: {
      body: "Investigating the worker thread pool setup. Appears to be an unclosed DB connection handle.",
      issueId: bug1.id,
      authorId: alice.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      field: "status",
      oldValue: "NEW",
      newValue: "IN_PROGRESS",
      issueId: bug1.id,
      actorId: alice.id,
    },
  });

  console.log("✅ Database seeded successfully with 3 issues, 2 projects, and audit logs!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });