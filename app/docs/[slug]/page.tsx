import Link from "next/link";
import { readFile } from "node:fs/promises";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { catalog, guides } from "@/lib/catalog";
import { DocumentationShell } from "@/components/documentation-shell";
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import rehypeSlug from "rehype-slug";
import { getTableOfContents } from "fumadocs-core/content/toc";
import { ComponentPreview } from "@/components/component-preview";
import { CodeBlock } from "@/components/code-block";
export function generateStaticParams() {
  return [...catalog, ...guides].map((x) => ({ slug: x.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title:
      [...catalog, ...guides].find((x) => x.slug === slug)?.title ??
      "Documentation",
  };
}
export default async function Docs({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = catalog.find((x) => x.slug === slug);
  const guide = guides.find((x) => x.slug === slug);
  if (!item && !guide) notFound();
  let source = "";
  if (item) source = await readFile(item.files[0], "utf8");
  const mdx = await readFile(`content/${slug}.mdx`, "utf8").catch(() => "");
  const contentToc = getTableOfContents(mdx);
  return (
    <DocumentationShell>
      <DocsPage
        id="main-content"
        full
        toc={
          item
            ? [
                { title: "Preview", url: "#preview", depth: 2 },
                { title: "Installation", url: "#installation", depth: 2 },
                { title: "API", url: "#api", depth: 2 },
                {
                  title: "Behavior & compatibility",
                  url: "#behavior",
                  depth: 2,
                },
                { title: "Accessibility", url: "#accessibility", depth: 2 },
                ...contentToc,
              ]
            : contentToc
        }
      >
        <DocsTitle>{item?.title ?? guide?.title}</DocsTitle>
        {item && <DocsDescription>{item.description}</DocsDescription>}
        {item && (
          <>
            {slug === "server-connector" ? (
              <div className="mb-8 rounded-lg border bg-muted/40 p-5 text-sm leading-7">
                This is a Node server adapter. Install it on your backend and
                provide authentication, destination configuration and credential
                storage. See the{" "}
                <Link className="underline" href="/docs/server">
                  connector guide
                </Link>
                .
              </div>
            ) : (
              <section
                id="preview"
                aria-label="Component preview"
                className="scroll-mt-28"
              >
                <ComponentPreview slug={slug} source={source} />
              </section>
            )}
            {slug === "comparison" && (
              <div className="mt-6 rounded-lg border bg-muted/30 p-5 text-sm leading-7">
                <p className="font-medium">
                  A component for comparing any set of options
                </p>
                <p className="text-muted-foreground">
                  Columns, rows and optional highlights are controlled by your
                  app. Product recommendations, cart state and tool registration
                  belong to the example.
                </p>
                <Link
                  href="/playground#comparison"
                  className="mt-2 inline-block underline underline-offset-4"
                >
                  Explore the shopping example →
                </Link>
              </div>
            )}
            <h2
              id="installation"
              className="scroll-mt-28 mt-10 mb-4 text-xl font-medium tracking-tight"
            >
              Installation
            </h2>
            <CodeBlock
              variant="command"
              code={`bunx shadcn@latest add https://ui.fabrials.com/r/${slug}.json`}
            />
            <h2
              id="api"
              className="scroll-mt-28 mt-10 mb-4 text-xl font-medium tracking-tight"
            >
              API
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="p-3 font-medium">Prop / export</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {item.props.map(([name, type, description]) => (
                    <tr key={name} className="border-t">
                      <td className="p-3 font-mono">{name}</td>
                      <td className="p-3 font-mono text-muted-foreground">
                        {type}
                      </td>
                      <td className="p-3 leading-6 text-muted-foreground">
                        {description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2
              id="behavior"
              className="scroll-mt-28 mt-10 mb-4 text-xl font-medium tracking-tight"
            >
              Behavior & compatibility
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
            <h2
              id="accessibility"
              className="scroll-mt-28 mt-8 mb-3 text-xl font-medium tracking-tight"
            >
              Accessibility
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Keep visible labels, keyboard focus and status announcements when
              customizing. These components inherit your theme; maintain
              sufficient contrast in both color modes. The preview is fully
              keyboard operable.
            </p>
          </>
        )}
        {mdx && (
          <DocsBody>
            <MDXRemote
              source={mdx}
              options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
              components={{
                ...defaultMdxComponents,
                pre: (props) => <pre {...props} tabIndex={0} />,
              }}
            />
          </DocsBody>
        )}
      </DocsPage>
    </DocumentationShell>
  );
}
