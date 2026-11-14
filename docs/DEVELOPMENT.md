# Development guide

## Set up

1. Install Node.js 22 (the version in `.nvmrc`; `nvm use` picks it up).
2. `npm ci`
3. `npm run dev` → <http://localhost:4321>. Drafts are visible in dev, hidden in production.

Useful commands:

| Command | Does |
| --- | --- |
| `npm run dev` | Local server with live reload |
| `npm run check` | Type-checks code and validates every content file against its schema |
| `npm run build` | Builds the static site into `dist/` |
| `node scripts/check-site.mjs` | After a build: broken internal links, missing alt text, titles, one `<h1>` per page, 30 KB JS budget |
| `BASE_PATH=/website npm run build` | Build exactly as it will be served on the github.io address |

## Project structure

```
.github/workflows/deploy.yml   build + deploy to GitHub Pages; nightly rebuild
.github/dependabot.yml         monthly dependency update PRs
.pages.yml                     Pages CMS configuration (forms officers see)
astro.config.mjs               site URL/base path, sitemap, Markdown settings
public/                        copied as-is: favicons, og-image.png, files/publications/ (PDFs)
scripts/check-site.mjs         post-build checks used in CI
src/
  assets/brand/                Synapse logo
  assets/uploads/              images uploaded through the CMS (optimised at build)
  content/                     ALL editable content (see EDITING.md)
  content.config.ts            schemas: required fields and allowed values
  components/                  Header, Footer, Network, ProjectCard, EventItem, StatusBadge…
  layouts/BaseLayout.astro     <head>, meta tags, header, footer
  lib/                         helpers: dates (Atlanta time), content queries, links, network drawing
  pages/                       one file per route
  styles/global.css            design tokens and base styles
docs/                          this handbook
```

## Rules of the road

- **Content stays in `src/content/`.** Layout code never contains club-specific text that officers might need to change; put it in Site settings or a page file instead.
- **Links:** always build internal links with `href('/path')` from `src/lib/url.ts`. The site may be served from a sub-path (`/website/`) and plain `/path` links would break. Links inside Markdown are fixed automatically.
- **Images:** content images live in `src/assets/uploads/` and are referenced as `@uploads/name.jpg`. Use Astro's `<Image>` so they're resized.
- **Colour:** blue `#004AAD` for interactive and text accents; yellow `#FBCE09` only for decoration. Check contrast (WCAG AA, 4.5:1) before adding a colour.
- **No frameworks.** No React/Vue; plain Astro components and small `<script>` tags. Keep total JS per page under 30 KB.
- **Motion** must stop when `prefers-reduced-motion` is set.

## Adding a field to a collection (example: "speaker name" on events)

1. `src/content.config.ts`: add `speaker: optionalText,` to the `events` schema.
2. `.pages.yml`: add `- { name: speaker, label: Speaker, type: string }` under `events → fields`.
3. Display it, e.g. in `src/components/EventItem.astro` and `src/pages/events/[slug].astro`.
4. `npm run check && npm run build`, open a PR, merge when the build passes.

## Dates and times

Event times are entered as Atlanta wall-clock time (`2026-11-20T18:30`, no time zone) and kept as strings. `src/lib/dates.ts` converts them to real instants only when needed (upcoming/past, calendar files), so the build server's time zone can never shift an event.

## Upgrading Astro

Dependabot opens update PRs monthly; merge them if CI passes. Plan one Astro **major** upgrade a year, in summer: read the upgrade guide, run `npx @astrojs/upgrade`, fix `npm run check`, compare pages visually.

## If Pages CMS ever goes away

Content is plain files, so the site is unaffected. Options: self-host Pages CMS (MIT-licensed), or switch to Sveltia/Decap CMS by writing their config for the same folders and fields (`.pages.yml` is the reference).
