import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { CoffeeDemo } from "@/components/coffee-demo";
import { ExplorerDemo, BookingDemo } from "@/components/demos";
import { MCPDashboard } from "@/registry/components/mcp-dashboard";
export const metadata = { title: "Examples" };
export default function Examples() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-[1440px] space-y-16 px-6 py-12 lg:px-10"
    >
      <header>
        <p className="mb-4 text-[11px] uppercase tracking-[.15em] text-muted-foreground">
          Made from the registry
        </p>
        <h1 className="text-4xl font-medium tracking-tight">Examples</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Explore the shared interface. See how reusable components become
          complete flows, with application state, tool registration and human
          controls.
        </p>
      </header>
      <nav
        aria-label="Example gallery"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          [
            "comparison",
            "01",
            "Shopping assistant",
            "Compare options, choose a product and review a shared cart.",
          ],
          [
            "explorer",
            "02",
            "Project explorer",
            "Search, filter and select records manually or through a tool.",
          ],
          [
            "reservation",
            "03",
            "Reservation flow",
            "Complete a guided booking with a shared form state.",
          ],
          [
            "console",
            "04",
            "MCP workspace",
            "Connect to a server, discover its tools and inspect results.",
          ],
        ].map(([id, number, title, description]) => (
          <a
            key={id}
            href={`#${id}`}
            className="group rounded-xl border bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="flex justify-between text-muted-foreground">
              <span className="font-mono text-xs">{number}</span>
              <ArrowDownRight aria-hidden="true" className="size-4" />
            </div>
            <h2 className="mt-6 font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </a>
        ))}
      </nav>
      <section id="comparison" className="scroll-mt-28 border-t pt-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">01</span>
          <h2 className="text-xl font-medium tracking-tight">
            From a recommendation to a selection
          </h2>
        </div>
        <p className="mb-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          A shopping assistant helps find a machine that fits your space and
          accessories. Compare the evidence, change the selection and review it.
          This example owns the product rules and cart state.
        </p>
        <ComponentLinks
          slugs={[
            ["comparison", "Comparison"],
            ["webmcp-provider", "WebMCP provider"],
            ["confirmation-dialog", "Confirmation"],
          ]}
        />
        <CoffeeDemo />
      </section>
      <section id="explorer" className="scroll-mt-28 border-t pt-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">02</span>
          <h2 className="text-xl font-medium tracking-tight">
            A project explorer
          </h2>
        </div>
        <p className="mb-4 text-sm leading-7 text-muted-foreground">
          People and tools update the same filters and selection. Try a manual
          search, then simulate a tool call.
        </p>
        <ComponentLinks
          slugs={[
            ["data-explorer", "Data explorer"],
            ["webmcp-provider", "WebMCP provider"],
          ]}
        />
        <div className="rounded-xl border bg-card p-5 sm:p-8">
          <ExplorerDemo />
        </div>
      </section>
      <section id="reservation" className="scroll-mt-28 border-t pt-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">03</span>
          <h2 className="text-xl font-medium tracking-tight">
            A reservation flow
          </h2>
        </div>
        <p className="mb-4 text-sm leading-7 text-muted-foreground">
          Choose dates and move through a multi-step flow. Validation and
          progress stay in the application.
        </p>
        <ComponentLinks
          slugs={[
            ["wizard", "Multi-step flow"],
            ["date-range", "Date range"],
          ]}
        />
        <div className="max-w-2xl rounded-xl border bg-card p-5 sm:p-8">
          <BookingDemo />
        </div>
      </section>
      <section id="console" className="scroll-mt-28 border-t pt-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">04</span>
          <h2 className="text-xl font-medium tracking-tight">
            A real MCP connection
          </h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Connect to the included demo server, or enter your own CORS-enabled
          endpoint. The demo supports the current protocol and legacy clients.
        </p>
        <ComponentLinks
          slugs={[
            ["mcp-dashboard", "MCP dashboard"],
            ["connection-panel", "Connection panel"],
            ["tool-catalog", "Tool catalog"],
          ]}
        />
        <div className="rounded-xl border bg-card p-5 sm:p-8">
          <MCPDashboard defaultEndpoint="/api/demo/mcp" />
        </div>
      </section>
    </main>
  );
}

function ComponentLinks({ slugs }: { slugs: string[][] }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
      <span className="mr-1 text-muted-foreground">Built with</span>
      {slugs.map(([slug, title]) => (
        <Link
          key={slug}
          href={`/docs/${slug}`}
          className="rounded-md border px-2.5 py-1.5 hover:bg-muted"
        >
          {title} ↗
        </Link>
      ))}
    </div>
  );
}
