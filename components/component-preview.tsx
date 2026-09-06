"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/code-block";
export function ComponentPreview({
  slug,
  source,
}: {
  slug: string;
  source: string;
}) {
  return (
    <Tabs defaultValue="preview">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Source code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="my-4 rounded-xl border bg-card p-5 sm:p-8">
          <ComponentDemo slug={slug} />
        </div>
      </TabsContent>
      <TabsContent value="code" className="my-4">
        <CodeBlock code={source} label="Source · TypeScript" />
      </TabsContent>
    </Tabs>
  );
}
