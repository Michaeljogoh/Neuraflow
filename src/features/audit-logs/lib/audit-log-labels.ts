import { AuditLogAction } from "@/generated/prisma/enums";

export const AUDIT_ACTION_LABELS: Record<AuditLogAction, string> = {
  WORKFLOW_CREATED: "Created workflow",
  WORKFLOW_UPDATED: "Updated workflow",
  WORKFLOW_DELETED: "Deleted workflow",
  WORKFLOW_EXECUTED: "Executed workflow",
  WORKFLOW_TEMPLATE_USED: "Used template",
  CREDENTIAL_CREATED: "Created credential",
  CREDENTIAL_UPDATED: "Updated credential",
  CREDENTIAL_DELETED: "Deleted credential",
  SETTINGS_UPDATED: "Updated settings",
  WEBHOOK_BLOCKED: "Blocked webhook execution",
};
