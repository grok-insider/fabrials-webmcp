"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const groups = [
  {
    name: "Interaction",
    description: "Forms, choices and actions for a shared interface.",
  },
  {
    name: "WebMCP",
    description: "Expose your interface to agents in the browser.",
  },
  {
    name: "MCP",
    description: "Discover tools, connect to servers and display results.",
  },
  {
    name: "Foundation",
    description: "Clients and adapters that connect everything.",
  },
];
export function ComponentIndex() {
  const [query, setQuery] = useState("");
  const matches = catalog.filter((item) =>
    `${item.title} ${item.description} ${item.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div className="relative w-full sm:max-w-sm">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-3 size-4 text-muted-foreground"
          />
          <Input
            aria-label="Search components"
            placeholder="Search components…"
            className="h-10 bg-card pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          {matches.length} {matches.length === 1 ? "component" : "components"}
        </p>
      </div>
      {groups.map((group) => {
        const items = matches
          .filter((item) => item.category === group.name)
          .sort((a, b) => a.title.localeCompare(b.title));
        if (!items.length) return null;
        return (
          <section
            key={group.name}
            id={group.name.toLowerCase()}
            className="scroll-mt-28 py-9"
          >
            <h2 className="text-xl font-medium tracking-tight">{group.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {group.description}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className="group rounded-xl border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    />
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      {!matches.length && (
        <div className="py-16 text-center">
          <h2 className="font-medium">No components found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a name like “form”, “tool” or “connection”.
          </p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => setQuery("")}
          >
            Clear search
          </Button>
        </div>
      )}
      <div className="mt-5 border-t py-8 text-sm text-muted-foreground">
        Looking for a complete flow?{" "}
        <Link
          href="/playground"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Open the playground
        </Link>
        .
      </div>
    </>
  );
}
