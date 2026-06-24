import { UsagePageView } from "@/features/usage/components/usage-page-view";
import { prefetchUsageOverview } from "@/features/usage/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

function UsageLoading() {
  return (
    <div className="w-full p-6 text-sm text-muted-foreground">Loading usage data...</div>
  );
}

export default async function UsagePage() {
  await requireAuth();
  prefetchUsageOverview();

  return (
    <HydrateClient>
      <Suspense fallback={<UsageLoading />}>
        <UsagePageView />
      </Suspense>
    </HydrateClient>
  );
}
