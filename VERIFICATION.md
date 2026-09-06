# Verification — 2026-09-06

- TypeScript and ESLint pass; Next.js production build renders all documentation routes.
- 20 tests cover current/legacy MCP, discovery, tool execution, resource/prompt reading, additional input, progress, cancellation, subscriptions, WebMCP lifecycle, schema validation, OAuth transient state/issuer partitioning, connector destination guards and component behavior.
- Registry entries install through the real shadcn CLI into clean Vite and Next.js projects. Both consumers typecheck and build, including the optional Node connector in Next.js.
- Native WebMCP verified in Chrome 152.0.7977.75 with WebMCPTesting enabled in a temporary profile: tool registration, native execution updating visible rows, unregistration after client navigation, declarative registration and manual form submission returning a native tool result.
- Daily Chrome without WebMCP: manual controls and explicitly labeled simulator work. Remote console negotiates MCP 2026-07-28; elicitation opens a focused dialog and resumes with the supplied answer.
- Mobile examples at 390px have no document overflow. Lighthouse navigation audit: accessibility 100, SEO 100, agentic browsing 100. The daily profile injected Dark Reader attributes before hydration, causing the development-mode console warning; a clean native session is used to distinguish extension effects from application errors.
- OAuth storage/state/error cases are automated; live authorization depends on each target server's OAuth registration and CORS configuration. No third-party account authorization was performed as part of these tests.

Reproduce native testing with `CHROME_BIN=/path/to/actual/chrome npm run test:native`. This launches and closes a temporary browser; do not point it at a wrapper that opens your daily profile.

Reproduce consumer installation with a local dev server running and `npm run test:registry`, or set `REGISTRY_ORIGIN=https://ui.fabrials.com` to check the published registry.
