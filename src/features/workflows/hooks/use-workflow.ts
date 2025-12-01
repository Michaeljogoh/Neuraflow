import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useWorkflowParams } from "./use-workflow-params";

// Hook to fetch all workflows
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowParams();

  return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
};

// Hook to create new workflow
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created`);
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    })
  );
};

// Hook to remove a workflow
export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflow.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" deleted`);
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflow.getOne.queryFilter({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to delete workflow: ${error.message}`);
      },
    })
  );
};



// Hook to fetch single workflows
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflow.getOne.queryOptions({ id  }));
};


// Hook to update a workflow name
export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflow.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} updated`);
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
        queryClient.invalidateQueries(trpc.workflow.getOne.queryOptions({ id : data.id }))
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    })
  );
};