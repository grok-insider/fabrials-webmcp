"use client";
import { useState } from "react";
import {
  Braces,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { tourCues, tourSnapshot } from "@/lib/coffee-tour";
import { coffeeTotal } from "@/lib/coffee-demo";
const actions = [
  {
    at: tourCues.compare,
    name: "compare_coffee_machines",
    args: { maxWidth: 32, fitting: "58 mm" },
    result: "Studio Dual fits both requirements.",
    source: "Agent",
  },
  {
    at: tourCues.choose,
    name: "set_coffee_cart",
    args: { productId: "studio" },
    result: "Studio Dual selected · €1,290",
    source: "Agent",
  },
  {
    at: tourCues.filter,
    name: "set_coffee_filter",
    args: { included: true },
    result: "Compatible filter added · €1,314",
    source: "Agent",
  },
  {
    at: tourCues.remove,
    name: "Remove optional filter",
    args: null,
    result: "The person changes the selection · €1,290",
    source: "Human",
  },
  {
    at: tourCues.review,
    name: "review_coffee_cart",
    args: {},
    result: "Review opened. The final decision stays with you.",
    source: "Agent",
  },
];
export function TourAgentPanel({ time }: { time: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const state = tourSnapshot(time);
  const completed = actions.filter((a) => time >= a.at);
  const current = completed.at(-1);
  const next = actions.find((a) => time < a.at);
  return (
    <aside
      aria-label="MCP tour activity"
      className="self-start rounded-2xl border bg-background shadow-xl shadow-black/5 xl:sticky xl:top-40"
    >
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <div className="flex items-center gap-2">
          <Braces className="size-4" />
          <h4 className="text-sm font-medium">Inside the agent</h4>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={
            collapsed ? "Expand MCP activity" : "Collapse MCP activity"
          }
          aria-expanded={!collapsed}
          aria-controls="tour-agent-content"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronDown /> : <ChevronUp />}
        </Button>
      </div>
      <div className="px-4 py-3 text-xs text-muted-foreground">
        Illustrated tool calls · synced to the tour
      </div>
      <div
        id="tour-agent-content"
        hidden={collapsed}
        className="space-y-5 px-4 pb-5"
      >
        <p className="rounded-lg bg-muted p-3 text-sm leading-6">
          “Find a machine for a 32 cm counter that works with my 58 mm
          accessories.”
        </p>
        {current ? (
          <div key={current.name} className="tour-enter space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="size-3.5" />
              {current.source} action
            </div>
            <p className="break-all font-mono text-xs font-medium">
              {current.name}
            </p>
            {current.args && (
              <pre
                tabIndex={0}
                aria-label="Tool arguments"
                className="overflow-auto rounded-lg border bg-muted/40 p-3 text-xs leading-6"
              >
                {JSON.stringify(current.args, null, 2)}
              </pre>
            )}
            <p className="text-sm leading-6">{current.result}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Waiting for the requirements</p>
            <p className="text-xs leading-6 text-muted-foreground">
              Play the tour to watch a tool call turn the request into a visible
              change.
            </p>
          </div>
        )}
        {completed.length > 1 && (
          <details className="border-t pt-3">
            <summary className="cursor-pointer text-xs text-muted-foreground">
              Previous actions ({completed.length - 1})
            </summary>
            <ol className="mt-3 space-y-3">
              {completed.slice(0, -1).map((a) => (
                <li key={a.name} className="text-xs leading-5">
                  <span className="text-muted-foreground">{a.source} · </span>
                  {a.result}
                </li>
              ))}
            </ol>
          </details>
        )}
        <div className="border-t pt-4">
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Selection total</span>
            <strong className="tabular-nums">
              {state.id
                ? new Intl.NumberFormat("en", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(coffeeTotal(state.id, state.filter))
                : "—"}
            </strong>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {next
              ? `Next: ${next.source === "Human" ? "a manual correction" : next.name}`
              : "Human review. No order is created."}
          </p>
        </div>
        {time >= tourCues.outro && (
          <a
            href="/playground#comparison"
            className="flex items-center justify-between rounded-lg bg-foreground p-3 text-sm text-background"
          >
            Try it in the playground
            <ArrowRight className="size-4" />
          </a>
        )}
      </div>
    </aside>
  );
}
