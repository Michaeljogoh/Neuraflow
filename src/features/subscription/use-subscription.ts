import { useQuery } from "@tanstack/react-query";

type PremiumStatus = {
  hasAccess: boolean;
  activeSubscriptions: unknown[];
};

async function fetchPremiumStatus(): Promise<PremiumStatus> {
  const response = await fetch("/api/polar/premium-status", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load subscription status");
  }

  return response.json();
}

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: fetchPremiumStatus,
    retry: 1,
  });
};

export const useHasActiveSubscription = () => {
  const { data, isLoading, ...rest } = useSubscription();

  return {
    hasSubscription: data?.hasAccess ?? false,
    subscription: data?.activeSubscriptions?.[0] ?? null,
    isLoading,
    ...rest,
  };
};
