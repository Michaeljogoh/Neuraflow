import { recordAuditLog } from "@/features/audit-logs/lib/record-audit-log";
import { getOrCreateUserSettings } from "@/features/settings/lib/get-or-create-settings";
import { validateWorkflowNodes } from "@/features/settings/lib/validate-workflow";
import { assertWithinMonthlyQuota } from "@/features/usage/lib/get-usage-overview";
import { createWorkflowFromTemplate } from "@/features/templates/create-from-template";
import { isValidTemplateSlug } from "@/features/templates/definitions";
import { Prisma } from "@/generated/prisma/client";
import { AuditLogAction, AuditLogStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  protectedProcedure,
  premiumProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { Node, Edge } from "@xyflow/react";
import { NodeType } from "@/generated/prisma/enums";
import { sendWorkflowExecution } from "@/inngest/utils";

export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        include: { nodes: true },
      });

      const settings = await getOrCreateUserSettings(ctx.auth.user.id);

      if (settings.runPreflightChecks || settings.requireCredentialReferences) {
        const errors = validateWorkflowNodes(
          workflow.nodes.map((node) => ({
            type: node.type,
            data: (node.data as Record<string, unknown> | null) ?? undefined,
          })),
          {
          requireCredentialReferences: settings.requireCredentialReferences,
          runPreflightChecks: settings.runPreflightChecks,
        });

        if (errors.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: errors.join(" "),
          });
        }
      }

      const quota = await assertWithinMonthlyQuota(ctx.auth.user.id);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Monthly run quota exceeded (${quota.overview.runsThisMonth}/${quota.overview.monthlyQuota}).`,
        });
      }

      await sendWorkflowExecution({
        workflowId: input.id,
      });

      await recordAuditLog({
        userId: ctx.auth.user.id,
        actorEmail: ctx.auth.user.email,
        action: AuditLogAction.WORKFLOW_EXECUTED,
        target: workflow.name,
        status: AuditLogStatus.SUCCESS,
        metadata: { workflowId: workflow.id },
      });

      return workflow;
    }),

  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflow = await prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });

    await recordAuditLog({
      userId: ctx.auth.user.id,
      actorEmail: ctx.auth.user.email,
      action: AuditLogAction.WORKFLOW_CREATED,
      target: workflow.name,
      status: AuditLogStatus.SUCCESS,
      metadata: { workflowId: workflow.id },
    });

    return workflow;
  }),

  createFromTemplate: premiumProcedure
    .input(z.object({ templateSlug: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { templateSlug } = input;

      if (!isValidTemplateSlug(templateSlug)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      const existing = await prisma.workflow.findFirst({
        where: {
          userId: ctx.auth.user.id,
          templateSlug,
        },
      });

      if (existing) {
        const workflow = await prisma.workflow.update({
          where: { id: existing.id },
          data: { updatedAt: new Date() },
        });

        await recordAuditLog({
          userId: ctx.auth.user.id,
          actorEmail: ctx.auth.user.email,
          action: AuditLogAction.WORKFLOW_TEMPLATE_USED,
          target: workflow.name,
          status: AuditLogStatus.SUCCESS,
          metadata: { workflowId: workflow.id, templateSlug, created: false },
        });

        return {
          id: workflow.id,
          name: workflow.name,
          created: false,
        };
      }

      try {
        const workflow = await prisma.$transaction((tx) =>
          createWorkflowFromTemplate(tx, ctx.auth.user.id, templateSlug),
        );

        await recordAuditLog({
          userId: ctx.auth.user.id,
          actorEmail: ctx.auth.user.email,
          action: AuditLogAction.WORKFLOW_TEMPLATE_USED,
          target: workflow.name,
          status: AuditLogStatus.SUCCESS,
          metadata: { workflowId: workflow.id, templateSlug, created: true },
        });

        return {
          id: workflow.id,
          name: workflow.name,
          created: true,
        };
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          const raced = await prisma.workflow.findFirst({
            where: {
              userId: ctx.auth.user.id,
              templateSlug,
            },
          });

          if (!raced) throw error;

          await recordAuditLog({
            userId: ctx.auth.user.id,
            actorEmail: ctx.auth.user.email,
            action: AuditLogAction.WORKFLOW_TEMPLATE_USED,
            target: raced.name,
            status: AuditLogStatus.SUCCESS,
            metadata: { workflowId: raced.id, templateSlug, created: false },
          });

          return {
            id: raced.id,
            name: raced.name,
            created: false,
          };
        }

        throw error;
      }
    }),

  getUserTemplates: protectedProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
        templateSlug: { not: null },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        templateSlug: true,
        updatedAt: true,
      },
    });
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      await recordAuditLog({
        userId: ctx.auth.user.id,
        actorEmail: ctx.auth.user.email,
        action: AuditLogAction.WORKFLOW_DELETED,
        target: workflow.name,
        status: AuditLogStatus.SUCCESS,
        metadata: { workflowId: workflow.id },
      });

      return workflow;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id, userId: ctx.auth.user.id },
      });

      const settings = await getOrCreateUserSettings(ctx.auth.user.id);

      if (settings.requireCredentialReferences) {
        const errors = validateWorkflowNodes(nodes, {
          requireCredentialReferences: true,
          runPreflightChecks: false,
        });

        if (errors.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: errors.join(" "),
          });
        }
      }

      // transaction
      return await prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({
          where: { workflowId: id },
        });
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        });

        await tx.connection.createMany({
          data: edges.map((edge) => ({
            workflowId: id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return workflow;
      }).then(async (workflow) => {
        await recordAuditLog({
          userId: ctx.auth.user.id,
          actorEmail: ctx.auth.user.email,
          action: AuditLogAction.WORKFLOW_UPDATED,
          target: workflow.name,
          status: AuditLogStatus.SUCCESS,
          metadata: { workflowId: workflow.id },
        });
        return workflow;
      }); 
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });

      await recordAuditLog({
        userId: ctx.auth.user.id,
        actorEmail: ctx.auth.user.email,
        action: AuditLogAction.WORKFLOW_UPDATED,
        target: workflow.name,
        status: AuditLogStatus.SUCCESS,
        metadata: { workflowId: workflow.id },
      });

      return workflow;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        include: { nodes: true, connections: true },
      });

      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));
      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
