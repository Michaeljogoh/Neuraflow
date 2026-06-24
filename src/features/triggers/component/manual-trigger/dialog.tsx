"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Props  {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Manual Trigger</SheetTitle>
                    <SheetDescription>
                        Configure settings for the manual trigger mode
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">
                       Used to manually execute a workflow, no configuration available.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    )
}




