import Link from "next/link";
import { DocsSidebar } from "@/components/site-shell";
import { ComponentIndex } from "@/components/component-index";
export const metadata = {
  title: "Components",
  description:
    "Browse reusable WebMCP and MCP components for React. Search the registry and copy the components into your app.",
};
export default function Components() {
  return (
    <main id="main-content" className="docs-layout">
      <DocsSidebar />
      <article className="min-w-0 flex-1 pb-12">
        <p className="mb-4 text-xs text-muted-foreground">The registry</p>
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
          Components
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Reusable pieces for interfaces that people and agents can use
          together. Browse, preview and copy them into your app.
        </p>
        <div className="mt-5 flex gap-5 text-sm">
          <Link
            className="underline underline-offset-4"
            href="/docs/installation"
          >
            Installation guide
          </Link>
          <Link
            className="text-muted-foreground hover:text-foreground"
            href="/examples"
          >
            See them in use ↗
          </Link>
        </div>
        <ComponentIndex />
      </article>
    </main>
  );
}
