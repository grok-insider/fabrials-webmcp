"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { useWebMCP } from "@/registry/webmcp/provider";
type Session = { owner: string; token: string; expiresAt: number };
export function LiveDemoConnection() {
  const mcp = useWebMCP();
  const run = useRef(mcp.run);
  useEffect(() => {
    run.current = mcp.run;
  }, [mcp.run]);
  const [session, setSession] = useState<Session | null>(null);
  const active = useRef<Session | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [origin, setOrigin] = useState("https://ui.fabrials.com");
  const generation = useRef(0);
  useEffect(() => {
    setOrigin(location.origin);
  }, []);
  function disconnect() {
    generation.current++;
    const s = active.current;
    active.current = null;
    setSession(null);
    setConnected(false);
    if (s)
      void fetch("/api/demo/session/owner", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${s.owner}` },
        keepalive: true,
      }).catch(() => {});
  }
  useEffect(
    () => () => {
      generation.current++;
      const s = active.current;
      active.current = null;
      if (s)
        void fetch("/api/demo/session/owner", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${s.owner}` },
          keepalive: true,
        }).catch(() => {});
    },
    [],
  );
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    const headers = { Authorization: `Bearer ${session.owner}` };
    async function listen() {
      try {
        while (!controller.signal.aborted && active.current === session) {
          const response = await fetch("/api/demo/session/owner", {
            headers,
            signal: controller.signal,
            cache: "no-store",
          });
          if (!response.ok)
            throw Error(
              "Connection ended. Connect again to create a new session.",
            );
          const { command } = await response.json();
          if (!command || active.current !== session) continue;
          let result: unknown;
          let failure: string | undefined;
          try {
            result = await run.current(command.name, command.args, "agent");
            setConnected(true);
          } catch (e) {
            failure = e instanceof Error ? e.message : "Action failed";
          }
          if (controller.signal.aborted || active.current !== session) return;
          const reply = await fetch("/api/demo/session/owner", {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ id: command.id, result, error: failure }),
            signal: controller.signal,
          });
          if (!reply.ok || !(await reply.json()).accepted)
            throw Error(
              "Action acknowledgement failed. Inspect the visible state before repeating it.",
            );
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : "Connection failed");
          disconnect();
        }
      }
    }
    void listen();
    return () => controller.abort();
  }, [session]);
  async function connect() {
    const gen = ++generation.current;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/demo/session", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Could not connect");
      if (generation.current !== gen) {
        void fetch("/api/demo/session/owner", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${data.owner}` },
        });
        return;
      }
      active.current = data;
      setSession(data);
    } catch (e) {
      if (generation.current === gen)
        setError(e instanceof Error ? e.message : "Connection failed");
    } finally {
      if (generation.current === gen) setBusy(false);
    }
  }
  return (
    <details className="rounded-xl border bg-background p-4 text-sm">
      <summary className="cursor-pointer font-medium">
        Connect your agent via MCP
      </summary>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Create a temporary connection to this tab. Use a client that supports
        Streamable HTTP and an Authorization header. Keep this page open.
      </p>
      {!session ? (
        <Button
          size="sm"
          className="mt-4"
          onClick={() => void connect()}
          disabled={busy}
        >
          {busy ? "Creating session…" : "Create MCP connection"}
        </Button>
      ) : (
        <div className="mt-4 space-y-3">
          <p role="status" className="text-xs">
            {connected
              ? "Agent active · controlling this demo"
              : "Waiting for your agent"}
          </p>
          <CodeBlock
            label="MCP client configuration"
            code={JSON.stringify(
              {
                mcpServers: {
                  "fabrials-demo": {
                    url: `${origin}/api/demo/session/mcp`,
                    headers: { Authorization: `Bearer ${session.token}` },
                  },
                },
              },
              null,
              2,
            )}
          />
          <p className="text-xs leading-5 text-muted-foreground">
            This token controls only your fictional demo. Share it only with
            your client. It expires after 30 minutes; disconnecting revokes it.
            Refreshing the page requires a new connection.
          </p>
          <Button variant="outline" size="sm" onClick={disconnect}>
            Disconnect agent
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Try asking: “Compare machines for a 40 cm counter and 54 mm accessories,
        then choose the best fit.”{" "}
        <Link
          href="/docs/interactive-demo"
          className="underline underline-offset-4"
        >
          Connection guide
        </Link>
      </p>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {mcp.support === "native"
          ? "WebMCP is also active: a browser agent can use the page tools directly."
          : "Browser WebMCP is unavailable here. The remote MCP connection above works independently."}
      </p>
    </details>
  );
}
