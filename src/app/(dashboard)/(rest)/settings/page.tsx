import { SettingsView } from "@/features/settings/components/settings-view";
import { prefetchSettings } from "@/features/settings/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

function SettingsLoading() {
  return (
    <div className="w-full p-6 text-sm text-muted-foreground">Loading settings...</div>
  );
}

export default async function SettingsPage() {
  await requireAuth();
  prefetchSettings();

  return (
    <HydrateClient>
      <Suspense fallback={<SettingsLoading />}>
        <SettingsView />
      </Suspense>
    </HydrateClient>
  );
}
