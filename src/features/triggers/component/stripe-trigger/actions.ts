"use server";

import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchStripeTriggerRealtimeToken() {
  return fetchSubscriptionToken(stripeTriggerChannel(), ["status"]);
}
