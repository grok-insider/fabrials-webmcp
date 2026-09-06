# Verification — 2026-09-06

- Bun migration: Bun 1.4.2 frozen installation, TypeScript 7.0.2 checks, ESLint 10.10.0, 20 Vitest tests and production build pass. `bun outdated` reports no pending direct dependency updates. Undici is 8.10.2. Microsoft’s TypeScript 6 API alias and ESLint’s official compatibility utility preserve tooling integration without disabling checks.
- Clean registry consumers using Bun and TypeScript 7 install and build in both Vite and Next.js. The Next.js fixture includes the updated optional Node connector.

- Production at https://ui.fabrials.com: healthy HTTPS service, 19 registry items, native Chrome tool/form flows and a real MCP 2026-07-28 discovery/call round trip passed. Clean Vite and Next.js consumers installed and built from the public registry.

- TypeScript and ESLint pass; Next.js production build renders all documentation routes.
- 20 tests cover current/legacy MCP, discovery, tool execution, resource/prompt reading, additional input, progress, cancellation, subscriptions, WebMCP lifecycle, schema validation, OAuth transient state/issuer partitioning, connector destination guards and component behavior.
- Registry entries install through the real shadcn CLI into clean Vite and Next.js projects. Both consumers typecheck and build, including the optional Node connector in Next.js.
- Native WebMCP verified in Chrome 152.0.7977.75 with WebMCPTesting enabled in a temporary profile: tool registration, native execution updating visible rows, unregistration after client navigation, declarative registration and manual form submission returning a native tool result.
- Daily Chrome without WebMCP: manual controls and explicitly labeled simulator work. Remote console negotiates MCP 2026-07-28; elicitation opens a focused dialog and resumes with the supplied answer.
- Mobile examples at 390px have no document overflow. Lighthouse navigation audit: accessibility 100, SEO 100, agentic browsing 100. The daily profile injected Dark Reader attributes before hydration, causing the development-mode console warning; a clean native session is used to distinguish extension effects from application errors.
- OAuth storage/state/error cases are automated; live authorization depends on each target server's OAuth registration and CORS configuration. No third-party account authorization was performed as part of these tests.

Reproduce native testing with `CHROME_BIN=/path/to/actual/chrome bun run test:native`. This launches and closes a temporary browser; do not point it at a wrapper that opens your daily profile.

Reproduce consumer installation with a local dev server running and `bun run test:registry`, or set `REGISTRY_ORIGIN=https://ui.fabrials.com` to check the published registry.

## UI polish and video — 2026-09-06

- Phase 1 (`910e584`): real GitHub stars (including zero), resilient API/cache fallback, responsive command wrapping and exact clipboard copy. Verified at 390/768/1440 px; 24 tests and build passed.
- Phase 2 (`e93ca97`): explicit manual/simulator/native results, repeat-call feedback, complete reset and accessible shadcn selection. 27 tests, production build and native Chrome flows passed.
- Phase 3: on-demand player with retry, captions/transcript and download; S3 allowlisted streaming with HEAD and byte ranges. 32 tests and production build passed. Clean Bun registry consumers build in Next.js and Vite. Real production-mode playback and seeking to 55 seconds passed without page errors. The rclone partial-response status is normalized to HTTP 206.
- Video capture assertions verify actual manual filters, repeated simulations, native Chrome execution and MCP results. Final MP4: 70 seconds, 1920×1080, 30 fps, H.264, no audio. MP4/poster/VTT PUT and HEAD checks passed on house S3; reproducible sources live in `video/` and `scripts/record-demo.ts`.

- Production proxy handling: media responses use identity encoding and `no-transform` so Traefik/Cloudflare preserve Content-Length and byte-range seeking. The player uses revisioned media URLs to bypass earlier compressed cache entries.

## Remotion replacement · 2026-09-06

