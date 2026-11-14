import { getCollection, getEntry } from 'astro:content';
import { execFileSync } from 'node:child_process';
import { eventEnd, wallToDate } from './dates';

const isLive = <T extends { data: { draft?: boolean } }>(e: T) => import.meta.env.DEV || !e.data.draft;

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Missing src/content/settings/site.yaml');
  return entry.data;
}

export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing src/content/pages/${id}.md`);
  return entry;
}

const STATUS_ORDER = { Active: 0, Recruiting: 1, Planned: 2, Completed: 3 } as const;

export async function getProjects() {
  const all = (await getCollection('projects')).filter(isLive);
  return all.sort(
    (a, b) =>
      STATUS_ORDER[a.data.status] - STATUS_ORDER[b.data.status] ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** Up to three projects for the home page: ticked "featured" first, else most recently updated active ones. */
export async function getFeaturedProjects(limit = 3) {
  const all = await getProjects();
  const featured = all.filter((p) => p.data.featured && p.data.status !== 'Completed');
  if (featured.length) return featured.slice(0, limit);
  const active = all.filter((p) => p.data.status === 'Active' || p.data.status === 'Recruiting');
  return active
    .map((p) => ({ p, t: lastModified(p.filePath)?.getTime() ?? 0 }))
    .sort((a, b) => b.t - a.t)
    .map(({ p }) => p)
    .slice(0, limit);
}

export async function getEvents() {
  const all = (await getCollection('events')).filter(isLive);
  return all.sort((a, b) => wallToDate(a.data.start).getTime() - wallToDate(b.data.start).getTime());
}

/** Split events at build time. A small script on the page re-checks against the visitor's clock. */
export async function getEventsSplit(now = new Date()) {
  const all = await getEvents();
  const upcoming = all.filter((e) => eventEnd(e.data.start, e.data.end ?? undefined) >= now);
  const past = all.filter((e) => eventEnd(e.data.start, e.data.end ?? undefined) < now).reverse();
  return { upcoming, past };
}

export async function getPublications() {
  const all = (await getCollection('publications')).filter(isLive);
  return all.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function getOfficers() {
  const all = await getCollection('officers');
  const byOrder = (a: (typeof all)[number], b: (typeof all)[number]) =>
    a.data.order - b.data.order || a.data.name.localeCompare(b.data.name);
  const current = all.filter((o) => o.data.active).sort(byOrder);
  const past = all.filter((o) => !o.data.active).sort((a, b) => b.data.term.localeCompare(a.data.term) || byOrder(a, b));
  return { current, past };
}

/** Event has a long description, so it gets its own page. */
export function hasDetailPage(entry: { body?: string }) {
  return Boolean(entry.body && entry.body.trim());
}

const gitCache = new Map<string, Date | undefined>();

/** Date of the last commit that touched a file (or the repo, if no path). */
export function lastModified(filePath?: string): Date | undefined {
  const key = filePath ?? '';
  if (gitCache.has(key)) return gitCache.get(key);
  let result: Date | undefined;
  try {
    const args = ['log', '-1', '--format=%cI'];
    if (filePath) args.push('--', filePath);
    const out = execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    result = out ? new Date(out) : undefined;
  } catch {
    result = undefined;
  }
  gitCache.set(key, result);
  return result;
}

export function formatUpdated(d: Date | undefined): string {
  const date = d ?? new Date();
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'America/New_York' }).format(date);
}
