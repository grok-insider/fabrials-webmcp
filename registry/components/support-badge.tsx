import { Badge } from "@/components/ui/badge";
import type { Support } from "@/registry/mcp/types";
export function SupportBadge({
  support,
  error,
}: {
  support: Support;
  error?: string;
}) {
  const labels: Record<Support, string> = {
    checking: "Checking browser…",
    native: "WebMCP available",
    legacy: "WebMCP · legacy API",
    unsupported: "Native WebMCP unavailable",
  };
  return (
    <div className="space-y-2">
      <Badge variant="outline" role="status">
        <span
          className={`mr-1 size-1.5 rounded-full ${support === "native" || support === "legacy" ? "bg-emerald-500" : "bg-muted-foreground"}`}
        />
        {labels[support]}
      </Badge>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
