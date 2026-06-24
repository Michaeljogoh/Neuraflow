import { createUsageDigestNotification } from "@/features/settings/server/routers";
import prisma from "@/lib/db";
import { inngest } from "./client";

export const dailyUsageDigest = inngest.createFunction(
  { id: "daily-usage-digest" },
  { cron: "0 8 * * *" },
  async ({ step }) => {
    const users = await step.run("load-digest-subscribers", async () => {
      return prisma.userSettings.findMany({
        where: { dailyUsageDigest: true },
        select: { userId: true },
      });
    });

    for (const { userId } of users) {
      await step.run(`digest-${userId}`, async () => {
        await createUsageDigestNotification(userId);
      });
    }

    return { processed: users.length };
  },
);
