"use server";

import { openAiChannel } from "@/inngest/channels/openai";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchOpenAiRealtimeToken() {
  return fetchSubscriptionToken(openAiChannel(), ["status"]);
}
