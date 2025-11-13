// import { requireAuth } from "@/lib/auth-utils";
// import { caller } from "@/trpc/server";

// export default async function Home() {
//   await requireAuth();

//   const data = await caller.getUsers();

//   return (
//     <>
//       <div className="text-red-500">Hello world</div>
//       {JSON.stringify(data)}
//     </>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export default function Home() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const queryClient = useQueryClient()
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () =>{
     toast.success("Job Queued")
    }
  }))

  return (
    <>
      <div className="text-red-500">Hello world</div>
      {JSON.stringify(data)}
      <Button disabled={create.isPending}  onClick={() => create.mutate()}  >
        Create Workflow
      </Button>
      
    </>
  );
}
