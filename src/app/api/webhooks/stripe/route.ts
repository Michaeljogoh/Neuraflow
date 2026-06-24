import { sendWorkflowExecution } from "@/inngest/utils";
import prisma from "@/lib/db";
import { recordAuditLog } from "@/features/audit-logs/lib/record-audit-log";
import { getOrCreateUserSettings } from "@/features/settings/lib/get-or-create-settings";
import { verifyStripeWebhookSignature } from "@/features/settings/lib/webhook-verification";
import { AuditLogAction, AuditLogStatus } from "@/generated/prisma/enums";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 },
      );
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { userId: true, name: true },
    });

    if (!workflow) {
      return NextResponse.json(
        { success: false, error: "Workflow not found" },
        { status: 404 },
      );
    }

    const settings = await getOrCreateUserSettings(workflow.userId);
    const rawBody = await request.text();

    if (settings.blockUnsignedWebhooks) {
      const signature = request.headers.get("stripe-signature");
      if (
        !verifyStripeWebhookSignature(
          rawBody,
          signature,
          settings.stripeWebhookSecret,
        )
      ) {
        await recordAuditLog({
          userId: workflow.userId,
          actorEmail: "system",
          action: AuditLogAction.WEBHOOK_BLOCKED,
          target: workflow.name,
          status: AuditLogStatus.PREVENTED,
          metadata: { workflowId, source: "stripe" },
        });

        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized webhook: invalid Stripe signature",
          },
          { status: 401 },
        );
      }
    }

    const body = JSON.parse(rawBody) as {
      id?: string;
      type?: string;
      created?: number;
      livemode?: boolean;
      data?: { object?: unknown };
    };

    const stripeData = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Stripe event" },
      { status: 500 },
    );
  }
}
