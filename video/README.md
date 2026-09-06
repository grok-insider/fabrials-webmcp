# Product demo

70 seconds, 1920×1080, 30 fps, H.264/yuv420p, silent. English captions are burned into the picture; `transcript.vtt` also supplies an accessible text track.

The recorder drives the real UI and asserts the visible results. Ordinary chapters run in Chrome without WebMCP flags; the native chapter uses Chrome's experimental WebMCPTesting API to execute a registered tool. This is a native browser test invocation, not a recorded LLM conversation. The remote chapter calls the actual included MCP server.

## Reproduce

Install Bun 1.4.2, Chrome, FFmpeg with libx264/drawtext, and a readable TrueType font. Start the app with `bun run dev` (or set TEST_ORIGIN to the published site).

```sh
CHROME_BIN=/path/to/actual/chrome VIDEO_FONT=/path/to/font.ttf bun run video:record
```

Do not use a daily-browser launcher as CHROME_BIN. The script opens and closes temporary browsers, records real interaction frames, and encodes six chapters into `artifacts/demo/demo.mp4` and a poster. Intermediate files are reproducible build artifacts, excluded from git. The recorder also copies `video/transcript.vtt` into the output directory. A restrained camera motion is applied during final encoding. To resume a verified recording, set `VIDEO_START=05` (earlier segments must have their full expected durations).

The six chapters last 8, 14, 14, 13, 13 and 8 seconds: introduction, manual controls, simulator, native WebMCP, remote MCP, installation. Each action is scheduled by frame index so browser/network waiting does not alter the final duration. Captions distinguish simulation from native execution.

## Publish

Use `bun run video:publish` with runtime S3_* credentials from Coolify. The script PUTs and HEAD-verifies the three fixed assets in bucket `apps`, prefix `videos/fabrials-ui/v1/`. Credentials must never be committed or written into recordings. The app serves only these three allowlisted objects through `/api/demo-media/{asset}`, supports HEAD and single byte ranges, and streams bodies without buffering the entire video.

The landing loads only its poster initially. Video playback starts on demand; captions, a text transcript and download are available. Bump the asset prefix and the `v` query parameter in the player when replacing a published release, then redeploy so browser/CDN caches use the new URLs.
