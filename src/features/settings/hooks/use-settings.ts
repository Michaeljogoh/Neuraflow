import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useSuspenseSettings = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.settings.get.queryOptions());
};

export const useSettings = () => {
  const trpc = useTRPC();
  return useQuery(trpc.settings.get.queryOptions());
};

export const useUpdateSettings = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.settings.update.mutationOptions({
      onSuccess: () => {
        toast.success("Settings saved");
        queryClient.invalidateQueries(trpc.settings.get.queryOptions());
      },
      onError: (error) => {
        toast.error(`Failed to save settings: ${error.message}`);
      },
    }),
  );
};

export const useRegenerateGoogleFormSecret = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.settings.regenerateGoogleFormSecret.mutationOptions({
      onSuccess: () => {
        toast.success("Google Form webhook secret regenerated");
        queryClient.invalidateQueries(trpc.settings.get.queryOptions());
        queryClient.invalidateQueries(
          trpc.settings.getWebhookSecrets.queryOptions(),
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

export const useNotifications = () => {
  const trpc = useTRPC();
  return useQuery(trpc.settings.getNotifications.queryOptions({}));
};

export const useMarkNotificationsRead = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.settings.markNotificationsRead.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.settings.getNotifications.queryOptions({}),
        );
      },
    }),
  );
};

export const useWebhookSecrets = () => {
  const trpc = useTRPC();
  return useQuery(trpc.settings.getWebhookSecrets.queryOptions());
};
