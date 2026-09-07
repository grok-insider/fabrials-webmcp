import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Root } from "fumadocs-core/page-tree";
import { catalog, guides } from "@/lib/catalog";
import { DocsToolbar } from "@/components/docs-toolbar";
const tree: Root = {
  name: "Fabrials UI",
  children: [
    { type: "page", name: "All components", url: "/components" },
    {
      type: "folder",
      name: "Get started",
      defaultOpen: true,
      children: guides.map((g) => ({
        type: "page",
        name: g.title,
        url: `/docs/${g.slug}`,
      })),
    },
    ...(["Interaction", "WebMCP", "MCP", "Foundation"] as const).map(
      (category) => ({
        type: "folder" as const,
        name: category,
        defaultOpen: true,
        children: catalog
          .filter((c) => c.category === category)
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((c) => ({
            type: "page" as const,
            name: c.title,
            url: `/docs/${c.slug}`,
          })),
      }),
    ),
  ],
};
export function DocumentationShell({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={tree}
      nav={{ title: "Documentation", url: "/docs/introduction" }}
      slots={{ header: DocsToolbar }}
      themeSwitch={{ enabled: false }}
      containerProps={{ className: "fabrials-docs" }}
    >
      {children}
    </DocsLayout>
  );
}
