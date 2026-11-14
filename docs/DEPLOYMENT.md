# Deployment

## Pipeline

1. Someone saves in Pages CMS (or pushes a commit to `main`).
2. GitHub Actions runs **Build and deploy** (`.github/workflows/deploy.yml`):
   1. install dependencies (`npm ci`),
   2. `astro check` — validates every content file against its schema,
   3. `npm run build` — builds `dist/` with the URL and base path read from the Pages settings,
   4. `scripts/check-site.mjs` — links, alt text, titles, headings, JS budget,
   5. publish `dist/` to GitHub Pages.
3. If any step fails, nothing is published. The old site stays up and GitHub emails the committer.

It also runs **nightly** (so finished events move to "Past") and on demand.

Pull requests run steps 2.1–2.4 only, as a check.

## One-time setup

- Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- **Settings → Actions → General**: allow GitHub Actions.
- Optional: **Settings → Branches**: require the "build" check before merging PRs.

## Reading a failed build

1. Repository → **Actions** → click the red ✗ run → click the failed step.
2. Common messages:
   - `… events → 2026-11-20-…md: start: Required` — a required field is empty. Fix the entry in Pages CMS.
   - `A Completed project needs an end date and at least one output` — add them, or change the status.
   - `Add alt text for the cover image` — fill in the alt text field.
   - `broken internal link /website/…` — a link points to a page that doesn't exist.
3. Fix the content and save again; a new build starts automatically.

## Re-running

**Actions → Build and deploy → Run workflow** (uses `main`). Use it after changing Pages settings or a custom domain.

## Rolling back

- One bad content edit: fix it in Pages CMS, or restore from the file's History (see EDITING.md, task 7).
- A bad commit: `git revert <sha> && git push`. The workflow publishes the reverted site.
- Emergency: **Actions** → open the last good run → **Re-run all jobs** redeploys that version.

## Nightly schedule caveat

GitHub disables scheduled workflows in public repositories after 60 days without commits (typically over summer). The site also hides finished events in the visitor's browser, so this is harmless; any commit re-enables the schedule. You can also re-enable it under **Actions → Build and deploy**.
