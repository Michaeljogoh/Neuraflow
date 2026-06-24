import { NodeType } from "@/generated/prisma/enums";
import { USAGE_LIMITS } from "@/config/constants";
import prisma from "@/lib/db";
import { getPremiumAccess } from "@/lib/polar-premium";

function getMonthStartUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function getDayAgoUtc(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function getUsageOverview(userId: string) {
  const { hasAccess } = await getPremiumAccess(userId);
  const monthlyQuota = hasAccess
    ? USAGE_LIMITS.PRO_MONTHLY_RUNS
    : USAGE_LIMITS.FREE_MONTHLY_RUNS;
  const auditRetentionDays = hasAccess
    ? USAGE_LIMITS.PRO_AUDIT_RETENTION_DAYS
    : USAGE_LIMITS.FREE_AUDIT_RETENTION_DAYS;

  const monthStart = getMonthStartUtc();
  const last24h = getDayAgoUtc(1);
  const last30d = getDayAgoUtc(30);

  const [
    runsThisMonth,
    credentialCount,
    workflowCount,
    templateWorkflowCount,
    failures24h,
    completedLast30d,
    aiNodeCount,
    auditLogCount,
  ] = await Promise.all([
    prisma.execution.count({
      where: {
        workflow: { userId },
        startedAt: { gte: monthStart },
      },
    }),
    prisma.credential.count({ where: { userId } }),
    prisma.workflow.count({ where: { userId } }),
    prisma.workflow.count({
      where: { userId, templateSlug: { not: null } },
    }),
    prisma.execution.count({
      where: {
        workflow: { userId },
        status: "FAILED",
        startedAt: { gte: last24h },
      },
    }),
    prisma.execution.findMany({
      where: {
        workflow: { userId },
        status: "SUCCESS",
        completedAt: { not: null },
        startedAt: { gte: last30d },
      },
      select: { startedAt: true, completedAt: true },
    }),
    prisma.node.count({
      where: {
        workflow: { userId },
        type: { in: [NodeType.OPENAI, NodeType.ANTHROPIC, NodeType.GEMINI] },
      },
    }),
    prisma.auditLog.count({
      where: {
        userId,
        createdAt: { gte: getDayAgoUtc(auditRetentionDays) },
      },
    }),
  ]);

  const successLast30d = completedLast30d.length;
  const failedLast30d = await prisma.execution.count({
    where: {
      workflow: { userId },
      status: "FAILED",
      startedAt: { gte: last30d },
    },
  });

  const totalResolved = successLast30d + failedLast30d;
  const successRate =
    totalResolved === 0
      ? 100
      : Math.round((successLast30d / totalResolved) * 1000) / 10;

  const latencies = completedLast30d
    .filter((e) => e.completedAt)
    .map((e) => e.completedAt!.getTime() - e.startedAt.getTime());

  const avgLatencyMs =
    latencies.length === 0
      ? 0
      : latencies.reduce((sum, ms) => sum + ms, 0) / latencies.length;

  const avgLatencySeconds =
    avgLatencyMs === 0 ? 0 : Math.round((avgLatencyMs / 1000) * 10) / 10;

  const quotaUsedPercent = Math.min(
    Math.round((runsThisMonth / monthlyQuota) * 1000) / 10,
    100,
  );

  return {
    hasSubscription: hasAccess,
    monthlyQuota,
    runsThisMonth,
    quotaUsedPercent,
    quotaRemaining: Math.max(monthlyQuota - runsThisMonth, 0),
    credentialCount,
    workflowCount,
    successRate,
    avgLatencySeconds,
    failures24h,
    auditRetentionDays,
    capabilities: {
      templateLibrary: templateWorkflowCount > 0,
      executionHistory: runsThisMonth > 0,
      auditMetadata: auditLogCount > 0,
      aiNodes: aiNodeCount > 0,
    },
    capabilityCounts: {
      templates: templateWorkflowCount,
      executions: runsThisMonth,
      auditLogs: auditLogCount,
      aiNodes: aiNodeCount,
    },
  };
}

export async function assertWithinMonthlyQuota(userId: string) {
  const overview = await getUsageOverview(userId);
  if (overview.runsThisMonth >= overview.monthlyQuota) {
    return {
      allowed: false as const,
      overview,
    };
  }
  return { allowed: true as const, overview };
}
