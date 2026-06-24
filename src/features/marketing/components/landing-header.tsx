"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  KeyRound,
  Menu,
  Shield,
  Sparkles,
  Timer,
  Webhook,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { easeOut } from "@/features/marketing/lib/motion";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-semibold text-foreground hover:bg-accent/50 hover:text-foreground data-[state=open]:bg-accent/50";

const platformLinks = [
  {
    title: "Platform overview",
    href: "#platform",
    description: "Discover the visual workflow canvas",
    icon: Workflow,
  },
  {
    title: "How it works",
    href: "#how-it-works",
    description: "Design flows and run them reliably",
    icon: Timer,
  },
  {
    title: "Security",
    href: "#security",
    description: "Enterprise-grade controls and encryption",
    icon: Shield,
  },
];

const solutionLinks = [
  {
    title: "Workflow automation",
    href: "#how-it-works",
    description: "Recover hours from manual orchestration",
    icon: Workflow,
  },
  {
    title: "AI integrations",
    href: "#how-it-works",
    description: "Chain OpenAI, Anthropic, and Gemini nodes",
    icon: Sparkles,
  },
  {
    title: "Event triggers",
    href: "#how-it-works",
    description: "Stripe, Google Forms, and webhook triggers",
    icon: Webhook,
  },
  {
    title: "Messaging & alerts",
    href: "#how-it-works",
    description: "Slack, Discord, and HTTP notifications",
    icon: Bot,
  },
];

const resourceLinks = [
  {
    title: "FAQ",
    href: "#faq",
    description: "Common questions about Neuraflow",
    icon: ChevronRight,
  },
  {
    title: "Pricing",
    href: "#pricing",
    description: "Simple plans that scale with you",
    icon: KeyRound,
  },
];

function NavDropdownLink({
  title,
  href,
  description,
  icon: Icon,
  onClick,
}: {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  return (
    <NavigationMenuLink asChild>
      <a
        href={href}
        onClick={onClick}
        className="group flex select-none flex-row items-start gap-3 rounded-lg p-3 no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{title}</p>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        </div>
      </a>
    </NavigationMenuLink>
  );
}

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.header
        className={cn(
          "pointer-events-auto mx-auto max-w-6xl border border-border bg-background transition-[box-shadow,background-color] duration-300",
          mobileOpen ? "rounded-2xl" : "rounded-full",
          scrolled ? "shadow-md" : "shadow-sm",
        )}
        initial={prefersReducedMotion ? undefined : { y: -12, opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logos/logo.svg"
              alt=""
              width={78}
              height={32}
              className="h-[30px] w-auto"
              priority
              aria-hidden
            />
            <span className="text-base font-semibold tracking-tight text-foreground sm:text-[17px] sm:tracking-[-0.02em]">
              Neura<span className="text-primary">flow</span>
            </span>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-0.5">
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "h-9 rounded-full bg-transparent px-4",
                      navLinkClass,
                    )}
                  >
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[340px] gap-1 p-2">
                      {platformLinks.map((link) => (
                        <li key={link.title}>
                          <NavDropdownLink {...link} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "h-9 rounded-full bg-transparent px-4",
                      navLinkClass,
                    )}
                  >
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[380px] grid-cols-1 gap-1 p-2 sm:grid-cols-2">
                      {solutionLinks.map((link) => (
                        <li key={link.title}>
                          <NavDropdownLink {...link} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a
                      href="#pricing"
                      className={cn(
                        "inline-flex h-9 w-max items-center justify-center rounded-full px-4 transition-colors",
                        navLinkClass,
                      )}
                    >
                      Pricing
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "h-9 rounded-full bg-transparent px-4",
                      navLinkClass,
                    )}
                  >
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-1 p-2">
                      {resourceLinks.map((link) => (
                        <li key={link.title}>
                          <NavDropdownLink {...link} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full font-semibold text-foreground hover:bg-accent/50 hover:text-foreground"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="rounded-full px-5 font-semibold" asChild>
              <Link href="/register">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex size-9 items-center justify-center rounded-full border border-border md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            className="border-t border-border px-4 py-5 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Platform
                </p>
                <div className="space-y-1">
                  {platformLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="block rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-accent"
                      onClick={closeMobile}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Solutions
                </p>
                <div className="space-y-1">
                  {solutionLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="block rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-accent"
                      onClick={closeMobile}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="#pricing"
                className="block rounded-md px-2 py-2 text-sm font-semibold text-foreground hover:bg-accent"
                onClick={closeMobile}
              >
                Pricing
              </a>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Resources
                </p>
                <div className="space-y-1">
                  {resourceLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="block rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-accent"
                      onClick={closeMobile}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/login" onClick={closeMobile}>
                    Sign in
                  </Link>
                </Button>
                <Button className="rounded-full" asChild>
                  <Link href="/register" onClick={closeMobile}>
                    Get started
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>
    </div>
  );
}
