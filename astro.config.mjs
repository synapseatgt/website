// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

/*
 * SITE_URL and BASE_PATH are set by the GitHub Actions workflow from the
 * GitHub Pages settings, so the same code works on
 *   https://synapseatgt.github.io/website/  (base "/website")
 * and later on a custom domain                (base "/").
 * Locally they are unset and the site runs at http://localhost:4321/.
 */
const site = process.env.SITE_URL || 'https://synapseatgt.github.io';
const base = process.env.BASE_PATH || '/';

/**
 * Links and images written in Markdown as "/files/x.pdf" or "/events" are
 * relative to the site root. When the site lives under a sub-path (the
 * github.io address), prefix them with the base path so they still work.
 */
function rehypePrefixBase() {
  const prefix = base.replace(/\/$/, '');
  /** @param {any} node */
  const walk = (node) => {
    if (node.type === 'element' && node.properties) {
      for (const attr of ['href', 'src']) {
        const v = node.properties[attr];
        if (prefix && typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(prefix + '/')) {
          node.properties[attr] = prefix + v;
        }
      }
    }
    if (node.children) node.children.forEach(walk);
  };
  return /** @param {any} tree */ (tree) => walk(tree);
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    processor: unified({ rehypePlugins: [rehypePrefixBase] }),
  },
});
