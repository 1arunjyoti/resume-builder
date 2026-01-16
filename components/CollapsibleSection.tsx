"use client";

import { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: React.ReactNode;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  actions,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "border rounded-lg bg-background overflow-hidden transition-all duration-200 ease-in-out hover:shadow-sm",
        isOpen ? "shadow-sm border-border" : "border-border/60",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div
          className="flex items-center gap-3 font-semibold cursor-pointer select-none flex-1 group"
          onClick={() => setIsOpen(!isOpen)}
        >
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-md text-primary group-hover:bg-primary/15 transition-colors">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <span className="text-base group-hover:text-primary transition-colors">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {actions && (
            <div onClick={(e) => e.stopPropagation()}>{actions}</div>
          )}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="animate-collapsible-down">
        <div className="px-4 pb-4 pt-0">
          <div className="pt-4 border-t">{children}</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
