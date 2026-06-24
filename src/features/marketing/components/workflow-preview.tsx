"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Bot,
  Globe,
  Play,
  Sparkles,
  Webhook,
  Zap,
} from "lucide-react";
import { easeOut } from "@/features/marketing/lib/motion";
import { cn } from "@/lib/utils";

const nodes = [
  {
    id: "trigger",
    label: "Stripe Trigger",
    icon: Webhook,
    x: "8%",
    y: "28%",
    accent: "bg-chart-2/15 text-chart-2 border-chart-2/25",
  },
  {
    id: "ai",
    label: "OpenAI",
    icon: Sparkles,
    x: "38%",
    y: "18%",
    accent: "bg-primary/10 text-primary border-primary/25",
  },
  {
    id: "http",
    label: "HTTP Request",
    icon: Globe,
    x: "68%",
    y: "32%",
    accent: "bg-chart-1/15 text-chart-1 border-chart-1/25",
  },
  {
    id: "slack",
    label: "Slack",
    icon: Bot,
    x: "52%",
    y: "62%",
    accent: "bg-chart-3/15 text-chart-3 border-chart-3/25",
  },
];

export function WorkflowPreview({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card shadow-xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-chart-2/70" />
          <span className="size-2.5 rounded-full bg-primary/70" />
        </div>
        <span className="ml-2 text-xs font-medium text-muted-foreground">
          onboarding-flow.neuraflow
        </span>
        <div className="ml-auto flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground">
          <Play className="size-3" />
          Execute
        </div>
      </div>

      <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:20px_20px]">
        <svg
          className="absolute inset-0 size-full"
          aria-hidden="true"
          viewBox="0 0 800 500"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 120 180 C 220 180, 260 120, 340 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
            initial={prefersReducedMotion ? undefined : { pathLength: 0, opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: easeOut }}
          />
          <motion.path
            d="M 420 120 C 500 120, 540 180, 600 180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
            initial={prefersReducedMotion ? undefined : { pathLength: 0, opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: easeOut }}
          />
          <motion.path
            d="M 480 180 C 500 260, 480 300, 460 340"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
            initial={prefersReducedMotion ? undefined : { pathLength: 0, opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: easeOut }}
          />
        </svg>

        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              className={cn(
                "absolute flex min-w-[120px] items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm",
                node.accent,
              )}
              style={{ left: node.x, top: node.y }}
              initial={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, y: 12, scale: 0.95 }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{
                duration: 0.45,
                delay: 0.2 + index * 0.12,
                ease: easeOut,
              }}
            >
              <Icon className="size-4 shrink-0" />
              <span className="text-xs font-medium">{node.label}</span>
            </motion.div>
          );
        })}

        <motion.div
          className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-border bg-background/90 px-3 py-2 text-xs backdrop-blur-sm"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4, ease: easeOut }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="text-muted-foreground">Live execution</span>
          <span className="font-medium text-foreground">2.4s</span>
        </motion.div>

        <motion.div
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.35, ease: easeOut }}
        >
          <Zap className="size-3.5" />
          4 nodes connected
        </motion.div>
      </div>
    </div>
  );
}

const integrationLogos = [
  {
    src: "/logos/openai.svg",
    alt: "OpenAI",
    bg: "bg-[#10a37f]/10 border-[#10a37f]/20",
  },
  {
    src: "/logos/anthropic.svg",
    alt: "Anthropic",
    bg: "bg-[#d97757]/10 border-[#d97757]/20",
  },
  {
    src: "/logos/gemini.svg",
    alt: "Google Gemini",
    bg: "bg-[#4285f4]/10 border-[#4285f4]/20",
  },
  {
    src: "/logos/stripe.svg",
    alt: "Stripe",
    bg: "bg-[#635bff]/10 border-[#635bff]/20",
  },
  {
    src: "/logos/slack.svg",
    alt: "Slack",
    bg: "bg-[#4a154b]/10 border-[#4a154b]/20",
  },
  {
    src: "/logos/discord.svg",
    alt: "Discord",
    bg: "bg-[#5865f2]/10 border-[#5865f2]/20",
  },
  {
    src: "/logos/googleform.svg",
    alt: "Google Forms",
    bg: "bg-[#7248b9]/10 border-[#7248b9]/20",
  },
];

export function IntegrationMarquee() {
  const prefersReducedMotion = useReducedMotion();
  const items = [...integrationLogos, ...integrationLogos];

  return (
    <div className="relative overflow-hidden border-y border-border bg-muted/20 py-10">
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Trusted by builders automating with industry-leading tools
      </p>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex w-max items-center gap-8 px-8"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
        }
      >
        {items.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className={cn(
              "flex h-14 w-36 shrink-0 items-center justify-center rounded-xl border px-4 transition-transform hover:scale-105",
              logo.bg,
            )}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={96}
              height={32}
              className="h-8 w-auto object-contain opacity-90"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
