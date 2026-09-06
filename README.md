# Fabrials WebMCP UI

Open-source shadcn components for interfaces shared by people and agents.

**Documentation and registry:** https://ui.fabrials.com

```sh
npx shadcn@latest add https://ui.fabrials.com/r/mcp-dashboard.json
```

React 19 · TypeScript · Tailwind 4 · shadcn Base UI · MIT

## Included

19 registry entries: browser WebMCP integration, semantic forms, search/table selection, date ranges, wizards, confirmations, a remote MCP client, OAuth, tools, results, progress, elicitation, resources, prompts, a dashboard and an optional Node connector.

MCP target: **2026-07-28**, using official SDK v2. Legacy **2025-11-25** is a separate tested path. WebMCP support is experimental; the UI works without it and simulators are labeled.

## Develop

```sh
npm ci
npm run dev             # http://localhost:3210
npm run check
npm test
npm run build           # registry + Next.js
```

Docs/demos import registry source directly. `npm run registry:build` generates public JSON entries and llms.txt. Consumers own the copied code; no npm library or hosted Fabrials runtime is required.

See `content/` for installation, OAuth callback integration, connector hosting and compatibility. Server-held credentials belong to the host's OAuth flow and credential store. The public site is not an arbitrary MCP proxy.

## Deployment

Node 22 Docker image, Coolify on fabrials-1, master branch. Health: `/api/health`. Build and run with Node rather than the Bun runtime. No user data is persisted by the demo. Roll back via Coolify to a previous successful commit/image.

## License

MIT. shadcn/ui and Base UI are MIT; dependency licenses remain with their authors. IBM Plex Sans is distributed under the SIL Open Font License in `public/fonts/OFL.txt`.
