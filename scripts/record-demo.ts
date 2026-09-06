import { chromium, type Page, type Locator } from "playwright-core";
import { spawn, execFileSync } from "node:child_process";
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { once } from "node:events";
import { resolve } from "node:path";
import assert from "node:assert/strict";
const output = resolve(process.env.VIDEO_OUTPUT || "artifacts/demo");
const origin = process.env.TEST_ORIGIN || "http://localhost:3210";
if (!process.env.CHROME_BIN)
  throw new Error("Set CHROME_BIN to the actual Chrome binary.");
await mkdir(output, { recursive: true });
const segments: string[] = [];
async function record(
  name: string,
  seconds: number,
  caption: string,
  setup: (page: Page) => Promise<{
    target?: Locator;
    actions: Record<number, () => Promise<unknown>>;
  }>,
  native = false,
) {
  if (process.env.VIDEO_START && name < process.env.VIDEO_START) {
    const file = `${output}/${name}.mp4`;
    const duration = Number(
      execFileSync(
        "ffprobe",
        [
          "-v",
          "error",
          "-show_entries",
          "format=duration",
          "-of",
          "default=nw=1:nk=1",
          file,
        ],
        { encoding: "utf8" },
      ).trim(),
    );
    assert.ok(
      Math.abs(duration - seconds) < 0.1,
      `Incomplete segment: ${name}`,
    );
    segments.push(file);
    return;
  }
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
    args: native
      ? ["--enable-features=WebMCPTesting", "--enable-blink-features=WebMCP"]
      : [],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    const { target, actions } = await setup(page);
    const captionPath = `${output}/${name}.txt`;
    await writeFile(captionPath, caption);
    const filename = `${output}/${name}.mp4`;
    const ffmpeg = spawn(
      "ffmpeg",
      [
        "-y",
        "-loglevel",
        "error",
        "-f",
        "image2pipe",
        "-framerate",
        "15",
        "-vcodec",
        "mjpeg",
        "-i",
        "pipe:0",
        "-vf",
        `scale=1800:860:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:80+(860-ih)/2:color=0x0a0a0a,drawtext=fontfile=${process.env.VIDEO_FONT || "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"}:textfile=${captionPath}:fontcolor=white:fontsize=30:x=(w-text_w)/2:y=990,drawtext=fontfile=${process.env.VIDEO_FONT || "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"}:text='fabrials / ui':fontcolor=0xaaaaaa:fontsize=22:x=60:y=30,fps=30`,
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "19",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        filename,
      ],
      { stdio: ["pipe", "ignore", "inherit"] },
    );
    const done = once(ffmpeg, "close");
    try {
      for (let frame = 0; frame < seconds * 15; frame++) {
        if (actions[frame]) await actions[frame]();
        const buffer = target
          ? await target.screenshot({ type: "jpeg", quality: 90 })
          : await page.screenshot({ type: "jpeg", quality: 90 });
        if (!ffmpeg.stdin.write(buffer)) await once(ffmpeg.stdin, "drain");
      }
      ffmpeg.stdin.end();
      const [code] = await done;
      if (code !== 0) throw new Error(`Encoder failed: ${name}`);
      segments.push(filename);
      console.log(`Recorded ${name}: ${seconds}s`);
    } catch (error) {
      ffmpeg.kill();
      throw error;
    }
  } finally {
    await browser.close();
  }
}
const explorer = (page: Page) =>
  page.getByText("Project explorer", { exact: true }).locator("../../..");
