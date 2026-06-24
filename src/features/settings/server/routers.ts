import { createId } from "@paralleldrive/cuid2";
import { recordAuditLog } from "@/features/audit-logs/lib/record-audit-log";
import { NotificationType } from "@/generated/prisma/enums";
import { AuditLogAction, AuditLogStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { getOrCreateUserSettings } from "../lib/get-or-create-settings";
import { getIntegrationStatus } from "../lib/integration-status";

const settingsUpdateSchema = z.object({
  requireCredentialReferences: z.boolean().optional(),
  blockUnsignedWebhooks: z.boolean().optional(),
  executionFailureAlerts: z.boolean().optional(),
  dailyUsageDigest: z.boolean().optional(),
  requireConfirmDestructive: z.boolean().optional(),
  runPreflightChecks: z.boolean().optional(),
  stripeWebhookSecret: z.string().nullable().optional(),
});

export const settingsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const settings = await getOrCreateUserSettings(ctx.auth.user.id);
    const integrations = await getIntegrationStatus(ctx.auth.user.id);

    return { settings, integrations };
  }),

  update: protectedProcedure
    .input(settingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await getOrCreateUserSettings(ctx.auth.user.id);

      const settings = await prisma.userSettings.update({
        where: { userId: ctx.auth.user.id },
        data: input,
      });

      await recordAuditLog({
        userId: ctx.auth.user.id,
        actorEmail: ctx.auth.user.email,
        action: AuditLogAction.SETTINGS_UPDATED,
        target: "Workspace settings",
        status: AuditLogStatus.SUCCESS,
        metadata: { fields: Object.keys(input) },
      });

      return settings;
    }),

  regenerateGoogleFormSecret: protectedProcedure.mutation(async ({ ctx }) => {
    await getOrCreateUserSettings(ctx.auth.user.id);

    return prisma.userSettings.update({
      where: { userId: ctx.auth.user.id },
      data: { googleFormWebhookSecret: createId() },
      select: { googleFormWebhookSecret: true },
    });
  }),

  getNotifications: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;

      const [items, unreadCount] = await Promise.all([
        prisma.userNotification.findMany({
          where: { userId: ctx.auth.user.id },
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
        prisma.userNotification.count({
          where: { userId: ctx.auth.user.id, read: false },
        }),
      ]);

      return { items, unreadCount };
    }),

  markNotificationsRead: protectedProcedure
    .input(z.object({ ids: z.array(z.string()).optional() }).optional())
    .mutation(async ({ ctx, input }) => {
      if (input?.ids?.length) {
        await prisma.userNotification.updateMany({
          where: {
            userId: ctx.auth.user.id,
            id: { in: input.ids },
          },
          data: { read: true },
        });
      } else {
        await prisma.userNotification.updateMany({
          where: { userId: ctx.auth.user.id, read: false },
          data: { read: true },
        });
      }

      return { success: true };
    }),

  getWebhookSecrets: protectedProcedure.query(async ({ ctx }) => {
    const settings = await getOrCreateUserSettings(ctx.auth.user.id);
    return {
      googleFormWebhookSecret: settings.googleFormWebhookSecret,
      stripeWebhookSecret: settings.stripeWebhookSecret,
      blockUnsignedWebhooks: settings.blockUnsignedWebhooks,
    };
  }),
});

export async function createUsageDigestNotification(userId: string) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [successCount, failedCount] = await Promise.all([
    prisma.execution.count({
      where: {
        workflow: { userId },
        status: "SUCCESS",
        startedAt: { gte: since },
      },
    }),
    prisma.execution.count({
      where: {
        workflow: { userId },
        status: "FAILED",
        startedAt: { gte: since },
      },
    }),
  ]);

  await prisma.userNotification.create({
    data: {
      userId,
      type: NotificationType.USAGE_DIGEST,
      title: "Daily usage summary",
      message: `${successCount} successful and ${failedCount} failed workflow runs in the last 24 hours.`,
      metadata: { successCount, failedCount },
    },
  });
}
