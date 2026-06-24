import "server-only";

import { prefetch, trpc } from "@/trpc/server";

export const prefetchAuditLogs = (page = 1) => {
  return prefetch(trpc.auditLogs.getMany.queryOptions({ page, pageSize: 10 }));
};
