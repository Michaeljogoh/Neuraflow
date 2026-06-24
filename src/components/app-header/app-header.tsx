"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { openBillingPortal } from "@/features/subscription/polar-actions";
import {
  useMarkNotificationsRead,
  useNotifications,
} from "@/features/settings/hooks/use-settings";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const AppHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const notifications = useNotifications();
  const markRead = useMarkNotificationsRead();

  const isSearchablePage =
    pathname.startsWith("/workflows") || pathname.startsWith("/credentials");

  useEffect(() => {
    if (!isSearchablePage) {
      setSearchValue("");
      return;
    }
    setSearchValue(searchParams.get("search") ?? "");
  }, [isSearchablePage, searchParams]);

  useEffect(() => {
    if (!isSearchablePage) return;

    const timeoutId = window.setTimeout(() => {
      const currentSearch = searchParams.get("search") ?? "";
      if (currentSearch === searchValue) return;

      const params = new URLSearchParams(searchParams.toString());

      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }

      params.delete("page");
      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isSearchablePage, pathname, router, searchParams, searchValue]);

  const unreadCount = notifications.data?.unreadCount ?? 0;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
      <SidebarTrigger />

      <div className="hidden w-full max-w-sm items-center gap-2 rounded-md border border-border px-3 md:flex">
        <SearchIcon className="size-4 text-muted-foreground" />
        <Input
          placeholder={
            isSearchablePage
              ? "Search this page..."
              : "Search available on Workflows & Credentials"
          }
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          disabled={!isSearchablePage}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu
          onOpenChange={(open) => {
            if (open && unreadCount > 0) {
              markRead.mutate({});
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Notifications"
              className="relative"
            >
              <BellIcon className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.isLoading && (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                Loading...
              </div>
            )}
            {!notifications.isLoading &&
              (notifications.data?.items.length ?? 0) === 0 && (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No notifications yet.
                </div>
              )}
            {notifications.data?.items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className={cn(
                  "flex flex-col items-start gap-1 whitespace-normal py-2",
                  !item.read && "bg-primary/5",
                )}
                onClick={() => {
                  const workflowId = (
                    item.metadata as { workflowId?: string } | null
                  )?.workflowId;
                  if (workflowId) router.push(`/workflows/${workflowId}`);
                }}
              >
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {item.message}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 rounded-full px-1 hover:bg-[#E8553A]/10"
              aria-label="Open account menu"
            >
              <Avatar className="size-8 ring-2 ring-[#E8553A]/30">
                <AvatarFallback className="bg-[#E8553A] text-sm font-semibold text-white">
                  NF
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserIcon className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openBillingPortal();
              }}
            >
              <CreditCardIcon className="size-4" />
              Billing portal
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
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
              <LogOutIcon className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
