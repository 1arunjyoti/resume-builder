"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyticsNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem("analytics-notice-dismissed");
    if (!hasDismissed) {
      // Use requestAnimationFrame to avoid synchronous setState warning
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("analytics-notice-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t p-4 shadow-lg animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-muted-foreground text-center sm:text-left">
          We use anonymous analytics to improve PrivateCV. Your personal data
          stays offline.{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Learn more
          </Link>
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={dismiss}
          className="shrink-0 h-8 w-8 p-0 rounded-full"
          aria-label="Dismiss notice"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
