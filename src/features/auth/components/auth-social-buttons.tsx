"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type AuthSocialButtonsProps = {
  onGithub: () => void;
  onGoogle: () => void;
  disabled?: boolean;
};

export function AuthSocialButtons({
  onGithub,
  onGoogle,
  disabled,
}: AuthSocialButtonsProps) {
  return (
    <div className="grid gap-3">
      <Button
        onClick={onGithub}
        variant="outline"
        className="h-11 w-full rounded-full border-border bg-background font-medium shadow-xs hover:bg-accent/40"
        type="button"
        disabled={disabled}
      >
        <Image alt="GitHub" src="/logos/github.svg" width={20} height={20} />
        Continue with GitHub
      </Button>
      <Button
        onClick={onGoogle}
        variant="outline"
        className="h-11 w-full rounded-full border-border bg-background font-medium shadow-xs hover:bg-accent/40"
        type="button"
        disabled={disabled}
      >
        <Image alt="Google" src="/logos/google.svg" width={20} height={20} />
        Continue with Google
      </Button>
    </div>
  );
}
