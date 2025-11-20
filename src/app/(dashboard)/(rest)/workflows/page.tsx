import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"
import { WorkflowsList, WorkflowContainer } from "@/features/workflows/components/workflows";



export default async function Page() {
  await requireAuth();

  prefetchWorkflow()

  return (
    <WorkflowContainer>
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error!</p>}>
         <Suspense fallback={<p>Loading...</p>} >
               <WorkflowsList />
         </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </WorkflowContainer>
  )
}
