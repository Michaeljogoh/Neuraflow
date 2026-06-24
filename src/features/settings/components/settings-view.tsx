"use client";

import Link from "next/link";
import { BellIcon, Loader2Icon, ShieldIcon, WebhookIcon } from "lucide-react";
import { ColoredBadge } from "@/components/colored-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { IntegrationKey } from "@/features/settings/lib/integration-status";
import {
  useRegenerateGoogleFormSecret,
  useSuspenseSettings,
  useUpdateSettings,
} from "@/features/settings/hooks/use-settings";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const INTEGRATION_BADGE_KEYS: Record<IntegrationKey, string> = {
  openai: "OpenAI",
  stripe: "Stripe",
  googleForms: "Google Forms",
  slack: "Slack",
};

export function SettingsView() {
  const { data } = useSuspenseSettings();
  const updateSettings = useUpdateSettings();
  const regenerateSecret = useRegenerateGoogleFormSecret();
  const { settings, integrations } = data;

  const [stripeSecret, setStripeSecret] = useState(
    settings.stripeWebhookSecret ?? "",
  );

  useEffect(() => {
    setStripeSecret(settings.stripeWebhookSecret ?? "");
  }, [settings.stripeWebhookSecret]);

  const saveToggle = (
    field: keyof typeof settings,
    value: boolean,
  ) => {
    updateSettings.mutate({ [field]: value });
  };

  const saveStripeSecret = () => {
    updateSettings.mutate({
      stripeWebhookSecret: stripeSecret.trim() || null,
    });
  };

  return (
    <div className="w-full p-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Workspace preferences saved to your account and enforced on runs.
      </p>

      <div className="grid gap-4">
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Security defaults</CardTitle>
            </div>
            <CardDescription>Enforced when saving and executing workflows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              label="Require credential references"
              helper="AI nodes must use stored credentials — no inline API keys."
              checked={settings.requireCredentialReferences}
              disabled={updateSettings.isPending}
              onCheckedChange={(checked) =>
                saveToggle("requireCredentialReferences", checked)
              }
            />
            <SettingRow
              label="Block unsigned webhook executions"
              helper="Reject Google Form and Stripe webhooks without valid secrets."
              checked={settings.blockUnsignedWebhooks}
              disabled={updateSettings.isPending}
              onCheckedChange={(checked) =>
                saveToggle("blockUnsignedWebhooks", checked)
              }
            />
            {settings.blockUnsignedWebhooks && (
              <div className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3">
                <div className="space-y-2">
                  <Label htmlFor="google-form-secret">Google Form webhook secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="google-form-secret"
                      readOnly
                      value={settings.googleFormWebhookSecret ?? ""}
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={regenerateSecret.isPending}
                      onClick={() => regenerateSecret.mutate()}
                    >
                      {regenerateSecret.isPending ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        "Regenerate"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Included automatically when you copy the Google Apps Script from a
                    Form trigger node.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Stripe signing secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="stripe-secret"
                      type="password"
                      placeholder="whsec_..."
                      value={stripeSecret}
                      onChange={(e) => setStripeSecret(e.target.value)}
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={updateSettings.isPending}
                      onClick={saveStripeSecret}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste the signing secret from your Stripe webhook endpoint.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BellIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>Alerts appear in the header bell icon.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              label="Execution failure alerts"
              helper="Notify when a workflow run fails."
              checked={settings.executionFailureAlerts}
              disabled={updateSettings.isPending}
              onCheckedChange={(checked) =>
                saveToggle("executionFailureAlerts", checked)
              }
            />
            <SettingRow
              label="Daily usage digest"
              helper="Morning summary of successful and failed runs."
              checked={settings.dailyUsageDigest}
              disabled={updateSettings.isPending}
              onCheckedChange={(checked) =>
                saveToggle("dailyUsageDigest", checked)
              }
            />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <WebhookIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Integrations</CardTitle>
            </div>
            <CardDescription>Live status from your credentials and workflows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {integration.connected ? (
                      <ColoredBadge colorKey={INTEGRATION_BADGE_KEYS[integration.key]}>
                        {integration.label}
                      </ColoredBadge>
                    ) : (
                      <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                        {integration.label}
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        integration.connected
                          ? "text-emerald-600"
                          : "text-muted-foreground",
                      )}
                    >
                      {integration.connected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {integration.detail}
                  </p>
                </div>
                {!integration.connected && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={integration.key === "openai" ? "/credentials" : "/workflows"}>
                      Set up
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Environment controls</CardTitle>
            <CardDescription>Safer destructive actions in the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow
              label="Require manual confirmation for destructive actions"
              helper="Adds a confirm step before deleting workflows or credentials."
              checked={settings.requireConfirmDestructive}
              disabled={updateSettings.isPending}
              onCheckedChange={(checked) =>
                saveToggle("requireConfirmDestructive", checked)
              }
            />
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Automation quality</CardTitle>
            <CardDescription>Validation before workflow execution.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow
              label="Run preflight checks before execute"
              helper="Validate node config and credentials before each run."
              checked={settings.runPreflightChecks}
              disabled={updateSettings.isPending}
              onCheckedChange={(checked) =>
                saveToggle("runPreflightChecks", checked)
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  helper,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string;
  helper: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-background/80 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{helper}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
