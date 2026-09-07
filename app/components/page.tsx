import Link from "next/link";
import { DocumentationShell } from "@/components/documentation-shell";
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import { ComponentIndex } from "@/components/component-index";
export const metadata = {
  title: "Components",
  description:
    "Browse reusable WebMCP and MCP components for React. Search the registry and copy the components into your app.",
};
export default function Components() {
  return (
    <DocumentationShell>
      <DocsPage id="main-content" full>
        <p className="mb-4 text-xs text-muted-foreground">The registry</p>
        <DocsTitle>Components</DocsTitle>
        <DocsDescription>
          Reusable pieces for interfaces that people and agents can use
          together. Browse, preview and copy them into your app.
        </DocsDescription>
        <div className="mt-5 flex gap-5 text-sm">
          <Link
            className="underline underline-offset-4"
            href="/docs/installation"
          >
            Installation guide
          </Link>
          <Link
            className="text-muted-foreground hover:text-foreground"
            href="/playground"
          >
            See them in use ↗
          </Link>
        </div>
        <ComponentIndex />
      </DocsPage>
    </DocumentationShell>
  );
}
