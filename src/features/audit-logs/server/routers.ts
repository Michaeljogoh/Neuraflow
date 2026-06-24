import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { getPremiumAccess } from "@/lib/polar-premium";
import { USAGE_LIMITS } from "@/config/constants";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

function getRetentionCutoff(hasSubscription: boolean) {
  const days = hasSubscription
    ? USAGE_LIMITS.PRO_AUDIT_RETENTION_DAYS
    : USAGE_LIMITS.FREE_AUDIT_RETENTION_DAYS;
  return {
    days,
    cutoff: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
  };
}

export const auditLogsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { hasAccess } = await getPremiumAccess(ctx.auth.user.id);
      const { days, cutoff } = getRetentionCutoff(hasAccess);
      const { page, pageSize } = input;

      const where = {
        userId: ctx.auth.user.id,
        createdAt: { gte: cutoff },
      };

      const [items, totalCount] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.auditLog.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        retentionDays: days,
      };
    }),
});
