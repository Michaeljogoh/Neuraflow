"use client";

import Link from "next/link";
import {
  BookTemplateIcon,
  Clock3Icon,
  Loader2Icon,
  SparklesIcon,
  WebhookIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import { ColoredBadge } from "@/components/colored-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TEMPLATE_LIST, type TemplateSlug } from "@/features/templates/definitions";
import {
  useCreateFromTemplate,
  useUserTemplates,
} from "@/features/templates/hooks/use-template";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const TEMPLATE_ICONS: Record<TemplateSlug, LucideIcon> = {
  "lead-capture-slack": WebhookIcon,
  "support-triage-ai": SparklesIcon,
  "payment-success-workflow": ZapIcon,
};

export function TemplatesView() {
  const { mutation, modal } = useCreateFromTemplate();
  const userTemplates = useUserTemplates();

  const handleUseTemplate = (templateSlug: TemplateSlug) => {
    if (mutation.isPending) return;
    mutation.mutate({ templateSlug });
  };

  return (
    <>
      {modal}
      <div className="w-full flex flex-col gap-6 p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
            <p className="text-sm text-muted-foreground">
              Start quickly with pre-built workflow blueprints.
            </p>
          </div>
          <Button asChild>
            <Link href="/workflows">Create from scratch</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TEMPLATE_LIST.map((template) => {
            const Icon = TEMPLATE_ICONS[template.slug];
            const isLoading =
              mutation.isPending &&
              mutation.variables?.templateSlug === template.slug;

            return (
              <Card
                key={template.slug}
                className="flex h-full flex-col gap-0 border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <CardHeader className="flex flex-1 flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <ColoredBadge colorKey={template.category}>
                      {template.category}
                    </ColoredBadge>
                  </div>
                  <CardTitle className="line-clamp-2 text-base">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 min-h-10">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4">
                  <Button
                    className="w-full"
                    disabled={mutation.isPending}
                    onClick={() => handleUseTemplate(template.slug)}
                  >
                    {isLoading ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <BookTemplateIcon className="size-4" />
                    )}
                    Use template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Recently used templates</CardTitle>
              <CardDescription>Workflows created from your templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {userTemplates.isLoading && (
                <p className="text-muted-foreground">Loading recent templates...</p>
              )}
              {!userTemplates.isLoading && userTemplates.data?.length === 0 && (
                <p className="text-muted-foreground">
                  No templates used yet. Pick one above to get started.
                </p>
              )}
              {userTemplates.data?.map((workflow) => (
                <button
                  key={workflow.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-primary/5",
                    mutation.isPending && "pointer-events-none opacity-60",
                  )}
                  onClick={() => {
                    if (workflow.templateSlug) {
                      handleUseTemplate(workflow.templateSlug as TemplateSlug);
                    }
                  }}
                >
                  <span>{workflow.name}</span>
                  <ColoredBadge colorKey="recent">
                    <Clock3Icon className="size-3" />
                    {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}
                  </ColoredBadge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Template tips</CardTitle>
              <CardDescription>Best practices before launching a template.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Connect real credentials before first run.</p>
              <p>• Use test payloads to validate branch logic.</p>
              <p>• Each template creates one workflow per account — reusing opens the same workflow.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