- Supersedes the silent capture-based film above; the old recording script has been removed.
- Remotion 4.0.521, six React/SVG scenes, frame-driven transitions and UI actions, Grok Eve narration generated through ai.fabrials.com, original synthesized music.
- Inspected all six scene previews and loaded the composition in Remotion Studio. Final media: 1920×1080 H.264 at 30 fps, stereo 48 kHz AAC, 64.128 seconds including encoder padding, 9,237,490 bytes.
- FFmpeg measured the final mix at -18.76 LUFS integrated and -3.74 dBTP (no clipping). Audio perceptual listening was unavailable in this agent environment; loudness and stream checks are technical validation.
- TypeScript/ESLint, all 34 tests and the production registry/site build pass. Timeline tests ensure speech fits every scene; captions contain all narration sentences.
- Final assets and generated audio sources were PUT/HEAD verified in house S3, apps/videos/fabrials-ui/v2/. Public player version bumped to v=3; byte-range/no-transform behavior preserved.
- Published commit d06fb29 through Coolify deployment oph3ibgmudpaxllddhjlhyl8 (finished). Public Chrome playback: duration 64.128 s, unmuted volume 1, audio decoded; seek to 55.5 s succeeds without errors. Public Range response: 206, bytes 0-1023/9237490, Content-Length 1024.
- Public registry installation and production builds passed in fresh Vite and Next.js projects after publication.

## Task-focused refinement · 2026-09-07

- Analyzed the requested espresso reference: cloned vincanger/webmcp-espresso-store to /tmp/webmcp-espresso-store, read its tool/compatibility/comparison flows, retrieved the YouTube transcript and inspected the 16:10–17:30 demonstration clip. Findings in docs/demo-refinement.md.
- Added an original fictional coffee setup example and reusable registry Comparison: evidence highlighting, responsive mobile cards, shared manual/simulated/native actions, conditional cart tools, compatible filter, manual correction and human review. No payment or real order is made.
- Native Chrome 152 test executes comparison, selection, conditional filter and review tools; manual removal updates the same total. Clearing the cart unregisters conditional tools. Existing explorer, declarative form and route-unmount checks also pass.
- TypeScript/ESLint, 36 tests, registry/site production build, and fresh Vite/Next.js registry installs/builds pass (including Comparison). Automated axe WCAG A/AA checks of the new example pass in light and dark themes after transitions settle. Mobile 390 px has no page overflow; Escape dismisses the review dialog.
- Remotion 4.0.521 reverified as latest. Film uses the actual Comparison component, same product data and original SVG illustrations across a continuous task; inspected six previews and loaded updated composition in Studio.
- Grok Eve through ai.fabrials.com receives /ˈfæbriəlz/ for Fabrials, replacing the earlier split respelling. This is an adopted FAB-ree-uhlz reading, not a claim of one canonical literary pronunciation. Generated character alignment contains the requested IPA. Captions use returned alignment and fail generation on text mismatch. Perceptual listening remains unavailable in this agent environment.
- Published commit 10b7fd4 via Coolify dibgwffvpm9vz17gihs1fem8 (finished). Final film: 65.685333 s, 6,668,247 bytes, 1080p H.264 / stereo AAC. Final audio uses the same checked mix (-18.24 LUFS, -3.88 dBTP).
- Public v=4 media responds 206 to Range, bytes 0-1023/6668247, Content-Length 1024. Chrome decodes audio unmuted and seeks to 55.5 s successfully. Public task UI passes light/dark axe checks, mobile layout and keyboard review. Native coffee/explorer/declarative/navigation checks and fresh public registry installs/builds pass on the deployed release.
- All public film assets plus six narration clips, six alignment files and the original score were PUT/HEAD verified under apps/videos/fabrials-ui/v3/ in house S3.

## Motion refinement · 2026-09-07

- Cursor paths now decelerate onto actual controls and hold through each click. Click feedback is a single frame-driven pulse.
- The selected machine travels from its product image into the cart; the cart row enters with a damped spring, and accessory color/total changes ease together. Empty selection shows a dash and an inactive selection prompt instead of €0 and a review action.
- Reviewed an animated 10.5-second selection clip and sequential frames across the product transfer. TypeScript/ESLint, 38 tests, production registry/site build and diff checks pass.
- Final Remotion film: 65.685333 seconds, 1920×1080 H.264, 48 kHz AAC, 5,295,871 bytes. Existing Grok narration and music retained. Assets and audio/alignment sources PUT/HEAD verified in apps/videos/fabrials-ui/v4/. Player revision v=5.
- Published commit 14d362a through Coolify lqjfzmwgirxsmleliwrok9jp (finished). Public v=5 Range response: 206, bytes 0-1023/5295871, Content-Length 1024. Chrome plays unmuted with decoded audio and no media error; seeking to 55.5 seconds succeeds. All 20 published registry items match the built local registry.
