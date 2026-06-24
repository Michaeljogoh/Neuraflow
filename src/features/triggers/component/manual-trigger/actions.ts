"use server";

import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchManualTriggerRealtimeToken() {
  return fetchSubscriptionToken(manualTriggerChannel(), ["status"]);
}
