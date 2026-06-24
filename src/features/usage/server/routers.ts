import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { getPremiumAccess } from "@/lib/polar-premium";
import { getUsageOverview } from "@/features/usage/lib/get-usage-overview";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usageRouter = createTRPCRouter({
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    return getUsageOverview(ctx.auth.user.id);
  }),
});
