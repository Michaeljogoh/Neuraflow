import { CalendarDaysIcon, MailIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColoredBadge } from "@/components/colored-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-utils";

function getInitials(nameOrEmail: string) {
  const parts = nameOrEmail.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}

export default async function ProfilePage() {
  const session = await requireAuth();
  const displayName = session.user.name || session.user.email;

  return (
    <div className="w-full p-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Your account identity and workspace access details.
      </p>

      <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Connected authentication identity for Neuraflow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-base">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium">{displayName}</p>
              <ColoredBadge colorKey="Active member">Active member</ColoredBadge>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <UserIcon className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="text-sm font-medium break-all">{session.user.id}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MailIcon className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{session.user.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Workspace role</CardTitle>
            <CardDescription>Current access level in this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ColoredBadge colorKey="Member">Member</ColoredBadge>
            <p className="text-muted-foreground">
              Can create and manage workflows, credentials, and executions.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/90 transition-colors hover:border-primary/40 hover:bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Activity</CardTitle>
            <CardDescription>Recent account activity summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="size-4 text-primary" />
              Last sign-in: Today
            </div>
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="size-4 text-primary" />
              Workflows created this week: 4
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
