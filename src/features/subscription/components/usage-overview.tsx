"use client";

import { AlertTriangleIcon, CheckCircleIcon, GaugeIcon } from "lucide-react";
import { ColoredBadge } from "@/components/colored-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSuspenseUsageOverview } from "@/features/usage/hooks/use-usage";

export const UsageOverview = () => {
  const { data } = useSuspenseUsageOverview();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2 border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Usage this month</CardTitle>
          <CardDescription>
            Track workflow runs against your monthly plan quota.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {data.runsThisMonth.toLocaleString()} /{" "}
              {data.monthlyQuota.toLocaleString()} runs
            </span>
            <ColoredBadge colorKey={data.hasSubscription ? "Pro plan" : "Free plan"}>
              {data.hasSubscription ? "Pro plan" : "Free plan"}
            </ColoredBadge>
          </div>
          <Progress value={data.quotaUsedPercent} />
          <p className="text-xs text-muted-foreground">
            {data.quotaRemaining > 0
              ? `${data.quotaRemaining.toLocaleString()} runs remaining this month.`
              : "Monthly quota reached. Upgrade to Pro or wait until next month."}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Run health</CardTitle>
          <CardDescription>Last 30 days of completed runs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-4 text-emerald-600" />
            Success rate: {data.successRate}%
          </div>
          <div className="flex items-center gap-2">
            <GaugeIcon className="size-4 text-primary" />
            Avg. latency: {data.avgLatencySeconds > 0 ? `${data.avgLatencySeconds}s` : "—"}
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-amber-600" />
            Failures in 24h: {data.failures24h}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
