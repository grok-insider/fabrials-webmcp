"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserOAuthProvider } from "@/registry/mcp/oauth";
import { MCPProvider, useMCPClient } from "@/registry/mcp/provider";
import { MCPDashboardContent } from "@/registry/components/mcp-dashboard";
function Callback() {
  const started = useRef(false);
  const [error, setError] = useState("");
  const mcp = useMCPClient();
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      let provider: BrowserOAuthProvider | undefined;
      try {
        const pending = BrowserOAuthProvider.readPending();
        if (!pending)
          throw new Error(
            "Authorization session expired. Start a new connection.",
          );
        provider = new BrowserOAuthProvider(pending.endpoint, { resume: true });
        const params = new URLSearchParams(location.search);
        provider.validateCallback(params);
        history.replaceState({}, "", location.pathname);
        await mcp.connect(
          { endpoint: pending.endpoint, oauth: provider },
          params,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Authorization failed.");
        history.replaceState({}, "", location.pathname);
      } finally {
        provider?.complete();
      }
    })();
  }, [mcp]);
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-4 text-3xl font-medium tracking-tight">
        Your MCP connection
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Authorization returns to this console. Tokens remain in this tab until
        you disconnect or leave.
      </p>
      {error ? (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      ) : (
        <MCPDashboardContent />
      )}
    </main>
  );
}
export default function Page() {
  return (
    <MCPProvider>
      <Callback />
    </MCPProvider>
  );
}
