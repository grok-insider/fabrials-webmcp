import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const executablePath = process.env.CHROME_BIN;
if (!executablePath)
  throw new Error(
    "Set CHROME_BIN to the actual Chrome binary (not a desktop launcher).",
  );
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--enable-features=WebMCPTesting", "--enable-blink-features=WebMCP"],
});
type NativeTool = { name: string };
type NativeModelContext = {
  getTools: () => Promise<NativeTool[]>;
  executeTool: (tool: NativeTool, args: string) => Promise<unknown>;
};
try {
  const page = await browser.newPage();
  await page.goto(process.env.TEST_ORIGIN ?? "http://localhost:3210");
  await page.getByText("WebMCP available", { exact: true }).waitFor();
  const result = await page.evaluate(async () => {
    const context = (
      document as unknown as { modelContext: NativeModelContext }
    ).modelContext;
    const tools = await context.getTools();
    const filter = tools.find((t) => t.name === "filter_projects");
    if (!filter) throw new Error("Native registration missing.");
    const result = await context.executeTool(
      filter,
      JSON.stringify({ query: "", category: "Browser" }),
    );
    return { names: tools.map((t) => t.name), result };
  });
  await page.waitForFunction(
    () => document.querySelectorAll("tbody tr").length === 2,
  );
  assert.equal(await page.locator("tbody tr").count(), 2);
  await page.getByRole("link", { name: "Documentation", exact: true }).click();
  await page
    .getByRole("heading", { name: "Introduction", exact: true })
    .waitFor();
  await page.waitForFunction(
    async () =>
      (
        await (
          document as unknown as { modelContext: NativeModelContext }
        ).modelContext.getTools()
      ).length === 0,
  );
  const remaining = await page.evaluate(async () =>
    (
      await (
        document as unknown as { modelContext: NativeModelContext }
      ).modelContext.getTools()
    ).map((t) => t.name),
  );
  assert.equal(
    remaining.length,
    0,
    "Native tools must unregister on client navigation.",
  );
  await page
    .getByRole("link", { name: "Agent-ready form", exact: true })
    .first()
    .click();
  await page
    .getByRole("textbox", { name: "Project name", exact: true })
    .waitFor();
  const declarative = await page.evaluate(async () => {
    const context = (
      document as unknown as { modelContext: NativeModelContext }
    ).modelContext;
    const tools = await context.getTools();
    return tools.map((t) => t.name);
  });
  assert.ok(
    declarative.includes("find_project"),
    "Declarative form must register natively.",
  );
  await page.evaluate(async () => {
    const context = (
      document as unknown as { modelContext: NativeModelContext }
    ).modelContext;
    const tool = (await context.getTools()).find(
      (t) => t.name === "find_project",
    )!;
    (window as unknown as { nativeCall: Promise<unknown> }).nativeCall =
      context.executeTool(tool, JSON.stringify({ query: "WebMCP" }));
  });
  await page.waitForFunction(
    () =>
      (document.querySelector("input[name=query]") as HTMLInputElement)
        ?.value === "WebMCP",
  );
  await page.getByRole("button", { name: "Find project", exact: true }).click();
  const formResult = await page.evaluate(
    () => (window as unknown as { nativeCall: Promise<unknown> }).nativeCall,
  );
  assert.ok(JSON.stringify(formResult).includes("WebMCP"));
  console.log(
    JSON.stringify(
      {
        browser: browser.version(),
        nativeRegistration: result.names,
        nativeExecution: result.result,
        unregisteredAfterNavigation: remaining.length,
        declarativeForm: declarative,
        formResponse: formResult,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
