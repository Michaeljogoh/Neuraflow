"use server";

import { discordChannel } from "@/inngest/channels/discord";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchDiscordRealtimeToken() {
  return fetchSubscriptionToken(discordChannel(), ["status"]);
}
