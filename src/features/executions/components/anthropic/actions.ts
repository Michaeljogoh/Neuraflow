"use server";

import { anthropicChannel } from "@/inngest/channels/anthropic";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchAnthropicRealtimeToken() {
  return fetchSubscriptionToken(anthropicChannel(), ["status"]);
}
