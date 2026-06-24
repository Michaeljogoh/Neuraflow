import {
  AuditLogAction,
  AuditLogStatus,
} from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db";

export async function recordAuditLog({
  userId,
  actorEmail,
  action,
  target,
  status,
  metadata,
}: {
  userId: string;
  actorEmail: string;
  action: AuditLogAction;
  target: string;
  status: AuditLogStatus;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      userId,
      actorEmail,
      action,
      target,
      status,
      metadata: (metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}

