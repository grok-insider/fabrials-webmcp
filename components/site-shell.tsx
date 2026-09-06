"use client";
import Link from "next/link";
import { GitHubLink } from "@/components/github-link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalog, guides } from "@/lib/catalog";
export function Mark() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="m15 14 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  useEffect(() => setMenu(false), [path]);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-17 max-w-[1600px] items-center justify-between gap-5 px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-medium tracking-tight"
        >
          <Mark />
          <span>
            fabrials
            <span className="ml-1.5 font-normal text-muted-foreground">
              / ui
            </span>
          </span>
        </Link>
        <nav
          className="hidden items-center gap-7 text-[13px] [&>a]:inline-flex [&>a]:min-h-8 [&>a]:items-center md:flex"
          aria-label="Main navigation"
        >
          <Link
            href="/docs/introduction"
            className={
              guides.some((guide) => path === `/docs/${guide.slug}`)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Documentation
          </Link>
          <Link
            href="/components"
            aria-current={path === "/components" ? "page" : undefined}
            className={
              path === "/components" ||
              catalog.some((item) => path === `/docs/${item.slug}`)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Components
          </Link>
          <Link
            href="/examples"
            className={
              path.startsWith("/examples")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Examples
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <GitHubLink />
          <span className="hidden h-4 border-l sm:block" />
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={() => {
              const value = !dark;
              setDark(value);
              document.documentElement.classList.toggle("dark", value);
              try {
                localStorage.setItem(
                  "fabrials-ui-theme",
                  value ? "dark" : "light",
                );
              } catch {}
            }}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menu && (
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-4 border-t px-6 py-5 text-sm md:hidden"
        >
          <Link href="/docs/introduction">Documentation</Link>
          <Link href="/components">Components</Link>
          <Link href="/examples">Examples</Link>
        </nav>
      )}
    </header>
  );
}
export function DocsSidebar() {
  const path = usePathname();
  const [query, setQuery] = useState("");
  return (
    <aside className="docs-sidebar w-full shrink-0 lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)] lg:w-52 lg:overflow-y-auto lg:pr-4">
      <details className="lg:hidden">
        <summary className="mb-4 rounded-md border p-3 text-sm">
          Browse documentation
        </summary>
        <SidebarContent />
      </details>
      <div className="hidden lg:block">
        <div className="relative mb-7">
          <Search className="absolute top-2 left-2.5 size-3.5 text-muted-foreground" />
          <Input
            aria-label="Find a component"
            placeholder="Find a component…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <SidebarContent />
      </div>
    </aside>
  );
  function SidebarContent() {
    return (
      <nav aria-label="Documentation">
        <Link
          href="/components"
          aria-current={path === "/components" ? "page" : undefined}
          className={`mb-6 block rounded-md px-2 py-2 text-sm ${path === "/components" ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          All components
        </Link>
        <div className="mb-7">
          <p className="mb-3 px-2 text-[11px] font-medium uppercase tracking-[.12em] text-muted-foreground">
            Get started
          </p>
          {guides
            .filter((g) => g.title.toLowerCase().includes(query.toLowerCase()))
            .map((g) => (
              <Link
                key={g.slug}
                href={`/docs/${g.slug}`}
                aria-current={path === `/docs/${g.slug}` ? "page" : undefined}
                className={`mb-0.5 block rounded-md px-2 py-1.5 text-[13px] ${path === `/docs/${g.slug}` ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
              >
                {g.title}
              </Link>
            ))}
        </div>
        {(["WebMCP", "Interaction", "MCP", "Foundation"] as const).map(
          (category) => (
            <div key={category} className="mb-7">
              <p className="mb-3 px-2 text-[11px] font-medium uppercase tracking-[.12em] text-muted-foreground">
                {category}
              </p>
              {catalog
                .filter(
                  (c) =>
                    c.category === category &&
                    c.title.toLowerCase().includes(query.toLowerCase()),
                )
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/docs/${c.slug}`}
                    aria-current={
                      path === `/docs/${c.slug}` ? "page" : undefined
                    }
                    className={`mb-0.5 block rounded-md px-2 py-1.5 text-[13px] ${path === `/docs/${c.slug}` ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
                  >
                    {c.title}
                  </Link>
                ))}
            </div>
          ),
        )}
      </nav>
    );
  }
}
export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground lg:px-10">
        <p>
          Made at{" "}
          <a
            href="https://fabrials.com"
            className="text-foreground underline underline-offset-4"
          >
            Fabrials
          </a>
          . Open source, by design.
        </p>
        <div className="flex gap-5">
          <a href="https://github.com/grok-insider/fabrials-webmcp/blob/master/LICENSE">
            MIT license
          </a>
          <a href="/llms.txt">llms.txt</a>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
