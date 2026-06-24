import { createTRPCRouter } from "../init";
import { credentialsRouter } from "@/features/credentials/server/routers";
import { auditLogsRouter } from "@/features/audit-logs/server/routers";
import { executionsRouter } from "@/features/executions/server/routers";
import { settingsRouter } from "@/features/settings/server/routers";
import { usageRouter } from "@/features/usage/server/routers";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflow: workflowsRouter,
  executions: executionsRouter,
  credentials: credentialsRouter,
  settings: settingsRouter,
  usage: usageRouter,
  auditLogs: auditLogsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
