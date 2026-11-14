/**
 * Turn a site-root path ("/events") into a link that also works when the site
 * is served from a sub-path such as https://synapseatgt.github.io/website/.
 * External links, mailto:, tel: and #anchors are returned unchanged.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path: string): string {
  if (!path) return path;
  if (/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(path)) return path;
  if (BASE && (path === BASE || path.startsWith(BASE + '/'))) return path;
  return BASE + (path.startsWith('/') ? path : '/' + path);
}

/** True when `current` is `target` or a page below it (for nav highlighting). */
export function isActive(current: string, target: string): boolean {
  const strip = (p: string) => p.replace(/\/+$/, '') || '/';
  const c = strip(current);
  const t = strip(href(target));
  return c === t || c.startsWith(t + '/');
}
