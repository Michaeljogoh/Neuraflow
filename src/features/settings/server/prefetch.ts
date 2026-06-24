import "server-only";

import { prefetch, trpc } from "@/trpc/server";

export const prefetchSettings = () => {
  return prefetch(trpc.settings.get.queryOptions());
};
