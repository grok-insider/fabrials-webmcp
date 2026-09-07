import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MousePointer2,
  Terminal,
  Workflow,
  Code2,
} from "lucide-react";
import { LandingTour } from "@/components/landing-tour";
import { CodeBlock } from "@/components/code-block";
import { catalog } from "@/lib/catalog";
export default function Home() {
  return (
    <main id="main-content" className="w-full px-5 sm:px-8 lg:px-12 2xl:px-16">
      <section className="grid gap-10 pt-16 pb-14 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:pt-24">
        <div>
          <Link
            href="/docs/compatibility"
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-[11px] text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            WebMCP + MCP 2026-07-28
            <ArrowUpRight className="size-3" />
          </Link>
          <h1 className="text-[clamp(2.7rem,5.5vw,4.8rem)] leading-[1.07] font-medium tracking-[-.055em]">
            Built for people.
            <br />
            <span className="text-muted-foreground">Ready for agents.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">
            Components for a web we use together.
            <br className="hidden sm:block" /> Accessible interfaces, structured
            tools, and shared state. Built on shadcn. Yours to shape.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/docs/installation"
              className="inline-flex h-10 items-center gap-3 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:opacity-85"
            >
              Start building <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/playground"
              className="text-sm hover:underline underline-offset-4"
            >
              Open playground
            </Link>
            <a
              href="#try-it"
              className="inline-flex min-h-10 items-center gap-2 text-sm underline underline-offset-4"
            >
              Play the tour <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 sm:p-7">
          <p className="text-[10px] font-medium uppercase tracking-[.16em] text-muted-foreground">
            From interface to capability
          </p>
          <p className="mt-5 text-xl leading-8 tracking-tight">
            The comparison. The selection.
            <br />
            The reason behind the recommendation.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Give agents useful actions in the interface your users already
            understand.
          </p>
          <div className="mt-6">
            <CodeBlock
              variant="command"
              code="bunx shadcn@latest add https://ui.fabrials.com/r/webmcp-provider.json"
            />
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Copy the code. Make it yours.</span>
            <span>MIT ↗</span>
          </div>
        </div>
      </section>
      <section className="mb-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-y py-5 text-xs text-muted-foreground">
        <span className="mr-auto text-[10px] uppercase tracking-[.12em]">
          Open code. Native capabilities.
        </span>
        <span>React 19</span>
        <span>shadcn / Base UI</span>
        <span>Tailwind CSS 4</span>
        <span>MIT licensed</span>
      </section>
      <section id="try-it" className="scroll-mt-24 pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] uppercase tracking-[.15em] text-muted-foreground">
              A complete task. One shared interface.
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Help someone find their perfect fit.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            A guided journey from a requirement to a reviewed selection. Play
            with sound, or explore the six chapters at your own pace.
          </p>
        </div>
        <LandingTour />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            Built with Comparison from the registry. Tool calls illustrated in sync.
          </p>
          <Link
            href="/docs/comparison"
            className="inline-flex min-h-9 items-center gap-2 text-foreground"
          >
            Build this interaction <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </section>
      <section className="border-t py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Different tasks. Shared building blocks.
            </p>
            <h2 className="mt-3 text-3xl font-medium">
              More ways to put agents to work.
            </h2>
          </div>
          <Link
            href="/playground"
            className="text-sm underline underline-offset-4"
          >
            Explore the playground →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "travel",
              "Travel planning",
              "A quiet stay, within budget.",
              "Compare options and build a shortlist.",
            ],
            [
              "support",
              "Customer support",
              "A clearer queue. A human decision.",
              "Filter tickets and review each resolution.",
            ],
            [
              "onboarding",
              "Workspace setup",
              "From blank form to ready to go.",
              "Validate details across a guided flow.",
            ],
          ].map(([id, label, title, detail], i) => (
            <Link
              key={id}
              href={`/playground#${id}`}
              className="group flex min-h-64 flex-col justify-between rounded-xl border bg-card p-7 hover:bg-muted/40"
            >
              <span className="flex justify-between font-mono text-xs text-muted-foreground">
                0{i + 1} / {label}
                <ArrowUpRight className="size-4" />
              </span>
              <div>
                <h3 className="mt-8 text-2xl font-medium tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-t py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[.15em] text-muted-foreground">
              The collection
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight">
              Small pieces. Real possibilities.
            </h2>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            {catalog.length} components & blocks
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Agent-ready interactions",
              icon: MousePointer2,
              text: "Forms, filters, tables and multi-step flows. Familiar to people. Explicit to agents.",
              href: "/docs/webmcp-form",
              label: "Explore WebMCP",
            },
            {
              title: "A window into your tools",
              icon: Terminal,
              text: "Discover tools, inspect results, and follow execution. Bring your own MCP server.",
              href: "/docs/mcp-dashboard",
              label: "Explore MCP components",
            },
            {
              title: "Your code, your decisions",
              icon: Code2,
              text: "Copy what you need. Adapt every detail. No opaque runtime or hosted dependency.",
              href: "/docs/installation",
              label: "Install from the registry",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-xl border p-6 transition-colors hover:bg-muted/40"
            >
              <card.icon className="mb-7 size-5 text-muted-foreground" />
              <h3 className="text-base font-medium">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {card.text}
              </p>
              <p className="mt-7 flex items-center justify-between text-xs">
                {card.label}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap items-center justify-between gap-6 border-t py-12">
        <div className="flex items-center gap-4">
          <Workflow className="size-6 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              Start with a working example.
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A product comparison, a reservation flow, and a live MCP console.
            </p>
          </div>
        </div>
        <Link href="/playground" className="flex items-center gap-2 text-sm">
          Open playground <ArrowRight className="size-4" />
        </Link>
      </section>
    </main>
  );
}
