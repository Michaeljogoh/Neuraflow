"use client";

import Link from "next/link";
import { ColoredBadge } from "@/components/colored-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageOverview } from "@/features/subscription/components/usage-overview";
import { useSuspenseUsageOverview } from "@/features/usage/hooks/use-usage";

export function UsagePageView() {
  const { data } = useSuspenseUsageOverview();

  return (
    <div className="w-full p-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Usage & limits</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Live run consumption, workspace health, and plan capacity.
      </p>

      <UsageOverview />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Plan capabilities</CardTitle>
            <CardDescription>Features active in your workspace</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <ColoredBadge
              colorKey={data.capabilities.templateLibrary ? "Template library" : "Free plan"}
            >
              Template library {data.capabilityCounts.templates > 0 && `(${data.capabilityCounts.templates})`}
            </ColoredBadge>
            <ColoredBadge
              colorKey={data.capabilities.executionHistory ? "Execution history" : "Free plan"}
            >
              Execution history
            </ColoredBadge>
            <ColoredBadge
              colorKey={data.capabilities.auditMetadata ? "Audit-friendly metadata" : "Free plan"}
            >
              Audit logs ({data.capabilityCounts.auditLogs})
            </ColoredBadge>
            <ColoredBadge colorKey={data.capabilities.aiNodes ? "AI nodes" : "Free plan"}>
              AI nodes ({data.capabilityCounts.aiNodes})
            </ColoredBadge>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Recommended next step</CardTitle>
            <CardDescription>Based on your current usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {data.quotaRemaining === 0 ? (
              <p>
                You have reached your monthly run limit. Upgrade to Pro for higher capacity.
              </p>
            ) : data.failures24h > 0 ? (
              <p>
                You have {data.failures24h} failed run(s) in the last 24 hours. Check{" "}
                <Link href="/executions" className="text-primary underline-offset-4 hover:underline">
                  Executions
                </Link>{" "}
                and{" "}
                <Link href="/audit-logs" className="text-primary underline-offset-4 hover:underline">
                  Audit logs
                </Link>
                .
              </p>
            ) : (
              <p>
                Your automations are healthy. Browse{" "}
                <Link href="/templates" className="text-primary underline-offset-4 hover:underline">
                  Templates
                </Link>{" "}
                to expand your workflows.
              </p>
            )}
            {!data.hasSubscription && (
              <Button size="sm" asChild>
                <Link href="/settings">View plan options</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Workflow runs</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">
            {data.runsThisMonth.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Credentials in use</CardTitle>
            <CardDescription>Stored integrations</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">
            {data.credentialCount}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Automation success</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">
            {data.successRate}%
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
