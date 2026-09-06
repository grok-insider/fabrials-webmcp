import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { demoAssets, mediaConfig, signMediaRequest } from "../lib/demo-media";
const config = mediaConfig();
if (!config) throw new Error("S3_* environment variables are required.");
const directory = resolve(process.env.VIDEO_OUTPUT || "artifacts/demo");
for (const [name, entry] of Object.entries(demoAssets)) {
  const body = await readFile(`${directory}/${name}`);
  const signed = signMediaRequest(config, entry.key, "PUT", body);
  const response = await fetch(signed.url, {
    method: "PUT",
    headers: { ...signed.headers, "Content-Type": entry.type },
    body: new Uint8Array(body),
    signal: AbortSignal.timeout(120000),
  });
  if (!response.ok)
    throw new Error(`Upload failed: ${name} (${response.status})`);
  const check = signMediaRequest(config, entry.key, "HEAD");
  const verification = await fetch(check.url, {
    method: "HEAD",
    headers: check.headers,
  });
  if (
    !verification.ok ||
    Number(verification.headers.get("content-length")) !== body.length
  )
    throw new Error(`Verification failed: ${name}`);
  console.log(`Published ${name}: ${body.length} bytes`);
}
