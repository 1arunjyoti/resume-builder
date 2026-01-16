"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RichTextToolbar } from "@/components/ui/RichTextToolbar";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeight = "min-h-[100px]",
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={className}>
      <RichTextToolbar textareaRef={textareaRef} onChange={onChange} />
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        className={cn(minHeight, "mt-1")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
