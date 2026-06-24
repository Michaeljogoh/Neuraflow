import "server-only";

import { prefetch, trpc } from "@/trpc/server";

export const prefetchUsageOverview = () => {
  return prefetch(trpc.usage.getOverview.queryOptions());
};
