import { NotificationType } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import { getOrCreateUserSettings } from "./get-or-create-settings";

export async function createExecutionFailureNotification({
  userId,
  workflowId,
  workflowName,
  errorMessage,
}: {
  userId: string;
  workflowId: string;
  workflowName: string;
  errorMessage: string;
}) {
  const settings = await getOrCreateUserSettings(userId);
  if (!settings.executionFailureAlerts) return;

  await prisma.userNotification.create({
    data: {
      userId,
      type: NotificationType.EXECUTION_FAILED,
      title: `Workflow "${workflowName}" failed`,
      message: errorMessage,
      metadata: { workflowId },
    },
  });
}
