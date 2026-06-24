import { AuditLogsView } from "@/features/audit-logs/components/audit-logs-view";
import { prefetchAuditLogs } from "@/features/audit-logs/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

function AuditLogsLoading() {
  return (
    <div className="w-full p-6 text-sm text-muted-foreground">Loading audit logs...</div>
  );
}

export default async function AuditLogsPage() {
  await requireAuth();
  prefetchAuditLogs();

  return (
    <HydrateClient>
      <Suspense fallback={<AuditLogsLoading />}>
        <AuditLogsView />
      </Suspense>
    </HydrateClient>
  );
}
