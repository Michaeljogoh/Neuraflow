"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  KeyRound,
  Lock,
  Play,
  Shield,
  Sparkles,
  Timer,
  Webhook,
  Workflow,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MotionSection } from "@/features/marketing/components/motion-section";
import { LandingHeader } from "@/features/marketing/components/landing-header";
import { PricingSection } from "@/features/marketing/components/pricing-section";
import {
  IntegrationMarquee,
  WorkflowPreview,
} from "@/features/marketing/components/workflow-preview";
import {
  easeOut,
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportOnce,
} from "@/features/marketing/lib/motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Workflow,
    title: "Visual workflow editor",
    description:
      "Drag, connect, and configure nodes on a canvas. Build complex automations without writing boilerplate orchestration code.",
    tag: "Editor",
  },
  {
    icon: Webhook,
    title: "Event-driven triggers",
    description:
      "Kick off flows from Stripe webhooks, Google Form submissions, or manual runs — with full context passed to every step.",
    tag: "Triggers",
  },
  {
    icon: Sparkles,
    title: "AI-native execution",
    description:
      "Route data through OpenAI, Anthropic, and Gemini nodes. Chain LLM calls with HTTP requests and messaging actions.",
    tag: "AI",
  },
  {
    icon: Timer,
    title: "Durable executions",
    description:
      "Inngest-backed runs survive retries, long waits, and failures. Watch node status update in real time as flows execute.",
    tag: "Executions",
  },
  {
    icon: KeyRound,
    title: "Encrypted credentials",
    description:
      "Store API keys and tokens securely. Reference credentials from any node without exposing secrets in workflow definitions.",
    tag: "Credentials",
  },
  {
    icon: Bot,
    title: "Messaging & integrations",
    description:
      "Post to Slack, Discord, or any HTTP endpoint. Connect the tools your team already uses into one orchestrated flow.",
    tag: "Integrations",
  },
];

const stats = [
  { value: "10+", label: "Node types built-in" },
  { value: "Real-time", label: "Execution visibility" },
  { value: "99.9%", label: "Durable run reliability" },
];

const securityItems = [
  "AES-encrypted credential storage",
  "Session-based auth with Better Auth",
  "Role-scoped workflow access per user",
  "Full execution audit trail",
];

const faqs = [
  {
    q: "What is Neuraflow?",
    a: "Neuraflow is a visual workflow automation platform. You design flows on a canvas, connect triggers to actions, and Neuraflow handles durable execution in the background.",
  },
  {
    q: "Do I need to write code to build workflows?",
    a: "No. Most workflows are built entirely in the visual editor. Configure triggers, AI nodes, HTTP requests, and messaging steps through node dialogs — no deployment pipeline required.",
  },
  {
    q: "Which integrations are supported?",
    a: "Neuraflow ships with OpenAI, Anthropic, Gemini, Stripe, Google Forms, Slack, Discord, and generic HTTP request nodes. More connectors are added regularly.",
  },
  {
    q: "How does execution work under the hood?",
    a: "Workflows run on Inngest, giving you retries, step isolation, and long-running durability. The editor streams live node status so you always know where a run stands.",
  },
  {
    q: "Is Neuraflow a replacement for Zapier or Make?",
    a: "Neuraflow is built for teams who want visual orchestration with developer-grade control — custom HTTP logic, AI chains, encrypted credentials, and full execution history.",
  },
  {
    q: "How much does Pro cost?",
    a: "Pro is $29.99 per month. You can start on the free plan and upgrade anytime from your dashboard through secure Polar checkout.",
  },
  {
    q: "What does Pro unlock?",
    a: "Pro is $29.99/month and unlocks unlimited workflows, all trigger types, AI nodes, Slack & Discord integrations, and encrypted credentials. Upgrade through Polar checkout directly from the app.",
  },
];

function LandingHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.6397_0.172_36.4421/0.12),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-primary/25 bg-primary/5 text-primary"
            >
              Visual workflow automation
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.08]"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
          >
            The visual platform for{" "}
            <span className="text-primary">workflow automation</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: easeOut }}
          >
            Design triggers, AI steps, and integrations on a canvas — then let
            Neuraflow execute them with durable runs, encrypted credentials, and
            live status updates.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24, ease: easeOut }}
          >
            <Button size="lg" asChild className="min-w-[160px]">
              <Link href="/register">
                Start building free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[160px]">
              <a href="#how-it-works">
                <Play className="size-4" />
                See how it works
              </a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto mt-16 max-w-4xl"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: easeOut }}
        >
          <div
            aria-hidden
            className="absolute -inset-4 rounded-2xl bg-primary/10 blur-3xl"
          />
          <WorkflowPreview />
        </motion.div>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
      {children}
    </p>
  );
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-tight text-balance md:text-4xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <LandingHero />
        <IntegrationMarquee />

        {/* Why */}
        <MotionSection
          id="platform"
          className="border-b border-border py-24 md:py-32"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
              <div>
                <SectionEyebrow>Why Neuraflow</SectionEyebrow>
                <SectionHeading>
                  Most automation still lives in scripts, cron jobs, and brittle
                  glue code.
                </SectionHeading>
              </div>
              <p className="text-lg text-muted-foreground text-pretty">
                Neuraflow gives you one unified canvas where every trigger,
                AI call, and integration is visible, versioned, and executable —
                so your team moves from idea to production flow in minutes, not
                sprints.
              </p>
            </div>

            <motion.div
              className="mt-16 overflow-hidden rounded-2xl border border-border bg-muted/30 p-8 md:p-12"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeUp}
                className="max-w-3xl text-2xl font-medium leading-snug tracking-tight md:text-3xl"
              >
                One visual model makes every step in your automation{" "}
                <span className="text-primary">observable and actionable</span>.
              </motion.p>
            </motion.div>
          </div>
        </MotionSection>

        {/* How it works */}
        <MotionSection
          id="how-it-works"
          className="py-24 md:py-32"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow>How it works</SectionEyebrow>
              <SectionHeading>
                You design the flow.
                <br />
                Neuraflow runs the work.
              </SectionHeading>
              <p className="mt-4 text-muted-foreground text-pretty">
                More reliable runs, fewer missed steps, and hours back every week
                — so you can focus on the logic that actually matters.
              </p>
            </div>

            <motion.div
              className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.title} variants={fadeUp}>
                    <Card className="group h-full border-border/80 bg-card transition-colors hover:border-primary/30 hover:bg-accent/20">
                      <CardHeader>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                            <Icon className="size-5" />
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {feature.tag}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <span className="inline-flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Explore
                          <ChevronRight className="size-3.5" />
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </MotionSection>

        {/* Outcomes */}
        <MotionSection className="border-y border-border bg-muted/20 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <SectionEyebrow>Outcomes</SectionEyebrow>
                <SectionHeading>
                  Proven impact for teams shipping automations.
                </SectionHeading>
                <p className="mt-4 text-muted-foreground">
                  From solo builders to growing teams, Neuraflow reduces
                  orchestration overhead and gives you a single place to design,
                  run, and debug every workflow.
                </p>
                <Button className="mt-8" asChild>
                  <Link href="/register">
                    Create your first workflow
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <motion.div
                className="grid gap-6 sm:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainer}
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    className="rounded-xl border border-border bg-card p-6 text-center"
                  >
                    <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.blockquote
              className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-10"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
            >
              <p className="text-lg leading-relaxed text-pretty md:text-xl">
                &ldquo;Neuraflow turned our scattered webhook handlers into one
                visual system. We ship new automations in an afternoon instead of
                planning a sprint.&rdquo;
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  AK
                </div>
                <div>
                  <p className="text-sm font-medium">Alex Kim</p>
                  <p className="text-sm text-muted-foreground">
                    Platform Engineer
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </div>
        </MotionSection>

        {/* Security */}
        <MotionSection id="security" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <motion.div
                  className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 p-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={scaleIn}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Shield className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Enterprise-ready controls</p>
                      <p className="text-sm text-muted-foreground">
                        Built for teams that take security seriously
                      </p>
                    </div>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {securityItems.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Encrypted at rest", "Auth sessions", "Audit logs"].map(
                      (badge) => (
                        <Badge key={badge} variant="outline" className="text-xs">
                          <Lock className="mr-1 size-3" />
                          {badge}
                        </Badge>
                      ),
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="order-1 lg:order-2">
                <SectionEyebrow>Security</SectionEyebrow>
                <SectionHeading>
                  Your workflows are mission critical.
                  <br />
                  We protect them that way.
                </SectionHeading>
                <p className="mt-4 text-muted-foreground">
                  Credentials are encrypted before they touch the database.
                  Executions are scoped to your account. Every run leaves a trace
                  you can inspect when something needs attention.
                </p>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* Community CTA band */}
        <MotionSection className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-8 py-12 md:px-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl"
              />
              <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <GitBranch className="size-4" />
                    <span className="text-sm font-medium">Built for builders</span>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Ship your first workflow in under ten minutes
                  </h3>
                  <p className="mt-2 max-w-xl text-muted-foreground">
                    Sign up, drag a trigger onto the canvas, connect an AI or HTTP
                    node, and hit execute. No infrastructure setup required.
                  </p>
                </div>
                <Button size="lg" asChild className="shrink-0">
                  <Link href="/register">
                    Get started
                    <Zap className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </MotionSection>

        <PricingSection />

        {/* FAQ */}
        <MotionSection id="faq" className="border-t border-border py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <SectionEyebrow>FAQ</SectionEyebrow>
              <SectionHeading>Questions? Answers.</SectionHeading>
              <p className="mt-4 text-muted-foreground">
                Everything you need to know about getting started with Neuraflow.
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-12">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </MotionSection>

        {/* Final CTA */}
        <MotionSection className="pb-24 md:pb-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-2xl border border-border bg-muted/30 px-8 py-16 text-center md:px-16">
              <SectionHeading className="mx-auto max-w-2xl">
                Design flows. Run them reliably. Ship faster.
              </SectionHeading>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Neuraflow turns disconnected scripts and webhooks into a single
                visual system your whole team can understand and extend.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">Start for free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign in to dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </MotionSection>
      </main>

      <footer className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <Image
                src="/logos/logo.svg"
                alt="Neuraflow"
                width={78}
                height={32}
                className="h-[30px] w-auto"
              />
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Visual workflow automation for teams who want control without the
                complexity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Platform</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#platform" className="hover:text-foreground">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-foreground">
                      How it works
                    </a>
                  </li>
                  <li>
                    <Link href="/workflows" className="hover:text-foreground">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium">Account</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/login" className="hover:text-foreground">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-foreground">
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium">Resources</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#pricing" className="hover:text-foreground">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-foreground">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="hover:text-foreground">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Neuraflow. All rights reserved.</p>
            <p>Built with React Flow, Inngest, and shadcn/ui</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
