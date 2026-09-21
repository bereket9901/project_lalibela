# Project Lalibela — Getting Started

This archive contains the complete source of the Project Lalibela interactive web and mobile prototype, including application code, UI components, sample cases, imagery, styles, dependency lockfile and build configuration.

## Requirements

- Node.js 22.13.0 or newer (as specified in package.json).
- npm, supplied with Node.js, and an internet connection for dependency installation.
- pnpm 11.25.0; the commands below run the pinned version through npx.

## Run locally

Extract the ZIP, open a terminal in the extracted Project_Lalibela folder, then run:

```bash
npx --yes pnpm@11.25.0 install --frozen-lockfile
npx --yes pnpm@11.25.0 dev
```

Open the local address printed by the development server, normally http://localhost:5173.
These commands work from a regular terminal, including Windows PowerShell. Use `pnpm install` through the command above for local setup; the separate `install:ci` script belongs to the original managed build environment.

To check TypeScript and create a production build:

```bash
npx --yes pnpm@11.25.0 exec tsc --noEmit
npx --yes pnpm@11.25.0 build
```

To preview the built Cloudflare Worker locally:

```bash
npx --yes pnpm@11.25.0 start
```

Open the address printed by Wrangler. The development and build scripts automatically use the portable execution profile in a clean extracted copy.

## Demo accounts

Choose Admin Login or User Login on the opening screen. Credentials are prefilled.

| Role | Email | Password |
| --- | --- | --- |
| Administrator | admin@lalibela.demo | Lalibela2026! |
| System Operator | operator@lalibela.demo | Lalibela2026! |
| Dashboard Viewer | viewer@lalibela.demo | Lalibela2026! |
| Field Inspector — Hana | hana@lalibela.demo | Lalibela2026! |
| Field Inspector — Dawit | dawit@lalibela.demo | Lalibela2026! |
| Field Inspector — Selam | selam@lalibela.demo | Lalibela2026! |

## Source map

| Location | Contents |
| --- | --- |
| app/page.tsx | Web screens, mobile inspection screens and interaction logic |
| app/data.ts | Sample users/cases, roles, workflow states and GPS verification helpers |
| app/globals.css | Styling and responsive layouts |
| app/layout.tsx | Application document layout and metadata |
| components/ui/ | Reusable UI components |
| public/ | Satellite basemaps, favicon and imagery attribution |
| build/ and scripts/ | Build integration and local runtime helpers |
| package.json and pnpm-lock.yaml | Dependency versions and scripts |
| vite.config.ts and next.config.ts | Framework configuration |
| .openai/hosting.json | Original Sites deployment association and bindings |
| README.md | Feature guide, example walkthrough and validation notes |

## Prototype behavior

The mobile mockups are part of the same responsive React application. AI responses, accounts and investigations are simulated. Qwen, Gemini and Claude are not called by the prototype. Changes and uploaded previews last within the active page session and reset on refresh. Device GPS may be used with browser permission; explicitly labeled simulated GPS scenarios are also available.

The source includes all custom code and declared dependencies. Installed dependency directories, generated build output, Git history and local caches are regenerated using the commands above.

## Export details

Source revision: de54c5be3058259f2a49cb225056c24939b4fedf

The application code matches the exported source revision. In this download, the unresolved `core-js` build-script choice in `pnpm-workspace.yaml` is explicitly set to `false`. This keeps that optional installation script disabled while retaining the existing dependency policies. No application features were changed for the export.

The original Sites project association is retained for completeness; configure the association for a separate project before using an independent Sites deployment. All bundled third-party license and imagery attribution files are included.
