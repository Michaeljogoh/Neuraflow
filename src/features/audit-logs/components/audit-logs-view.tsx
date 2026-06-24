"use client";

import { ColoredBadge } from "@/components/colored-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUDIT_ACTION_LABELS } from "@/features/audit-logs/lib/audit-log-labels";
import { useAuditLogsPage } from "@/features/audit-logs/hooks/use-audit-logs";
import { AuditLogStatus } from "@/generated/prisma/enums";
import { formatDistanceToNow } from "date-fns";

const STATUS_LABELS: Record<AuditLogStatus, string> = {
  SUCCESS: "Success",
  PREVENTED: "Prevented",
  FAILED: "Failed",
};

export function AuditLogsView() {
  const { data, page, setPage } = useAuditLogsPage();

  return (
    <div className="w-full p-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Audit logs</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Visibility into who changed what, and when.
      </p>

      <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Recent events</CardTitle>
          <CardDescription>
            {data.totalCount} event{data.totalCount === 1 ? "" : "s"} in the last{" "}
            {data.retentionDays} days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No audit events yet. Actions like creating workflows, updating credentials,
              and blocked webhooks will appear here.
            </p>
          )}
          {data.items.map((event) => (
            <div
              key={event.id}
              className="grid gap-2 rounded-lg border border-border/70 bg-background/80 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5 sm:grid-cols-[1.3fr_1.4fr_1fr_auto]"
            >
              <div>
                <p className="text-xs text-muted-foreground">Actor</p>
                <p className="text-sm font-medium">{event.actorEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Action</p>
                <p className="text-sm font-medium">
                  {AUDIT_ACTION_LABELS[event.action]}{" "}
                  <span className="text-muted-foreground">({event.target})</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm">
                  {formatDistanceToNow(event.createdAt, { addSuffix: true })}
                </p>
              </div>
              <div className="sm:text-right">
                <ColoredBadge colorKey={STATUS_LABELS[event.status]}>
                  {STATUS_LABELS[event.status]}
                </ColoredBadge>
              </div>
            </div>
          ))}

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.hasPreviousPage}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.hasNextPage}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Retention policy</CardTitle>
            <CardDescription>How long events are stored in your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Audit entries are retained for {data.retentionDays} days on your current plan.
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Event sources</CardTitle>
            <CardDescription>What generates audit entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>• Workflow and credential changes</p>
            <p>• Workflow executions and failures</p>
            <p>• Settings updates</p>
            <p>• Blocked unsigned webhook attempts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
