"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseAuditLogs = (page: number) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.auditLogs.getMany.queryOptions({ page, pageSize: 10 }),
  );
};

export const useAuditLogsPage = () => {
  const [page, setPage] = useState(1);
  const query = useSuspenseAuditLogs(page);
  return { page, setPage, ...query };
};
