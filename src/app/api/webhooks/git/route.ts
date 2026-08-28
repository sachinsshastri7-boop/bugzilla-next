export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/webhooks/git - GitHub Push Webhook Handler
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const commits = payload.commits || [];

    const resolvedKeys: string[] = [];

    for (const commit of commits) {
      const message = commit.message || "";
      
      // Match pattern: "Fixes CORE-101", "Closes UI-201", etc.
      const match = message.match(/(?:fixes|closes|resolves)\s+([A-Z]+-\d+)/i);
      if (match && match[1]) {
        const issueKey = match[1].toUpperCase();

        const issue = await prisma.issue.findUnique({ where: { key: issueKey } });
        if (issue) {
          // Move issue status to RESOLVED and set resolution to FIXED
          await prisma.issue.update({
            where: { key: issueKey },
            data: {
              status: "RESOLVED",
              resolution: "FIXED",
            },
          });

          // Add automated Git commit comment
          const botUser = await prisma.user.findFirst();
          if (botUser) {
            await prisma.comment.create({
              data: {
                body: `🤖 Automated Git Resolution: Issue resolved via commit ${commit.id.substring(
                  0,
                  7
                )} ("${message}") by ${commit.author?.name || "Git User"}.`,
                issueId: issue.id,
                authorId: botUser.id,
              },
            });

            await prisma.activityLog.create({
              data: {
                field: "status",
                oldValue: issue.status,
                newValue: "RESOLVED",
                issueId: issue.id,
                actorId: botUser.id,
              },
            });
          }

          resolvedKeys.push(issueKey);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processedCommits: commits.length,
      resolvedIssues: resolvedKeys,
    });
  } catch (error) {
    console.error("POST /api/webhooks/git error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}