await record(
  "01-intro",
  8,
  "One interface. People and agents.",
  async (page) => ({
    actions: {
      50: () =>
        page
          .getByText("Same components.", { exact: false })
          .first()
          .scrollIntoViewIfNeeded(),
    },
  }),
);
await record(
  "02-manual",
  14,
  "Search, filter and select. Familiar controls. Shared state.",
  async (page) => {
    const target = explorer(page);
    const search = target.getByRole("textbox");
    return {
      target,
      actions: {
        25: () => search.pressSequentially("Web", { delay: 160 }),
        65: () => search.fill(""),
        85: () => target.getByRole("combobox").selectOption("Browser"),
        115: () => target.getByRole("checkbox").first().click(),
        155: async () => {
          assert.equal(await target.locator("tbody tr").count(), 2);
          await target.getByText(/Manual · success/).waitFor();
        },
      },
    };
  },
);
await record(
  "03-simulator",
  14,
  "Simulation: a structured call updates the same table.",
  async (page) => {
    const target = explorer(page);
    return {
      target,
      actions: {
        25: () =>
          target.getByRole("button", { name: "Run simulated tool" }).click(),
        60: async () => {
          await target.getByText('{"visible":2}', { exact: true }).waitFor();
          assert.equal(await target.locator("tbody tr").count(), 2);
        },
        115: () =>
          target.getByRole("button", { name: "Run simulated tool" }).click(),
        150: () => target.getByText("Simulator · success · Call 2").waitFor(),
      },
    };
  },
);
await record(
  "04-native",
  13,
  "Native WebMCP in Chrome. Experimental support enabled.",
  async (page) => {
    const target = explorer(page);
    await page.getByText("WebMCP available", { exact: true }).waitFor();
    return {
      target,
      actions: {
        35: async () => {
          const result = await page.evaluate(async () => {
            const context = (
              document as unknown as {
                modelContext: {
                  getTools: () => Promise<{ name: string }[]>;
                  executeTool: (
                    tool: { name: string },
                    args: string,
                  ) => Promise<unknown>;
                };
              }
            ).modelContext;
            const tool = (await context.getTools()).find(
              (t) => t.name === "filter_projects",
            );
            if (!tool) throw new Error("Native registration missing");
            return context.executeTool(
              tool,
              JSON.stringify({ query: "", category: "Interface" }),
            );
          });
          console.log("Native result", result);
          await target.getByText('{"visible":3}', { exact: true }).waitFor();
          assert.equal(await target.locator("tbody tr").count(), 3);
        },
      },
    };
  },
  true,
);
await record(
  "05-mcp",
  13,
  "Remote MCP: discover a tool, run it, inspect the response.",
  async (page) => {
    await page.goto(`${origin}/examples#console`);
    const target = page.locator("#console");
    await target.scrollIntoViewIfNeeded();
    return {
      actions: {
        15: () =>
          target
            .getByRole("button", { name: "Connect server", exact: true })
            .click(),
        45: async () => {
          await target.getByText(/connected · 2026-07-28/).waitFor();
          await target
            .getByRole("button", { name: "Run tool", exact: true })
            .scrollIntoViewIfNeeded();
        },
        65: () =>
          target.getByRole("button", { name: "Run tool", exact: true }).click(),
        95: async () => {
          const result = target
            .locator('section[aria-label="Execution history"] details')
            .first();
          await result.locator("summary").first().click();
          await result.scrollIntoViewIfNeeded();
          await target
            .getByText("Found 6 projects.", { exact: true })
            .waitFor();
        },
      },
    };
  },
);
await record(
  "06-install",
  8,
  "Install with Bun. Own the code. ui.fabrials.com",
  async (page) => {
    await page.goto(`${origin}/docs/webmcp-provider`);
    const target = page.locator("pre").first().locator("..");
    return { target, actions: {} };
  },
);
await writeFile(
  `${output}/concat.txt`,
  segments.map((p) => `file '${p.replaceAll("'", "'\\''")}'`).join("\n"),
);
const concat = spawn(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    `${output}/concat.txt`,
    "-vf",
    "zoompan=z='1.008-0.008*cos(on/120)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=30,setpts=N/(30*TB),tpad=stop_mode=clone:stop_duration=2",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "19",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-frames:v",
    "2100",
    "-r",
    "30",
    `${output}/demo.mp4`,
  ],
  { stdio: "inherit" },
);
if ((await once(concat, "close"))[0] !== 0) throw new Error("Concat failed");
const encodedDuration = Number(
  execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=nw=1:nk=1",
      `${output}/demo.mp4`,
    ],
    { encoding: "utf8" },
  ).trim(),
);
assert.ok(
  Math.abs(encodedDuration - 70) < 0.04,
  `Unexpected video duration: ${encodedDuration}`,
);
const poster = spawn(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    "-ss",
    "29",
    "-i",
    `${output}/demo.mp4`,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    `${output}/poster.jpg`,
  ],
  { stdio: "inherit" },
);
if ((await once(poster, "close"))[0] !== 0) throw new Error("Poster failed");
console.log(`Video complete: ${output}/demo.mp4`);

await copyFile("video/transcript.vtt", `${output}/transcript.vtt`);
