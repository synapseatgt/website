# Synapse at Georgia Tech — website

The website for **Synapse**, the neurotechnology club at Georgia Tech.

- **Live site:** https://synapseatgt.github.io/website/ (until a custom domain is connected — see [docs/DOMAIN-DNS.md](docs/DOMAIN-DNS.md))
- **Edit content:** https://app.pagescms.org → Sign in with GitHub → `synapseatgt/website`
- **Who to ask:** the website lead listed in [docs/ACCOUNTS.md](docs/ACCOUNTS.md)

## How it works

| Piece | What it is |
| --- | --- |
| [Astro](https://astro.build) | Turns the content files into a fast, static website. No server, no database. |
| `src/content/` | All the words, events, projects, officers and newsletters, as plain Markdown/YAML files. |
| [Pages CMS](https://pagescms.org) | A web editor for those files, configured in [`.pages.yml`](.pages.yml). Every Save is a Git commit. |
| GitHub Actions | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) checks and builds the site on every commit and every night, then publishes it. |
| GitHub Pages | Hosts the built site for free. |

If a build fails (for example, an event is missing its date), **nothing is published** and the live site stays as it was. GitHub emails whoever made the change.

## Where to start

| You are… | Read |
| --- | --- |
| An officer updating content | [docs/EDITING.md](docs/EDITING.md) |
| A developer | [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md), then [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| An admin (president / website lead) | [docs/ACCOUNTS.md](docs/ACCOUNTS.md), [docs/DOMAIN-DNS.md](docs/DOMAIN-DNS.md), [docs/HANDOFF.md](docs/HANDOFF.md) |
| Something is broken | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) |

## Quick start for developers

```sh
nvm use            # Node 22 (see .nvmrc)
npm ci
npm run dev        # http://localhost:4321
npm run build && node scripts/check-site.mjs
```

## Design

"Connectome" concept: white pages, node-and-edge network graphics, Manrope and DM Mono (self-hosted).
Colours follow the Synapse logo:

- **Blue `#004AAD`**: buttons, links, headings and accent text.
- **Yellow `#FBCE09`**: decorative shapes only (network nodes, signal traces, dots). Never use it for text — it is unreadable on white.

Tokens live at the top of [`src/styles/global.css`](src/styles/global.css).

## Before launch

All content currently in `src/content/` is **sample content** (titles start with `[Sample]`, placeholders are in `[brackets]`, links contain `REPLACE`). Replace it, then work through the launch checklist in [docs/HANDOFF.md](docs/HANDOFF.md#launch-checklist).

Synapse is a registered student organization at Georgia Tech. This site is run by students and does not represent the views of the Georgia Institute of Technology.
