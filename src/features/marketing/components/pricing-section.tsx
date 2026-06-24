"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MotionSection } from "@/features/marketing/components/motion-section";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportOnce,
} from "@/features/marketing/lib/motion";
import { cn } from "@/lib/utils";

const freeFeatures = [
  "1 workflow",
  "Manual trigger",
  "HTTP request node",
  "Execution history",
  "Community support",
];

const proFeatures = [
  "Unlimited workflows",
  "All trigger types (Stripe, Google Forms)",
  "AI nodes — OpenAI, Anthropic, Gemini",
  "Slack & Discord integrations",
  "Encrypted credential vault",
  "Real-time execution status",
  "Priority support",
];

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
  badge,
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden transition-shadow",
        highlighted
          ? "border-primary/40 bg-card shadow-lg ring-1 ring-primary/20"
          : "border-border/80 bg-card",
      )}
    >
      {badge && (
        <div className="absolute right-4 top-4">
          <Badge className="bg-primary text-primary-foreground">{badge}</Badge>
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight">{price}</span>
          {period && (
            <span className="text-sm text-muted-foreground">/{period}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={highlighted ? "default" : "outline"}
          size="lg"
          asChild
        >
          <Link href={href}>
            {cta}
            {highlighted && <ArrowRight className="size-4" />}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PricingSection() {
  return (
    <MotionSection id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Start free, upgrade when you need unlimited workflows, AI nodes, and
            premium integrations.
          </p>
        </div>

        <motion.div
          className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <PricingCard
              name="Free"
              price="$0"
              description="Perfect for exploring Neuraflow and building your first flow."
              features={freeFeatures}
              cta="Start for free"
              href="/register"
            />
          </motion.div>

          <motion.div variants={scaleIn}>
            <PricingCard
              name="Pro"
              price="$29.99"
              period="month"
              description="Everything you need to automate at scale with AI and integrations."
              features={proFeatures}
              cta="Upgrade to Pro"
              href="/register"
              highlighted
              badge="Most popular"
            />
          </motion.div>
        </motion.div>

        <motion.p
          className="mt-10 text-center text-sm text-muted-foreground"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          Cancel anytime. Upgrade from your dashboard via secure Polar checkout.
        </motion.p>
      </div>
    </MotionSection>
  );
}
