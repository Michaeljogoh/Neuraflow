import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useWorkflowParams } from "./use-workflow-params";




// Hook to fetch all workflows 
export const useSuspenseWorkflows = () =>{
    const trpc = useTRPC();
     const [params] = useWorkflowParams();
 

    return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
}


// Hook to create new workflow 
export const useCreateWorkflow = () =>{
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(trpc.workflow.create.mutationOptions({
        onSuccess: (data)=>{
            toast.success(`Workflow ${data.name} created`);
            queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}))
        },
        onError: (error)=>{
            toast.error(`Failed to create workflow: ${error.message}`)
        }
    }))
}


