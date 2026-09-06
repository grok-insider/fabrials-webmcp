"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CodeBlock({
  code,
  label = "Terminal",
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/35">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Copy ${label}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              setError("Select the text below to copy it.");
            }
          }}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        </Button>
      </div>
      <pre className="max-h-[36rem] overflow-auto p-4 font-mono text-xs leading-7">
        <code>{code}</code>
      </pre>
      {error && (
        <p role="status" className="px-4 pb-3 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
