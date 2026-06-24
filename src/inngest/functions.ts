import { getExecutor } from "@/features/executions/lib/executor-registry";
import { createExecutionFailureNotification } from "@/features/settings/lib/create-execution-failure-notification";
import { recordAuditLog } from "@/features/audit-logs/lib/record-audit-log";
import { ExecutionStatus, NodeType, AuditLogAction, AuditLogStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import { NonRetriableError } from "inngest";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { geminiChannel } from "./channels/gemini";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { openAiChannel } from "./channels/openai";
import { slackChannel } from "./channels/slack";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({ event, error }) => {
      const inngestEventId = event.data.event.id;
      const workflowId = event.data.event?.data?.workflowId as
        | string
        | undefined;

      await prisma.execution.update({
        where: { inngestEventId },
        data: {
          status: ExecutionStatus.FAILED,
          error: error.message,
          errorStack: error.stack,
        },
      });

      if (workflowId) {
        const workflow = await prisma.workflow.findUnique({
          where: { id: workflowId },
          select: { id: true, name: true, userId: true },
        });

        if (workflow) {
          await createExecutionFailureNotification({
            userId: workflow.userId,
            workflowId: workflow.id,
            workflowName: workflow.name,
            errorMessage: error.message,
          });

          await recordAuditLog({
            userId: workflow.userId,
            actorEmail: "system",
            action: AuditLogAction.WORKFLOW_EXECUTED,
            target: workflow.name,
            status: AuditLogStatus.FAILED,
            metadata: { workflowId: workflow.id, error: error.message },
          });
        }
      }
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      openAiChannel(),
      geminiChannel(),
      anthropicChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      discordChannel(),
      slackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });

      return workflow.userId;
    });

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return {
      workflowId,
      result: context,
    };
  },
);
