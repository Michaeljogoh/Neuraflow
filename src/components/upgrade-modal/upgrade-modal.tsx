"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { startProCheckout } from "@/features/subscription/polar-actions";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Upgrade to Pro</SheetTitle>
          <SheetDescription>
            You need an active subscription to perform this action. Upgrade to
            pro to unlock all features.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => startProCheckout()}>Upgrade Now</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
