import Link from "next/link";
import { readFile } from "node:fs/promises";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { catalog, guides } from "@/lib/catalog";
import { DocsSidebar } from "@/components/site-shell";
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
  return (
    <main
      id="main-content"
      className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-10 lg:flex-row lg:gap-14 lg:px-10"
    >
      <DocsSidebar />
      <article className="w-full min-w-0 flex-1 pb-16 lg:max-w-3xl">
        <p className="mb-4 text-[11px] uppercase tracking-[.14em] text-muted-foreground">
          {item?.category ?? "Documentation"}
        </p>
        <h1 className="text-4xl font-medium tracking-[-.045em]">
          {item?.title ?? guide?.title}
        </h1>
        {item && (
          <>
            <p className="mt-4 mb-8 max-w-xl text-base leading-7 text-muted-foreground">
              {item.description}
            </p>
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
              <ComponentPreview slug={slug} source={source} />
            )}
            <h2 className="mt-10 mb-4 text-xl font-medium tracking-tight">
              Installation
            </h2>
            <CodeBlock
              code={`npx shadcn@latest add https://ui.fabrials.com/r/${slug}.json`}
            />
            <h2 className="mt-10 mb-4 text-xl font-medium tracking-tight">
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
            <h2 className="mt-10 mb-4 text-xl font-medium tracking-tight">
              Behavior & compatibility
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
            <h2 className="mt-8 mb-3 text-xl font-medium tracking-tight">
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
          <div className="doc-prose">
            <MDXRemote source={mdx} />
          </div>
        )}
      </article>
    </main>
  );
}
