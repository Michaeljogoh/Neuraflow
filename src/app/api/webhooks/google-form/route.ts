import { sendWorkflowExecution } from "@/inngest/utils";
import prisma from "@/lib/db";
import { recordAuditLog } from "@/features/audit-logs/lib/record-audit-log";
import { getOrCreateUserSettings } from "@/features/settings/lib/get-or-create-settings";
import { verifyGoogleFormWebhookSecret } from "@/features/settings/lib/webhook-verification";
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

    if (settings.blockUnsignedWebhooks) {
      const headerSecret = request.headers.get("x-neuraflow-secret");
      if (
        !verifyGoogleFormWebhookSecret(
          headerSecret,
          settings.googleFormWebhookSecret,
        )
      ) {
        await recordAuditLog({
          userId: workflow.userId,
          actorEmail: "system",
          action: AuditLogAction.WEBHOOK_BLOCKED,
          target: workflow.name,
          status: AuditLogStatus.PREVENTED,
          metadata: { workflowId, source: "google-form" },
        });

        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized webhook: missing or invalid secret",
          },
          { status: 401 },
        );
      }
    }

    const body = await request.json();

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleForm: formData,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Google form webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Google Form submission" },
      { status: 500 },
    );
  }
}
