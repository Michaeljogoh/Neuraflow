import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Per-label tint classes for dashboard badges (bg + border + text). */
export const badgeColorMap: Record<string, string> = {
  // Integrations (settings)
  Stripe: "border-[#635bff]/35 bg-[#635bff]/12 text-[#635bff]",
  "Google Forms": "border-[#7248b9]/35 bg-[#7248b9]/12 text-[#7248b9]",
  OpenAI: "border-[#10a37f]/35 bg-[#10a37f]/12 text-[#10a37f]",
  Slack: "border-[#4a154b]/35 bg-[#4a154b]/12 text-[#4a154b]",
  Anthropic: "border-[#d97757]/35 bg-[#d97757]/12 text-[#d97757]",
  Discord: "border-[#5865f2]/35 bg-[#5865f2]/12 text-[#5865f2]",
  Gemini: "border-[#4285f4]/35 bg-[#4285f4]/12 text-[#4285f4]",

  // Template categories
  Sales: "border-sky-500/35 bg-sky-500/12 text-sky-700",
  Support: "border-violet-500/35 bg-violet-500/12 text-violet-700",
  Finance: "border-amber-500/35 bg-amber-500/12 text-amber-700",

  // Profile & roles
  "Active member": "border-emerald-500/35 bg-emerald-500/12 text-emerald-700",
  Member: "border-blue-500/35 bg-blue-500/12 text-blue-700",

  // Usage capabilities
  "Template library": "border-violet-500/35 bg-violet-500/12 text-violet-700",
  "Execution history": "border-cyan-500/35 bg-cyan-500/12 text-cyan-700",
  "Audit-friendly metadata":
    "border-amber-500/35 bg-amber-500/12 text-amber-700",
  "AI nodes": "border-[#10a37f]/35 bg-[#10a37f]/12 text-[#10a37f]",

  // Plans
  "Pro plan": "border-primary/35 bg-primary/12 text-primary",
  "Free plan":
    "border-muted-foreground/25 bg-muted text-muted-foreground",

  // Audit status
  Success: "border-emerald-500/35 bg-emerald-500/12 text-emerald-700",
  Prevented: "border-amber-500/35 bg-amber-500/12 text-amber-700",
  Failed: "border-red-500/35 bg-red-500/12 text-red-700",

  // Template recency
  recent: "border-slate-500/30 bg-slate-500/10 text-slate-600",
};

type ColoredBadgeProps = React.ComponentProps<typeof Badge> & {
  /** Lookup key in `badgeColorMap`. Defaults to children if string. */
  colorKey?: string;
};

export function ColoredBadge({
  colorKey,
  className,
  children,
  ...props
}: ColoredBadgeProps) {
  const key =
    colorKey ??
    (typeof children === "string" ? children : undefined) ??
    "";
  const colorClass =
    badgeColorMap[key] ??
    "border-border/70 bg-muted/40 text-foreground";

  return (
    <Badge variant="outline" className={cn(colorClass, className)} {...props}>
      {children}
    </Badge>
  );
}
