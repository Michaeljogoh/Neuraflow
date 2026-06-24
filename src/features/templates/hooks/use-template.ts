import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

export const useCreateFromTemplate = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { handleError, modal } = useUpgradeModal();

  const mutation = useMutation(
    trpc.workflow.createFromTemplate.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          data.created
            ? `Created workflow "${data.name}"`
            : `Opened workflow "${data.name}"`,
        );
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
        queryClient.invalidateQueries(trpc.workflow.getUserTemplates.queryOptions());
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        if (!handleError(error)) {
          toast.error(`Failed to use template: ${error.message}`);
        }
      },
    }),
  );

  return { mutation, modal };
};

export const useUserTemplates = () => {
  const trpc = useTRPC();
  return useQuery(trpc.workflow.getUserTemplates.queryOptions());
};
