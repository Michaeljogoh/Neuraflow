"use client";

import {
  BookTemplateIcon,
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UserIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  SidebarContent,
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/subscription/use-subscription";
import {
  openBillingPortal,
  startProCheckout,
} from "@/features/subscription/polar-actions";

const menuItems = [
  {
    title: "Build",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
      {
        title: "Templates",
        icon: BookTemplateIcon,
        url: "/templates",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        icon: UserIcon,
        url: "/profile",
      },
      {
        title: "Settings",
        icon: SettingsIcon,
        url: "/settings",
      },
      {
        title: "Usage & limits",
        icon: ShieldCheckIcon,
        url: "/usage",
      },
      {
        title: "Audit logs",
        icon: ScrollTextIcon,
        url: "/audit-logs",
      },
    ],
  },
];

const navButtonClassName =
  "gap-x-4 h-10 px-4 hover:bg-primary/12 hover:text-primary active:bg-primary/15 active:text-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground data-[active=true]:font-medium data-[active=true]:shadow-sm";

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="gap-x-4 h-10 px-4 hover:bg-transparent hover:text-sidebar-foreground active:bg-transparent active:text-sidebar-foreground"
          >
            <Link href="/workflows" prefetch>
              <Image
                src="/logos/logo.svg"
                alt="Neuraflow"
                width={78}
                height={32}
                className="h-[30px] w-auto shrink-0"
              />
              <span className="font-semibold text-sm">Neuraflow</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      asChild
                      className={navButtonClassName}
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="mx-2 mb-2 rounded-lg border border-primary/25 bg-primary/8 px-3 py-2.5 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace plan
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {isLoading ? (
              <span className="h-5 w-12 animate-pulse rounded-full bg-primary/15" />
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  hasSubscription
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/80 bg-background text-muted-foreground",
                )}
              >
                {hasSubscription && <StarIcon className="size-3 fill-current" />}
                {hasSubscription ? "Pro" : "Free"}
              </span>
            )}
            {!isLoading && hasSubscription && (
              <span className="text-[10px] font-medium text-primary">Active</span>
            )}
          </div>
        </div>
        <SidebarMenu>
          {!hasSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className={navButtonClassName}
                onClick={() => startProCheckout()}
              >
                <StarIcon className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className={navButtonClassName}
              onClick={() => openBillingPortal()}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className={navButtonClassName}
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
