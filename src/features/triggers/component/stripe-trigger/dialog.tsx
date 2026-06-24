"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3009";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Stripe Trigger Configuration</SheetTitle>
          <SheetDescription>
            Configure this webhook URL in your Stripe Dashboard to trigger this
            workflow on payment events.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers → Webhooks</li>
              <li>Click &quot;Add endpoint&quot;</li>
              <li>Paste the webhook URL above</li>
              <li>
                Select events to listen for (e.g., payment_intent.succeeded)
              </li>
              <li>Save and copy the signing secret into Settings</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>{" "}
                - Event type (e.g., payment_intent.succeeded)
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>{" "}
                - Full event data as JSON
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe.raw}}"}
                </code>{" "}
                - Stripe event object
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
