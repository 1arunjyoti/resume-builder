"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface DisclaimerDialogProps {
  trigger?: React.ReactNode;
}

export function DisclaimerDialog({ trigger }: DisclaimerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 hover:bg-primary/10"
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-md">
        <DialogHeader>
          <DialogTitle>Disclaimer</DialogTitle>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm text-left">
              <div className="mt-4">
                <h2 className="font-semibold text-lg text-foreground">
                  How to save your resume data:
                </h2>
                <p className="mt-2">
                  1. Click on the <b>Save</b> button to save your resume data to
                  your browser&apos;s local storage.
                  <b>(Not recommended to use this method)</b>
                </p>
                <p className="mt-1">
                  2. <b>(Better)</b> Alternately, you can also export your
                  resume data as a JSON file.
                </p>
                <p className="mt-1">
                  3. Then import your resume data from the downloaded{" "}
                  <b>JSON</b> file.
                </p>
              </div>

              <div className="mt-6 mb-2">
                <h2 className="font-semibold text-lg text-foreground">
                  How to use the resume builder:
                </h2>
                <p className="mt-2">
                  1. Click on the <b>Content</b> button to edit your resume
                  content.
                </p>
                <p className="mt-1">
                  2. Click on the <b>Customize</b> button to customize your
                  resume.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
