"use client";
import { useDocsLayout } from "fumadocs-ui/layouts/docs";
import { PanelLeft } from "lucide-react";
export function DocsToolbar() {
  const { slots } = useDocsLayout();
  return (
    <div
      id="nd-subnav"
      className="[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex h-12 items-center justify-between border-b bg-background px-4 md:hidden max-md:layout:[--fd-header-height:3rem]"
    >
      <slots.sidebar.trigger
        aria-label="Browse docs"
        className="flex min-h-9 items-center gap-2 rounded-md px-2 text-sm"
      >
        <PanelLeft className="size-4" />
        Browse docs
      </slots.sidebar.trigger>
      {slots.searchTrigger && <slots.searchTrigger.sm hideIfDisabled />}
    </div>
  );
}
