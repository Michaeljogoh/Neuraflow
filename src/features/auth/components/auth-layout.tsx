"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Sparkles, Workflow, Zap } from "lucide-react";
import { easeOut } from "@/features/marketing/lib/motion";

const panelContent = {
  "/login": {
    eyebrow: "Welcome back",
    title: "Pick up where your workflows left off",
    description:
      "Sign in to access your canvas, executions, and credentials — everything in one place.",
    highlights: [
      "Visual workflow editor",
      "Real-time execution status",
      "Encrypted credential vault",
    ],
  },
  "/register": {
    eyebrow: "Get started",
    title: "Build automations in minutes, not days",
    description:
      "Create your free account and design your first flow with triggers, AI nodes, and integrations.",
    highlights: [
      "Free plan to explore",
      "No infrastructure setup",
      "Upgrade to Pro anytime",
    ],
  },
} as const;

const featureIcons = [Workflow, Sparkles, Zap];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const content =
    panelContent[pathname as keyof typeof panelContent] ?? panelContent["/login"];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const lockScroll = () => {
      document.body.style.overflow = media.matches ? "hidden" : "";
    };
    lockScroll();
    media.addEventListener("change", lockScroll);
    return () => {
      document.body.style.overflow = "";
      media.removeEventListener("change", lockScroll);
    };
  }, []);

  return (
    <div className="grid min-h-svh lg:h-svh lg:max-h-svh lg:overflow-hidden lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border bg-muted/30 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,oklch(0.6397_0.172_36.4421/0.14),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        />

        <div className="relative flex flex-col gap-10 p-10 xl:p-14">
          <Link href="/" className="inline-flex w-fit items-center gap-2">
            <Image
              src="/logos/logo.svg"
              width={78}
              height={32}
              alt="Neuraflow"
              className="h-[30px] w-auto"
              priority
            />
          </Link>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="max-w-md"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {content.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance xl:text-4xl">
              {content.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {content.description}
            </p>

            <ul className="mt-8 space-y-3">
              {content.highlights.map((item, i) => {
                const Icon = featureIcons[i] ?? CheckCircle2;
                return (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        <div className="relative p-10 xl:p-14">
          <blockquote className="max-w-sm rounded-2xl border border-border bg-background/80 p-5 text-sm leading-relaxed backdrop-blur-sm">
            <p className="text-muted-foreground">
              &ldquo;Neuraflow replaced our brittle webhook scripts with one
              visual system we can actually maintain.&rdquo;
            </p>
            <footer className="mt-3 font-medium text-foreground">
              — Platform team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex min-h-0 flex-col lg:h-full lg:overflow-hidden">
        <div className="flex items-center px-6 pt-6 sm:px-10 lg:hidden">
          <Link href="/" className="inline-flex w-fit items-center">
            <Image
              src="/logos/logo.svg"
              width={78}
              height={32}
              alt="Neuraflow"
              className="h-[26px] w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 lg:overflow-hidden lg:py-6">
          <motion.div
            className="w-full max-w-[420px]"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: easeOut }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
