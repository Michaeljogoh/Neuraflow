import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"
import { WorkflowsList, WorkflowContainer } from "@/features/workflows/components/workflows";
import { SearchParams } from "nuqs";
import { WorkflowParamsLoader } from "@/features/workflows/server/params-loader";
import { WorkflowLoading } from "@/features/workflows/components/workflows";

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
  await requireAuth();
 
  const params = await WorkflowParamsLoader(searchParams)


  prefetchWorkflows(params)

  return (
    <WorkflowContainer>
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error!</p>}>
         <Suspense fallback={<WorkflowLoading />}>
               <WorkflowsList />
         </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </WorkflowContainer>
  )
}
