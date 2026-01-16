"use client";

import {
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  className?: string;
}

export function RichTextToolbar({
  textareaRef,
  onChange,
  className,
}: RichTextToolbarProps) {
  const insertFormat = (
    prefix: string,
    suffix: string = "",
    block: boolean = false
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    let newText = "";
    let newCursorPos = 0;

    if (block) {
      // For block elements like List, we might want to ensure newlines
      const hasNewlineBefore = start === 0 || text[start - 1] === "\n";
      const actualPrefix = hasNewlineBefore ? prefix : `\n${prefix}`;
      newText = `${before}${actualPrefix}${selection}${suffix}${after}`;
      newCursorPos =
        start + actualPrefix.length + selection.length + suffix.length;
    } else {
      newText = `${before}${prefix}${selection}${suffix}${after}`;
      newCursorPos = start + prefix.length + selection.length + suffix.length;
    }

    onChange(newText);

    // Restore focus and cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const wrapSelectionWithTag = (tag: string, attr: string = "") => {
    const attribute = attr ? ` ${attr}` : "";
    insertFormat(`<${tag}${attribute}>`, `</${tag}>`);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 p-1 border rounded-md bg-muted/20 mb-2",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => insertFormat("**", "**")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => insertFormat("*", "*")}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => wrapSelectionWithTag("u")}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => insertFormat("- ", "", true)}
        title="Bulleted List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => insertFormat("[", "](url)")}
        title="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => wrapSelectionWithTag("div", 'align="left"')}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => wrapSelectionWithTag("div", 'align="center"')}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => wrapSelectionWithTag("div", 'align="right"')}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => wrapSelectionWithTag("div", 'align="justify"')}
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  );
}
