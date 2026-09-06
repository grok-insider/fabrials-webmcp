import { writeFile, mkdir } from "node:fs/promises";
import { narration } from "../video/remotion/script";
import timing from "../video/remotion/timing.json";
const stamp = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 23);
let vtt = "WEBVTT\n\n";
for (const [index, scene] of timing.scenes.entries()) {
  const text = narration[index].text;
  const words = text.split(/\s+/).length;
  let position = 0;
  for (const sentence of text.match(/[^.!?]+[.!?]+/g) || [text]) {
    const start =
      scene.from / 30 + 0.5 + (position / words) * scene.speechSeconds;
    position += sentence.trim().split(/\s+/).length;
    const end =
      scene.from / 30 + 0.5 + (position / words) * scene.speechSeconds;
    vtt += `${stamp(start)} --> ${stamp(end)}\n${sentence.trim()}\n\n`;
  }
}
await mkdir("artifacts/remotion-film", { recursive: true });
await writeFile("video/transcript.vtt", vtt);
await writeFile("artifacts/remotion-film/transcript.vtt", vtt);
