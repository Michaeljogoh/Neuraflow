"use server";

import { slackChannel } from "@/inngest/channels/slack";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchSlackRealtimeToken() {
  return fetchSubscriptionToken(slackChannel(), ["status"]);
}
