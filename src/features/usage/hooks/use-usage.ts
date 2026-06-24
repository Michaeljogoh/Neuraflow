import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseUsageOverview = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.usage.getOverview.queryOptions());
};
