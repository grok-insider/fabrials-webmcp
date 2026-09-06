import { CoffeeDemo } from "@/components/coffee-demo";
import { ExplorerDemo, BookingDemo } from "@/components/demos";
import { MCPDashboard } from "@/registry/components/mcp-dashboard";
export const metadata = { title: "Examples" };
export default function Examples() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl space-y-14 px-6 py-14">
      <header>
        <p className="mb-4 text-[11px] uppercase tracking-[.15em] text-muted-foreground">
          Made from the registry
        </p>
        <h1 className="text-4xl font-medium tracking-tight">
          Working examples.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Explore the shared interface. Every example uses the same components
          you install in your own app.
        </p>
      </header>
      <section id="comparison">
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">01</span>
          <h2 className="text-xl font-medium tracking-tight">
            From a recommendation to a selection
          </h2>
        </div>
        <CoffeeDemo />
      </section>
      <section id="explorer">
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">02</span>
          <h2 className="text-xl font-medium tracking-tight">
            A project explorer
          </h2>
        </div>
        <div className="rounded-xl border bg-card p-5 sm:p-8">
          <ExplorerDemo />
        </div>
      </section>
      <section id="reservation">
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">03</span>
          <h2 className="text-xl font-medium tracking-tight">
            A reservation flow
          </h2>
        </div>
        <div className="max-w-2xl rounded-xl border bg-card p-5 sm:p-8">
          <BookingDemo />
        </div>
      </section>
      <section id="console">
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
        <div className="rounded-xl border bg-card p-5 sm:p-8">
          <MCPDashboard defaultEndpoint="/api/demo/mcp" />
        </div>
      </section>
    </main>
  );
}
