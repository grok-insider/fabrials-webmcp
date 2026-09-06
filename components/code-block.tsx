"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CodeBlock({
  code,
  label = "Terminal",
  variant = "code",
}: {
  code: string;
  label?: string;
  variant?: "command" | "code";
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-muted/25">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal aria-hidden="true" className="size-3.5" />
          {label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Copy ${label}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setError("");
              setCopied(true);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => setCopied(false), 1800);
            } catch {
              setCopied(false);
              setError("Select the command to copy it.");
            }
          }}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre
        tabIndex={variant === "code" ? 0 : undefined}
        aria-label={label}
        className={`max-h-[36rem] p-4 font-mono text-xs leading-6 ${variant === "command" ? "whitespace-pre-wrap [overflow-wrap:anywhere]" : "overflow-auto [scrollbar-width:thin]"}`}
      >
        <code>{code}</code>
      </pre>
      <span
        role="status"
        className={
          error ? "block px-4 pb-3 text-xs text-destructive" : "sr-only"
        }
      >
        {error || (copied ? "Copied to clipboard" : "")}
      </span>
    </div>
  );
}
