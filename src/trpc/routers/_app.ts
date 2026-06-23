import { createTRPCRouter } from "../init";
import { executionsRouter } from "@/features/executions/server/routers";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflow: workflowsRouter,
  executions: executionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
