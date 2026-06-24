"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function PremiumStatusRefresher() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams.has("customer_session_token")) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["subscription"] });
    router.replace("/workflows");
  }, [queryClient, router, searchParams]);

  return null;
}
